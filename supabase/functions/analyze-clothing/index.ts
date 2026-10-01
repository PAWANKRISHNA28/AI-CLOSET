import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle browser CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    // --------------------------------------------------
    // 1. Get authenticated user
    // --------------------------------------------------

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // --------------------------------------------------
    // 2. Get image path from request
    // --------------------------------------------------

    const body = await req.json();

    const imagePath = body.imagePath;

    if (!imagePath || typeof imagePath !== "string") {
      return new Response(
        JSON.stringify({
          error: "imagePath is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Security check:
    // Users can only analyze images inside their own folder.
    if (!imagePath.startsWith(`${user.id}/`)) {
      return new Response(
        JSON.stringify({
          error: "You do not have access to this image.",
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // --------------------------------------------------
    // 3. Create temporary signed URL
    // --------------------------------------------------

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("clothing-images")
        .createSignedUrl(imagePath, 300);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);

      return new Response(
        JSON.stringify({
          error: "Could not access clothing image.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // --------------------------------------------------
    // 4. Initialize OpenAI
    // --------------------------------------------------

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });

    // --------------------------------------------------
    // 5. Analyze clothing image
    // --------------------------------------------------

    const response = await openai.responses.create({
      model: "gpt-5",

      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Analyze this clothing image for an AI wardrobe application.

Identify the clothing item and return ONLY valid JSON.

Use exactly these fields:

{
  "item": "specific clothing item name",
  "category": "Tops | Bottoms | Shoes | Outerwear | Accessories | Dresses",
  "color": "main color",
  "style": "style description",
  "season": "Spring | Summer | Autumn | Winter | All Season",
  "occasions": ["Casual", "Work", "Party", "Formal", "Sports"],
  "confidence": 0
}

Rules:

- item should be specific, such as "Oxford Shirt", "Slim Fit Jeans", "White Sneakers".
- category must be one of the listed categories.
- color should describe the dominant visible color.
- style should be concise.
- season should represent the most suitable season.
- occasions should contain only suitable occasions from the provided list.
- confidence must be a number from 0 to 100.
- Do not include markdown.
- Do not include explanations.
- Return JSON only.
              `,
            },
            {
              type: "input_image",
              image_url: signedUrlData.signedUrl,
            },
          ],
        },
      ],
    });

    // --------------------------------------------------
    // 6. Parse AI response
    // --------------------------------------------------

    const outputText = response.output_text?.trim();

    if (!outputText) {
      throw new Error("OpenAI returned an empty response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(outputText);
    } catch {
      console.error("Invalid OpenAI JSON:", outputText);

      throw new Error(
        "AI returned an invalid clothing analysis.",
      );
    }

    // --------------------------------------------------
    // 7. Return result to frontend
    // --------------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        userId: user.id,
        imagePath,
        analysis,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Analyze clothing error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing the clothing.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});