import { useState } from "react";
import { supabase } from "../../lib/supabase";
import type { ClothingItem } from "../layout/AppLayout";

interface AddClothesProps {
  onSave: (
    item: Omit<
      ClothingItem,
      "id" | "dateAdded" | "favorite"
    >
  ) => void;
  onCancel: () => void;
}

interface AIAnalysis {
  item?: string;
  category?: string;
  color?: string;
  style?: string;
  season?: string;
  occasions?: string[];
  confidence?: number;
}

function AddClothes({
  onSave,
  onCancel,
}: AddClothesProps) {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [itemName, setItemName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [color, setColor] =
    useState("");

  const [style, setStyle] =
    useState("");

  const [season, setSeason] =
    useState("All season");

  const [occasions, setOccasions] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiAnalyzed, setAiAnalyzed] =
    useState(false);

  const [aiConfidence, setAiConfidence] =
    useState<number | null>(null);

  const [uploadedImagePath, setUploadedImagePath] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const occasionOptions = [
    "Everyday",
    "Work",
    "Travel",
    "Party",
    "Sports",
  ];

  /*
   * --------------------------------------------------
   * File selection
   * --------------------------------------------------
   */

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");
    setSuccess("");
    setAiAnalyzed(false);
    setAiConfidence(null);

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Only allow image files.
     */
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    /*
     * Limit image size to 5 MB.
     */
    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5 MB."
      );
      return;
    }

    /*
     * If another image was already uploaded
     * for AI analysis, remove it.
     */
    if (uploadedImagePath) {
      await supabase.storage
        .from("clothing-images")
        .remove([uploadedImagePath]);

      setUploadedImagePath(null);
    }

    setSelectedFile(file);

    /*
     * Clear previously detected information
     * when a new image is selected.
     */
    setItemName("");
    setCategory("");
    setColor("");
    setStyle("");
    setSeason("All season");
    setOccasions([]);
  };

  /*
   * --------------------------------------------------
   * Occasion selection
   * --------------------------------------------------
   */

  const toggleOccasion = (
    occasion: string
  ) => {
    setOccasions((current) =>
      current.includes(occasion)
        ? current.filter(
            (item) => item !== occasion
          )
        : [...current, occasion]
    );
  };

  /*
   * --------------------------------------------------
   * Upload image to Supabase Storage
   * --------------------------------------------------
   */

  const uploadImage = async () => {
    if (!selectedFile) {
      throw new Error(
        "Please select a clothing image."
      );
    }

    /*
     * If the image was already uploaded,
     * reuse the existing path.
     */
    if (uploadedImagePath) {
      return uploadedImagePath;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }

    const fileExtension =
      selectedFile.name
        .split(".")
        .pop() || "jpg";

    const fileName =
      `${crypto.randomUUID()}.${fileExtension}`;

    const filePath =
      `${user.id}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("clothing-images")
        .upload(
          filePath,
          selectedFile,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              selectedFile.type,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    setUploadedImagePath(filePath);

    return filePath;
  };

  /*
   * --------------------------------------------------
   * Normalize AI category
   * --------------------------------------------------
   */

  const normalizeCategory = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    const normalized =
      value.trim().toLowerCase();

    const categoryMap: Record<
      string,
      string
    > = {
      tops: "Tops",
      top: "Tops",
      bottoms: "Bottoms",
      bottom: "Bottoms",
      shoes: "Shoes",
      shoe: "Shoes",
      footwear: "Shoes",
      outerwear: "Outerwear",
      accessories: "Accessories",
      accessory: "Accessories",
      dresses: "Tops",
      dress: "Tops",
    };

    return (
      categoryMap[normalized] || value
    );
  };

  /*
   * --------------------------------------------------
   * Normalize AI style
   * --------------------------------------------------
   */

  const normalizeStyle = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    const normalized =
      value.trim().toLowerCase();

    if (
      normalized.includes("smart")
    ) {
      return "Smart Casual";
    }

    if (
      normalized.includes("formal")
    ) {
      return "Formal";
    }

    if (
      normalized.includes("sport")
    ) {
      return "Sporty";
    }

    if (
      normalized.includes("casual")
    ) {
      return "Casual";
    }

    return value;
  };

  /*
   * --------------------------------------------------
   * Normalize AI season
   * --------------------------------------------------
   */

  const normalizeSeason = (
    value?: string
  ) => {
    if (!value) {
      return "All season";
    }

    const normalized =
      value.trim().toLowerCase();

    if (
      normalized === "summer"
    ) {
      return "Summer";
    }

    if (
      normalized === "winter"
    ) {
      return "Winter";
    }

    if (
      normalized === "monsoon"
    )
      return "Monsoon";

    return "All season";
  };

  /*
   * --------------------------------------------------
   * Normalize AI occasions
   * --------------------------------------------------
   */

  const normalizeOccasions = (
    values?: string[]
  ) => {
    if (!Array.isArray(values)) {
      return [];
    }

    const result: string[] = [];

    values.forEach((value) => {
      const normalized =
        value.trim().toLowerCase();

      let mapped = "";

      if (
        normalized.includes("casual") ||
        normalized.includes("everyday")
      ) {
        mapped = "Everyday";
      } else if (
        normalized.includes("work") ||
        normalized.includes("business")
      ) {
        mapped = "Work";
      } else if (
        normalized.includes("travel")
      ) {
        mapped = "Travel";
      } else if (
        normalized.includes("party")
      ) {
        mapped = "Party";
      } else if (
        normalized.includes("sport")
      ) {
        mapped = "Sports";
      }

      if (
        mapped &&
        !result.includes(mapped)
      ) {
        result.push(mapped);
      }
    });

    return result;
  };

  /*
   * --------------------------------------------------
   * AI Vision analysis
   * --------------------------------------------------
   */

  const handleAnalyzeWithAI = async () => {
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError(
        "Please select a clothing image first."
      );
      return;
    }

    try {
      setAiLoading(true);

      /*
       * Upload image first.
       */
      const imagePath =
        await uploadImage();

      /*
       * Call Supabase Edge Function.
       */
      const {
        data,
        error: functionError,
      } = await supabase.functions.invoke(
        "analyze-clothing",
        {
          body: {
            imagePath,
          },
        }
      );

      if (functionError) {
        console.error(
          "AI function error:",
          functionError
        );

        throw new Error(
          functionError.message ||
            "AI analysis failed."
        );
      }

      if (
        !data ||
        !data.success ||
        !data.analysis
      ) {
        throw new Error(
          data?.error ||
            "AI could not analyze this image."
        );
      }

      const analysis =
        data.analysis as AIAnalysis;

      /*
       * Automatically fill the form.
       */
      setItemName(
        analysis.item?.trim() || ""
      );

      setCategory(
        normalizeCategory(
          analysis.category
        )
      );

      setColor(
        analysis.color?.trim() || ""
      );

      setStyle(
        normalizeStyle(
          analysis.style
        )
      );

      setSeason(
        normalizeSeason(
          analysis.season
        )
      );

      const detectedOccasions =
        normalizeOccasions(
          analysis.occasions
        );

      setOccasions(
        detectedOccasions
      );

      if (
        typeof analysis.confidence ===
        "number"
      ) {
        setAiConfidence(
          analysis.confidence
        );
      }

      setAiAnalyzed(true);

      setSuccess(
        "AI identified your clothing item. Please review the details before saving."
      );
    } catch (analysisError) {
      console.error(
        "AI analysis failed:",
        analysisError
      );

      /*
       * Remove the uploaded image if
       * AI analysis fails.
       */
      if (uploadedImagePath) {
        await supabase.storage
          .from("clothing-images")
          .remove([
            uploadedImagePath,
          ]);

        setUploadedImagePath(null);
      }

      if (
        analysisError instanceof Error
      ) {
        setError(
          analysisError.message
        );
      } else {
        setError(
          "Unable to analyze the clothing image."
        );
      }
    } finally {
      setAiLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * Save clothing item
   * --------------------------------------------------
   */

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError(
        "Please select a clothing image."
      );
      return;
    }

    if (!itemName.trim()) {
      setError(
        "Please enter an item name."
      );
      return;
    }

    if (!category) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!color.trim()) {
      setError(
        "Please enter a color."
      );
      return;
    }

    if (!style) {
      setError(
        "Please select a style."
      );
      return;
    }

    if (occasions.length === 0) {
      setError(
        "Please select at least one occasion."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Get current authenticated user.
       */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(
          "Your session has expired. Please sign in again."
        );
        return;
      }

      /*
       * Upload image if it hasn't already
       * been uploaded by AI analysis.
       */
      const filePath =
        await uploadImage();

      /*
       * Save clothing information in database.
       */
      const {
        data,
        error: insertError,
      } = await supabase
        .from("clothing_items")
        .insert({
          user_id: user.id,
          name: itemName.trim(),
          category,
          color: color.trim(),
          style,
          season,
          occasions,
          image_url: filePath,
          favorite: false,
        })
        .select()
        .single();

      if (insertError) {
        /*
         * If database insertion fails,
         * remove uploaded image.
         */
        await supabase.storage
          .from("clothing-images")
          .remove([filePath]);

        setUploadedImagePath(null);

        throw insertError;
      }

      /*
       * Convert database record to the
       * format expected by AppLayout.
       */
      const newItem: Omit<
        ClothingItem,
        "id" | "dateAdded" | "favorite"
      > = {
        name: data.name,
        category: data.category,
        color: data.color,
        style: data.style,
        season: data.season,
        occasions:
          data.occasions ?? [],
        image:
          data.image_url ??
          undefined,
      };

      /*
       * Update React state.
       */
      onSave(newItem);

      setSuccess(
        "Clothing item saved successfully!"
      );

      setUploadedImagePath(null);
    } catch (saveError) {
      console.error(
        "Failed to save clothing item:",
        saveError
      );

      if (
        saveError instanceof Error
      ) {
        setError(
          saveError.message
        );
      } else {
        setError(
          "Unable to save the clothing item."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * Render
   * --------------------------------------------------
   */

  return (
    <section className="add-clothes-page">

      <div className="page-heading">

        <div>
          <span className="page-eyebrow">
            CLOSET
          </span>

          <h1>
            Add Clothes
          </h1>

          <p>
            Add an item to your digital wardrobe.
          </p>
        </div>

      </div>

      <div className="add-clothes-layout">

        {/* IMAGE UPLOAD */}

        <div className="add-clothes-card">

          <div className="add-card-header">

            <h2>
              Clothing image
            </h2>

            <span>
              Required
            </span>

          </div>

          <label
            htmlFor="clothing-image"
            className={`clothing-upload ${
              selectedFile
                ? "uploaded"
                : ""
            }`}
          >

            <input
              id="clothing-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />

            {selectedFile ? (
              <>
                <div className="upload-icon">
                  ✓
                </div>

                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  Click to change image
                </span>
              </>
            ) : (
              <>
                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  Upload clothing image
                </strong>

                <span>
                  JPG, PNG or WEBP · Max 5 MB
                </span>
              </>
            )}

          </label>

          {/* AI VISION */}

          <div className="ai-detection-box">

            <span className="ai-detection-icon">
              ✦
            </span>

            <div className="ai-detection-content">

              <strong>
                AI Vision
              </strong>

              <p>
                Let AI identify the clothing
                item and automatically fill
                the details.
              </p>

              {aiConfidence !== null && (
                <small>
                  AI confidence:{" "}
                  {aiConfidence}%
                </small>
              )}

              <button
                type="button"
                className="primary-action-button ai-analyze-button"
                onClick={
                  handleAnalyzeWithAI
                }
                disabled={
                  !selectedFile ||
                  aiLoading ||
                  loading
                }
              >
                {aiLoading
                  ? "Analyzing..."
                  : aiAnalyzed
                    ? "✨ Analyze Again"
                    : "✨ Analyze with AI"}
              </button>

            </div>

          </div>

        </div>

        {/* CLOTHING DETAILS */}

        <div className="add-clothes-card">

          <div className="add-card-header">

            <h2>
              Clothing details
            </h2>

            <span>
              Required fields
            </span>

          </div>

          <div className="add-form">

            {/* NAME */}

            <div className="add-form-field">

              <label htmlFor="item-name">
                Item name
              </label>

              <input
                id="item-name"
                type="text"
                placeholder="e.g. Oxford Shirt"
                value={itemName}
                onChange={(event) =>
                  setItemName(
                    event.target.value
                  )
                }
              />

            </div>

            {/* CATEGORY */}

            <div className="add-form-field">

              <label htmlFor="item-category">
                Category
              </label>

              <select
                id="item-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select category
                </option>

                <option value="Tops">
                  Tops
                </option>

                <option value="Bottoms">
                  Bottoms
                </option>

                <option value="Shoes">
                  Shoes
                </option>

                <option value="Outerwear">
                  Outerwear
                </option>

                <option value="Accessories">
                  Accessories
                </option>

              </select>

            </div>

            {/* COLOR */}

            <div className="add-form-field">

              <label htmlFor="item-color">
                Color
              </label>

              <input
                id="item-color"
                type="text"
                placeholder="e.g. White"
                value={color}
                onChange={(event) =>
                  setColor(
                    event.target.value
                  )
                }
              />

            </div>

            {/* STYLE */}

            <div className="add-form-field">

              <label htmlFor="item-style">
                Style
              </label>

              <select
                id="item-style"
                value={style}
                onChange={(event) =>
                  setStyle(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Select style
                </option>

                <option value="Casual">
                  Casual
                </option>

                <option value="Smart Casual">
                  Smart Casual
                </option>

                <option value="Formal">
                  Formal
                </option>

                <option value="Sporty">
                  Sporty
                </option>

              </select>

            </div>

            {/* SEASON */}

            <div className="add-form-field">

              <label>
                Season
              </label>

              <div className="season-options">

                {[
                  "All season",
                  "Summer",
                  "Winter",
                  "Monsoon",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      season === option
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSeason(option)
                    }
                  >
                    {option}
                  </button>
                ))}

              </div>

            </div>

            {/* OCCASIONS */}

            <div className="add-form-field">

              <label>
                Occasions
              </label>

              <div className="occasion-options">

                {occasionOptions.map(
                  (occasion) => (
                    <button
                      key={occasion}
                      type="button"
                      className={
                        occasions.includes(
                          occasion
                        )
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        toggleOccasion(
                          occasion
                        )
                      }
                    >
                      {occasion}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="auth-message auth-error">
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="auth-message auth-success">
          {success}
        </div>
      )}

      {/* ACTIONS */}

      <div className="add-clothes-actions">

        <button
          type="button"
          className="secondary-action-button"
          onClick={onCancel}
          disabled={
            loading || aiLoading
          }
        >
          Cancel
        </button>

        <button
          type="button"
          className="primary-action-button"
          onClick={handleSave}
          disabled={
            loading || aiLoading
          }
        >

          {loading
            ? "Saving..."
            : "Save to Closet"}

          {!loading && (
            <span>
              →
            </span>
          )}

        </button>

      </div>

    </section>
  );
}

export default AddClothes;