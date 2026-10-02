import { useState } from "react";
import { supabase } from "../../lib/supabase";
import type { ClothingItem } from "../layout/AppLayout";
import "./AddClothes.css";

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

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image must be smaller than 5 MB."
      );
      return;
    }

    /*
     * Remove previously uploaded image.
     */
    if (uploadedImagePath) {
      await supabase.storage
        .from("clothing-images")
        .remove([uploadedImagePath]);

      setUploadedImagePath(null);
    }

    setSelectedFile(file);

    /*
     * Clear previous detected information.
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
   * CLOTHING CROP
   *
   * The original photo is used for AI analysis.
   * A cropped version is created only when
   * saving the clothing item.
   * --------------------------------------------------
   */

  const createClothingCrop = async (
    file: File,
    clothingCategory: string
  ): Promise<File> => {
    /*
     * Categories that should be cropped.
     */
    const normalizedCategory =
      clothingCategory.trim().toLowerCase();

    let cropStart = 0;
    let cropEnd = 1;

    /*
     * TOPS
     *
     * Keep the upper/middle portion of
     * the person's body.
     */
    if (
      normalizedCategory === "tops" ||
      normalizedCategory === "top"
    ) {
      cropStart = 0.10;
      cropEnd = 0.62;
    }

    /*
     * BOTTOMS
     *
     * Keep the middle/lower portion.
     */
    else if (
      normalizedCategory === "bottoms" ||
      normalizedCategory === "bottom"
    ) {
      cropStart = 0.38;
      cropEnd = 0.90;
    }

    /*
     * SHOES
     *
     * Keep the lower portion.
     */
    else if (
      normalizedCategory === "shoes" ||
      normalizedCategory === "shoe" ||
      normalizedCategory === "footwear"
    ) {
      cropStart = 0.62;
      cropEnd = 1;
    }

    /*
     * For categories such as:
     * Outerwear / Accessories
     * keep the original image.
     */
    else {
      return file;
    }

    return new Promise<File>(
      (resolve, reject) => {
        const image =
          new Image();

        const objectUrl =
          URL.createObjectURL(file);

        image.onload = () => {
          try {
            const canvas =
              document.createElement(
                "canvas"
              );

            const sourceWidth =
              image.naturalWidth;

            const sourceHeight =
              image.naturalHeight;

            /*
             * Calculate vertical crop.
             */
            const sourceY =
              Math.round(
                sourceHeight *
                  cropStart
              );

            const cropHeight =
              Math.round(
                sourceHeight *
                  (cropEnd -
                    cropStart)
              );

            /*
             * Keep original width.
             */
            canvas.width =
              sourceWidth;

            canvas.height =
              cropHeight;

            const context =
              canvas.getContext(
                "2d"
              );

            if (!context) {
              URL.revokeObjectURL(
                objectUrl
              );

              reject(
                new Error(
                  "Unable to process the clothing image."
                )
              );

              return;
            }

            /*
             * Draw only the clothing region.
             */
            context.drawImage(
              image,
              0,
              sourceY,
              sourceWidth,
              cropHeight,
              0,
              0,
              sourceWidth,
              cropHeight
            );

            /*
             * Convert canvas back to a File.
             */
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(
                  objectUrl
                );

                if (!blob) {
                  reject(
                    new Error(
                      "Unable to create cropped image."
                    )
                  );

                  return;
                }

                const extension =
                  file.type ===
                  "image/png"
                    ? "png"
                    : "jpg";

                const croppedFile =
                  new File(
                    [blob],
                    `clothing-${crypto.randomUUID()}.${extension}`,
                    {
                      type:
                        file.type ===
                        "image/png"
                          ? "image/png"
                          : "image/jpeg",
                    }
                  );

                resolve(
                  croppedFile
                );
              },
              file.type ===
                "image/png"
                ? "image/png"
                : "image/jpeg",
              0.92
            );
          } catch (cropError) {
            URL.revokeObjectURL(
              objectUrl
            );

            reject(cropError);
          }
        };

        image.onerror = () => {
          URL.revokeObjectURL(
            objectUrl
          );

          reject(
            new Error(
              "Unable to read the selected image."
            )
          );
        };

        image.src = objectUrl;
      }
    );
  };

  /*
   * --------------------------------------------------
   * Upload image to Supabase Storage
   * --------------------------------------------------
   */

  const uploadFileToStorage = async (
    file: File
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }

    const fileExtension =
      file.type === "image/png"
        ? "png"
        : "jpg";

    const fileName =
      `${crypto.randomUUID()}.${fileExtension}`;

    const filePath =
      `${user.id}/${fileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("clothing-images")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              file.type ===
              "image/png"
                ? "image/png"
                : "image/jpeg",
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  /*
   * --------------------------------------------------
   * Upload original image
   *
   * This image is used by AI analysis.
   * --------------------------------------------------
   */

  const uploadImage = async () => {
    if (!selectedFile) {
      throw new Error(
        "Please select a clothing image."
      );
    }

    /*
     * Reuse existing uploaded image.
     */
    if (uploadedImagePath) {
      return uploadedImagePath;
    }

    const filePath =
      await uploadFileToStorage(
        selectedFile
      );

    setUploadedImagePath(
      filePath
    );

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
      categoryMap[normalized] ||
      value
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
    ) {
      return "Monsoon";
    }

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

  const handleAnalyzeWithAI =
    async () => {
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
         * Upload ORIGINAL image for AI.
         */
        const imagePath =
          await uploadImage();

        /*
         * Call Supabase Edge Function.
         */
        const {
          data,
          error: functionError,
        } =
          await supabase.functions.invoke(
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
         * Automatically fill form.
         */
        setItemName(
          analysis.item?.trim() ||
            ""
        );

        setCategory(
          normalizeCategory(
            analysis.category
          )
        );

        setColor(
          analysis.color?.trim() ||
            ""
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
         * Remove original image if
         * AI analysis fails.
         */
        if (uploadedImagePath) {
          await supabase.storage
            .from("clothing-images")
            .remove([
              uploadedImagePath,
            ]);

          setUploadedImagePath(
            null
          );
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
       * Get authenticated user.
       */
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "Your session has expired. Please sign in again."
        );
        return;
      }

      /*
       * ------------------------------------------------
       * CREATE CLOTHING-SPECIFIC IMAGE
       * ------------------------------------------------
       *
       * AI analyzed the original image.
       * Now we create a cropped version for
       * the actual closet/dashboard.
       */
      let finalImagePath =
        uploadedImagePath;

      let croppedFile: File;

      try {
        croppedFile =
          await createClothingCrop(
            selectedFile,
            category
          );
      } catch (cropError) {
        console.warn(
          "Clothing crop failed. Using original image instead.",
          cropError
        );

        croppedFile =
          selectedFile;
      }

      /*
       * If the crop produced a new file,
       * upload it separately.
       */
      if (
        croppedFile !== selectedFile
      ) {
        finalImagePath =
          await uploadFileToStorage(
            croppedFile
          );

        /*
         * Remove the original AI-analysis
         * image because the final closet
         * image is now the cropped image.
         */
        if (uploadedImagePath) {
          await supabase.storage
            .from("clothing-images")
            .remove([
              uploadedImagePath,
            ]);
        }
      }

      /*
       * If no original image existed,
       * upload the selected file.
       */
      if (!finalImagePath) {
        finalImagePath =
          await uploadFileToStorage(
            croppedFile
          );
      }

      /*
       * Save clothing information.
       */
      const {
        data,
        error: insertError,
      } =
        await supabase
          .from("clothing_items")
          .insert({
            user_id: user.id,
            name: itemName.trim(),
            category,
            color: color.trim(),
            style,
            season,
            occasions,
            image_url:
              finalImagePath,
            favorite: false,
          })
          .select()
          .single();

      if (insertError) {
        /*
         * Remove final image if
         * database insertion fails.
         */
        if (finalImagePath) {
          await supabase.storage
            .from("clothing-images")
            .remove([
              finalImagePath,
            ]);
        }

        throw insertError;
      }

      /*
       * Convert database record to
       * AppLayout format.
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

      setUploadedImagePath(
        null
      );
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
              onChange={
                handleFileChange
              }
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