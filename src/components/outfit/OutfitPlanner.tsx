import type { ClothingItem } from "../layout/AppLayout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./OutfitPlanner.css";

interface OutfitPlannerProps {
  clothingItems: ClothingItem[];
}

interface GeneratedOutfit {
  name: string;
  match: number;
  shirt?: ClothingItem;
  pants?: ClothingItem;
  shoes?: ClothingItem;
  occasion: string;
  style: string;
  reason: string;
}

interface OutfitImages {
  shirt?: string;
  pants?: string;
  shoes?: string;
}

/* =========================================================
   HELPERS
========================================================= */

const normalize = (
  value: string | undefined | null
) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const categoryContains = (
  category: string | undefined | null,
  keywords: string[]
) => {
  const value = normalize(category);

  return keywords.some((keyword) =>
    value.includes(keyword)
  );
};

/* =========================================================
   CATEGORY DETECTION
========================================================= */

const isTopCategory = (
  category: string | undefined | null
) => {
  return categoryContains(category, [
    "top",
    "tops",
    "shirt",
    "shirts",
    "t-shirt",
    "tshirt",
    "tee",
    "tees",
    "polo",
    "blouse",
    "kurta",
    "kurti",
    "crop",
    "sweater",
    "sweatshirt",
    "hoodie",
    "jacket",
    "coat",
    "outerwear",
    "cardigan",
  ]);
};

const isBottomCategory = (
  category: string | undefined | null
) => {
  return categoryContains(category, [
    "bottom",
    "bottoms",
    "pant",
    "pants",
    "trouser",
    "trousers",
    "jean",
    "jeans",
    "short",
    "shorts",
    "skirt",
    "leggings",
    "legging",
    "jogger",
    "joggers",
    "track",
    "chino",
    "cargo",
  ]);
};

const isShoesCategory = (
  category: string | undefined | null
) => {
  return categoryContains(category, [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "footwear",
    "boot",
    "boots",
    "sandal",
    "sandals",
    "slipper",
    "slippers",
    "loafer",
    "loafers",
    "flat",
    "flats",
    "heel",
    "heels",
    "running",
  ]);
};

/* =========================================================
   COLOR HELPERS
========================================================= */

const neutralColors = [
  "black",
  "white",
  "grey",
  "gray",
  "beige",
  "cream",
  "brown",
  "navy",
  "dark blue",
  "charcoal",
  "khaki",
  "olive",
];

const isNeutralColor = (
  color: string | undefined | null
) => {
  const value = normalize(color);

  return neutralColors.some((neutral) =>
    value.includes(neutral)
  );
};

/* =========================================================
   OCCASION HELPERS
========================================================= */

const getOccasions = (
  item: ClothingItem
) => {
  if (!Array.isArray(item.occasions)) {
    return [];
  }

  return item.occasions
    .map(normalize)
    .filter(Boolean);
};

const getCommonOccasions = (
  first: ClothingItem,
  second: ClothingItem,
  third: ClothingItem
) => {
  const firstOccasions =
    getOccasions(first);

  const secondOccasions =
    getOccasions(second);

  const thirdOccasions =
    getOccasions(third);

  return firstOccasions.filter(
    (occasion) =>
      secondOccasions.includes(occasion) &&
      thirdOccasions.includes(occasion)
  );
};

/* =========================================================
   STYLE HELPERS
========================================================= */

const stylesMatch = (
  first: ClothingItem,
  second: ClothingItem
) => {
  const firstStyle =
    normalize(first.style);

  const secondStyle =
    normalize(second.style);

  if (!firstStyle || !secondStyle) {
    return false;
  }

  return (
    firstStyle === secondStyle ||
    firstStyle.includes(secondStyle) ||
    secondStyle.includes(firstStyle)
  );
};

/* =========================================================
   SCORE OUTFIT
========================================================= */

const scoreCombination = (
  top: ClothingItem,
  bottom: ClothingItem,
  shoes: ClothingItem
) => {
  let score = 65;

  const topColor =
    normalize(top.color);

  const bottomColor =
    normalize(bottom.color);

  const shoesColor =
    normalize(shoes.color);

  const topSeason =
    normalize(top.season);

  const bottomSeason =
    normalize(bottom.season);

  const shoesSeason =
    normalize(shoes.season);

  /* STYLE */

  if (stylesMatch(top, bottom)) {
    score += 8;
  }

  if (stylesMatch(top, shoes)) {
    score += 5;
  }

  if (stylesMatch(bottom, shoes)) {
    score += 5;
  }

  /* SEASON */

  if (
    topSeason &&
    bottomSeason &&
    topSeason === bottomSeason
  ) {
    score += 4;
  }

  if (
    topSeason &&
    shoesSeason &&
    topSeason === shoesSeason
  ) {
    score += 3;
  }

  /* OCCASION */

  const commonOccasions =
    getCommonOccasions(
      top,
      bottom,
      shoes
    );

  if (commonOccasions.length > 0) {
    score += 8;
  }

  /* COLOR */

  const topNeutral =
    isNeutralColor(topColor);

  const bottomNeutral =
    isNeutralColor(bottomColor);

  const shoesNeutral =
    isNeutralColor(shoesColor);

  if (shoesNeutral) {
    score += 4;
  }

  if (
    topNeutral &&
    bottomNeutral
  ) {
    score += 4;
  }

  if (
    shoesNeutral &&
    (topNeutral || bottomNeutral)
  ) {
    score += 3;
  }

  /* SAME COLORS */

  if (
    topColor &&
    bottomColor &&
    topColor === bottomColor
  ) {
    score -= 3;
  }

  if (
    topColor &&
    bottomColor &&
    shoesColor &&
    topColor === bottomColor &&
    bottomColor === shoesColor
  ) {
    score -= 5;
  }

  /* FAVORITES */

  if (top.favorite) {
    score += 2;
  }

  if (bottom.favorite) {
    score += 2;
  }

  if (shoes.favorite) {
    score += 2;
  }

  return Math.min(
    Math.max(score, 50),
    99
  );
};

/* =========================================================
   OUTFIT OCCASION
========================================================= */

const getOutfitOccasion = (
  top: ClothingItem,
  bottom: ClothingItem,
  shoes: ClothingItem
) => {
  const common =
    getCommonOccasions(
      top,
      bottom,
      shoes
    );

  if (common.length > 0) {
    const occasion =
      common[0];

    return (
      occasion.charAt(0).toUpperCase() +
      occasion.slice(1)
    );
  }

  return "Everyday";
};

/* =========================================================
   OUTFIT STYLE
========================================================= */

const getOutfitStyle = (
  top: ClothingItem,
  bottom: ClothingItem,
  shoes: ClothingItem
) => {
  const styles = [
    normalize(top.style),
    normalize(bottom.style),
    normalize(shoes.style),
  ].filter(Boolean);

  if (styles.length === 0) {
    return "Personal Style";
  }

  const counts: Record<
    string,
    number
  > = {};

  styles.forEach((style) => {
    counts[style] =
      (counts[style] || 0) + 1;
  });

  const matchingStyle =
    Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0];

  if (
    matchingStyle &&
    matchingStyle[1] >= 2
  ) {
    return (
      matchingStyle[0]
        .charAt(0)
        .toUpperCase() +
      matchingStyle[0].slice(1)
    );
  }

  return (
    styles[0]
      .charAt(0)
      .toUpperCase() +
    styles[0].slice(1)
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function OutfitPlanner({
  clothingItems,
}: OutfitPlannerProps) {
  const [
    selectedOutfit,
    setSelectedOutfit,
  ] = useState(0);

  const [
    outfitImages,
    setOutfitImages,
  ] = useState<OutfitImages>({});

  const [
    alternativeImages,
    setAlternativeImages,
  ] = useState<
    Record<number, OutfitImages>
  >({});

  /* =========================================================
     TODAY
  ========================================================= */

  const today = useMemo(() => {
    return new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    );
  }, []);

  /* =========================================================
     WARDROBE FILTERING
  ========================================================= */

  const tops = useMemo(() => {
    return clothingItems.filter(
      (item) =>
        isTopCategory(item.category)
    );
  }, [clothingItems]);

  const bottoms = useMemo(() => {
    return clothingItems.filter(
      (item) =>
        isBottomCategory(
          item.category
        )
    );
  }, [clothingItems]);

  const shoes = useMemo(() => {
    return clothingItems.filter(
      (item) =>
        isShoesCategory(
          item.category
        )
    );
  }, [clothingItems]);

  /* =========================================================
     GENERATE OUTFITS
  ========================================================= */

  const generatedOutfits =
    useMemo<GeneratedOutfit[]>(() => {
      if (
        tops.length === 0 ||
        bottoms.length === 0 ||
        shoes.length === 0
      ) {
        return [];
      }

      const combinations: GeneratedOutfit[] =
        [];

      tops.forEach((top) => {
        bottoms.forEach(
          (bottom) => {
            shoes.forEach(
              (shoe) => {
                const score =
                  scoreCombination(
                    top,
                    bottom,
                    shoe
                  );

                const occasion =
                  getOutfitOccasion(
                    top,
                    bottom,
                    shoe
                  );

                const style =
                  getOutfitStyle(
                    top,
                    bottom,
                    shoe
                  );

                combinations.push({
                  name: "Smart Casual",

                  match: score,

                  shirt: top,

                  pants: bottom,

                  shoes: shoe,

                  occasion,

                  style,

                  reason:
                    `This look combines ${top.name}, ` +
                    `${bottom.name} and ${shoe.name} ` +
                    `from your wardrobe. The stylist ` +
                    `checks color balance, style, season ` +
                    `and occasion compatibility.`,
                });
              }
            );
          }
        );
      });

      /* BEST MATCH FIRST */

      combinations.sort(
        (a, b) =>
          b.match - a.match
      );

      /* REMOVE DUPLICATES */

      const seen =
        new Set<string>();

      const unique =
        combinations.filter(
          (outfit) => {
            const key = [
              outfit.shirt?.id,
              outfit.pants?.id,
              outfit.shoes?.id,
            ].join("-");

            if (seen.has(key)) {
              return false;
            }

            seen.add(key);

            return true;
          }
        );

      return unique.slice(0, 6);
    }, [
      tops,
      bottoms,
      shoes,
    ]);

  /* =========================================================
     FALLBACK
  ========================================================= */

  const fallbackOutfits:
    GeneratedOutfit[] = [
      {
        name: "Build Your Look",

        match: 0,

        occasion: "Everyday",

        style: "Personal Style",

        reason:
          "Add at least one top, one bottom and one pair of shoes to your closet to generate personalized outfits.",
      },
    ];

  const outfits =
    generatedOutfits.length > 0
      ? generatedOutfits
      : fallbackOutfits;

  /* =========================================================
     RESET INDEX WHEN WARDROBE CHANGES
  ========================================================= */

  useEffect(() => {
    setSelectedOutfit(0);
  }, [clothingItems]);

  /* =========================================================
     SAFE SELECTED INDEX
  ========================================================= */

  const safeSelectedIndex =
    selectedOutfit >=
    outfits.length
      ? 0
      : selectedOutfit;

  const outfit =
    outfits[safeSelectedIndex];

  /* =========================================================
     SIGNED URL HELPER
  ========================================================= */

  const getSignedImageUrl =
    async (
      imagePath:
        | string
        | undefined
    ) => {
      if (!imagePath) {
        return undefined;
      }

      /*
       * Already a complete URL.
       */

      if (
        imagePath.startsWith(
          "http://"
        ) ||
        imagePath.startsWith(
          "https://"
        )
      ) {
        return imagePath;
      }

      /*
       * Supabase private storage path.
       */

      const {
        data,
        error,
      } =
        await supabase.storage
          .from(
            "clothing-images"
          )
          .createSignedUrl(
            imagePath,
            3600
          );

      if (
        error ||
        !data?.signedUrl
      ) {
        console.error(
          "Failed to create clothing image URL:",
          imagePath,
          error
        );

        return undefined;
      }

      return data.signedUrl;
    };

  /* =========================================================
     LOAD MAIN OUTFIT IMAGES
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadMainImages =
      async () => {
        setOutfitImages({});

        const result: OutfitImages =
          {};

        const items = [
          {
            key: "shirt" as const,
            item: outfit?.shirt,
          },
          {
            key: "pants" as const,
            item: outfit?.pants,
          },
          {
            key: "shoes" as const,
            item: outfit?.shoes,
          },
        ];

        for (const {
          key,
          item,
        } of items) {
          if (!item?.image) {
            continue;
          }

          const imageUrl =
            await getSignedImageUrl(
              item.image
            );

          if (imageUrl) {
            result[key] =
              imageUrl;
          }
        }

        if (!cancelled) {
          setOutfitImages(
            result
          );
        }
      };

    loadMainImages();

    return () => {
      cancelled = true;
    };
  }, [
    outfit?.shirt?.id,
    outfit?.pants?.id,
    outfit?.shoes?.id,
  ]);

  /* =========================================================
     LOAD ALTERNATIVE OUTFIT IMAGES
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadAlternativeImages =
      async () => {
        setAlternativeImages({});

        const results: Record<
          number,
          OutfitImages
        > = {};

        /*
         * Only generate image URLs for
         * real generated outfits.
         */

        for (
          let index = 0;
          index <
          generatedOutfits.length;
          index++
        ) {
          const item =
            generatedOutfits[index];

          const result: OutfitImages =
            {};

          if (item.shirt?.image) {
            const url =
              await getSignedImageUrl(
                item.shirt.image
              );

            if (url) {
              result.shirt =
                url;
            }
          }

          if (item.pants?.image) {
            const url =
              await getSignedImageUrl(
                item.pants.image
              );

            if (url) {
              result.pants =
                url;
            }
          }

          if (item.shoes?.image) {
            const url =
              await getSignedImageUrl(
                item.shoes.image
              );

            if (url) {
              result.shoes =
                url;
            }
          }

          results[index] =
            result;
        }

        if (!cancelled) {
          setAlternativeImages(
            results
          );
        }
      };

    loadAlternativeImages();

    return () => {
      cancelled = true;
    };
  }, [generatedOutfits]);

  /* =========================================================
     OUTFIT NAME
  ========================================================= */

  const getOutfitName = (
    currentOutfit:
      GeneratedOutfit,
    index: number
  ) => {
    if (index === 0) {
      return "Smart Casual";
    }

    if (index === 1) {
      return "Relaxed Weekend";
    }

    if (index === 2) {
      return "Classic Look";
    }

    if (index === 3) {
      return "Everyday Essential";
    }

    if (index === 4) {
      return "Clean & Modern";
    }

    return (
      currentOutfit.style ||
      "Personal Look"
    );
  };

  /* =========================================================
     TRY ANOTHER
  ========================================================= */

  const handleTryAnother =
    () => {
      if (
        generatedOutfits.length <=
        1
      ) {
        return;
      }

      setSelectedOutfit(
        (current) =>
          (current + 1) %
          generatedOutfits.length
      );
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="outfit-planner-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="outfit-header">

        <div>

          <span className="outfit-eyebrow">
            PERSONAL STYLE ASSISTANT
          </span>

          <h1>
            AI Stylist
          </h1>

          <p>
            Your wardrobe, weather and
            occasion — brought together
            into one look.
          </p>

        </div>

        <div className="stylist-status">

          <span className="status-dot" />

          Stylist ready

        </div>

      </header>

      {/* =====================================================
          CONTEXT
      ===================================================== */}

      <div className="stylist-context">

        <div className="context-card">

          <span className="context-label">
            TODAY
          </span>

          <strong>
            {today}
          </strong>

          <small>
            Plan your look for today
          </small>

        </div>

        <div className="context-card">

          <span className="context-label">
            WEATHER
          </span>

          <strong>
            28°C · Sunny
          </strong>

          <small>
            Warm and comfortable
          </small>

        </div>

        <div className="context-card">

          <span className="context-label">
            WARDROBE
          </span>

          <strong>
            {clothingItems.length}{" "}
            items available
          </strong>

          <small>
            Using your saved clothing
          </small>

        </div>

      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="stylist-main-grid">

        {/* ===================================================
            MAIN OUTFIT
        =================================================== */}

        <section className="outfit-main-card">

          <div className="outfit-card-top">

            <div>

              <span className="recommendation-label">
                TODAY'S RECOMMENDATION
              </span>

              <h2>
                {getOutfitName(
                  outfit,
                  safeSelectedIndex
                )}
              </h2>

              <p>
                {outfit.occasion} ·{" "}
                {outfit.style}
              </p>

            </div>

            <div className="match-score">

              <strong>
                {outfit.match >
                0
                  ? `${outfit.match}%`
                  : "—"}
              </strong>

              <span>
                {outfit.match >
                0
                  ? "match"
                  : "ready"}
              </span>

            </div>

          </div>

          {/* =================================================
              OUTFIT VISUAL
          ================================================= */}

          <div className="outfit-visual">

            <div className="style-glow" />

            {/* TOP */}

            <div className="clothing-piece shirt-piece">

              <div
                className={`piece-icon ${
                  outfitImages.shirt
                    ? ""
                    : "image-failed"
                }`}
              >

                {outfitImages.shirt ? (
                  <img
                    src={
                      outfitImages.shirt
                    }
                    alt={
                      outfit.shirt
                        ?.name ??
                      "Top"
                    }
                  />
                ) : (
                  <span className="piece-fallback">
                    👕
                  </span>
                )}

              </div>

              <div className="piece-details">

                <span>
                  TOP
                </span>

                <strong>
                  {outfit.shirt
                    ?.name ||
                    "Add a top"}
                </strong>

                <small>
                  {outfit.shirt
                    ?.color ||
                    "—"}
                </small>

              </div>

            </div>

            {/* BOTTOM */}

            <div className="clothing-piece pants-piece">

              <div
                className={`piece-icon ${
                  outfitImages.pants
                    ? ""
                    : "image-failed"
                }`}
              >

                {outfitImages.pants ? (
                  <img
                    src={
                      outfitImages.pants
                    }
                    alt={
                      outfit.pants
                        ?.name ??
                      "Bottom"
                    }
                  />
                ) : (
                  <span className="piece-fallback">
                    👖
                  </span>
                )}

              </div>

              <div className="piece-details">

                <span>
                  BOTTOM
                </span>

                <strong>
                  {outfit.pants
                    ?.name ||
                    "Add a bottom"}
                </strong>

                <small>
                  {outfit.pants
                    ?.color ||
                    "—"}
                </small>

              </div>

            </div>

            {/* SHOES */}

            <div className="clothing-piece shoes-piece">

              <div
                className={`piece-icon ${
                  outfitImages.shoes
                    ? ""
                    : "image-failed"
                }`}
              >

                {outfitImages.shoes ? (
                  <img
                    src={
                      outfitImages.shoes
                    }
                    alt={
                      outfit.shoes
                        ?.name ??
                      "Shoes"
                    }
                  />
                ) : (
                  <span className="piece-fallback">
                    👟
                  </span>
                )}

              </div>

              <div className="piece-details">

                <span>
                  SHOES
                </span>

                <strong>
                  {outfit.shoes
                    ?.name ||
                    "Add shoes"}
                </strong>

                <small>
                  {outfit.shoes
                    ?.color ||
                    "—"}
                </small>

              </div>

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="outfit-actions">

            <button
              type="button"
              className="primary-outfit-button"
              disabled={
                generatedOutfits.length ===
                0
              }
            >
              ✦ Wear this outfit
            </button>

            <button
              type="button"
              className="secondary-outfit-button"
              disabled={
                generatedOutfits.length <=
                1
              }
              onClick={
                handleTryAnother
              }
            >
              ↻ Try another
            </button>

          </div>

        </section>

        {/* ===================================================
            AI EXPLANATION
        =================================================== */}

        <aside className="ai-reason-card">

          <div className="ai-card-heading">

            <div className="ai-symbol">
              ✦
            </div>

            <div>

              <span>
                AI STYLIST
              </span>

              <h3>
                Why this works
              </h3>

            </div>

          </div>

          <p className="ai-reason">
            {outfit.reason}
          </p>

          <div className="reason-divider" />

          <div className="reason-item">

            <span>
              01
            </span>

            <div>

              <strong>
                Wardrobe fit
              </strong>

              <p>
                The outfit is created
                using clothing already
                saved in your closet.
              </p>

            </div>

          </div>

          <div className="reason-item">

            <span>
              02
            </span>

            <div>

              <strong>
                Color balance
              </strong>

              <p>
                The stylist checks
                clothing colors and
                avoids combinations
                that look too repetitive.
              </p>

            </div>

          </div>

          <div className="reason-item">

            <span>
              03
            </span>

            <div>

              <strong>
                Style compatibility
              </strong>

              <p>
                Style, season and
                occasion information
                are used to improve
                the combination.
              </p>

            </div>

          </div>

        </aside>

      </div>

      {/* =====================================================
          ALTERNATIVE OUTFITS
      ===================================================== */}

      <section className="alternatives-section">

        <div className="section-heading">

          <div>

            <span>
              EXPLORE
            </span>

            <h2>
              More looks for today
            </h2>

          </div>

          <small>
            {generatedOutfits.length}{" "}
            combinations
          </small>

        </div>

        <div className="alternative-grid">

          {outfits.map(
            (item, index) => {

              const images =
                alternativeImages[
                  index
                ];

              return (
                <button
                  type="button"
                  key={`${item.shirt?.id || "top"}-${
                    item.pants?.id || "bottom"
                  }-${item.shoes?.id || "shoes"}`}
                  className={`alternative-card ${
                    safeSelectedIndex ===
                    index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedOutfit(
                      index
                    )
                  }
                >

                  {/* =========================================
                      ALTERNATIVE IMAGE PREVIEW
                  ========================================= */}

                  <div className="alternative-preview">

                    {/* TOP */}

                    {images?.shirt ? (
                      <img
                        src={
                          images.shirt
                        }
                        alt={
                          item.shirt
                            ?.name ||
                          "Top"
                        }
                      />
                    ) : (
                      <span>
                        👕
                      </span>
                    )}

                    {/* BOTTOM */}

                    {images?.pants ? (
                      <img
                        src={
                          images.pants
                        }
                        alt={
                          item.pants
                            ?.name ||
                          "Bottom"
                        }
                      />
                    ) : (
                      <span>
                        👖
                      </span>
                    )}

                    {/* SHOES */}

                    {images?.shoes ? (
                      <img
                        src={
                          images.shoes
                        }
                        alt={
                          item.shoes
                            ?.name ||
                          "Shoes"
                        }
                      />
                    ) : (
                      <span>
                        👟
                      </span>
                    )}

                  </div>

                  {/* =========================================
                      ALTERNATIVE INFO
                  ========================================= */}

                  <div className="alternative-info">

                    <div>

                      <strong>
                        {getOutfitName(
                          item,
                          index
                        )}
                      </strong>

                      <small>
                        {item.occasion}{" "}
                        ·{" "}
                        {item.style}
                      </small>

                    </div>

                    <span className="alternative-match">

                      {item.match >
                      0
                        ? `${item.match}%`
                        : "—"}

                    </span>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </section>

    </section>
  );
}

export default OutfitPlanner;