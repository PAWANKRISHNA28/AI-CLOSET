import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { ClothingItem } from "../layout/AppLayout";

interface MyClosetProps {
  clothingItems: ClothingItem[];
  onAddClothes: () => void;
  onDeleteClothing: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

function MyCloset({
  clothingItems,
  onAddClothes,
  onDeleteClothing,
  onToggleFavorite,
}: MyClosetProps) {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] = useState("");

  const [imageUrls, setImageUrls] =
    useState<Record<number, string>>({});

  const categories = [
    "All",
    "Tops",
    "Bottoms",
    "Shoes",
    "Outerwear",
    "Accessories",
  ];

  /*
   * Load secure signed URLs for
   * private Supabase Storage images.
   */
  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      const itemsWithImages =
        clothingItems.filter(
          (item) => item.image
        );

      if (itemsWithImages.length === 0) {
        setImageUrls({});
        return;
      }

      const urls: Record<number, string> = {};

      await Promise.all(
        itemsWithImages.map(async (item) => {
          if (!item.image) return;

          const { data, error } =
            await supabase.storage
              .from("clothing-images")
              .createSignedUrl(
                item.image,
                60 * 60
              );

          if (error) {
            console.error(
              "Image URL error:",
              error
            );
            return;
          }

          if (data?.signedUrl) {
            urls[item.id] =
              data.signedUrl;
          }
        })
      );

      if (!cancelled) {
        setImageUrls(urls);
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [clothingItems]);

  /*
   * Filter clothing items.
   */
  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return clothingItems.filter(
      (item) => {
        const categoryMatch =
          activeCategory === "All" ||
          item.category ===
            activeCategory;

        const searchMatch =
          !query ||
          item.name
            .toLowerCase()
            .includes(query) ||
          item.color
            .toLowerCase()
            .includes(query) ||
          item.style
            .toLowerCase()
            .includes(query);

        return (
          categoryMatch &&
          searchMatch
        );
      }
    );
  }, [
    clothingItems,
    activeCategory,
    search,
  ]);

  const favoriteCount =
    clothingItems.filter(
      (item) => item.favorite
    ).length;

  const categoryCount =
    new Set(
      clothingItems.map(
        (item) => item.category
      )
    ).size;

  return (
    <section className="closet-page">

      {/* HEADER */}

      <div className="closet-header">

        <div className="closet-heading">

          <span className="page-eyebrow">
            YOUR WARDROBE
          </span>

          <h1>
            My Closet
          </h1>

          <p>
            Everything you own, organized
            in one intelligent wardrobe.
          </p>

        </div>

        <button
          type="button"
          className="closet-add-button"
          onClick={onAddClothes}
        >
          <span>+</span>
          Add Clothes
        </button>

      </div>

      {/* STATS */}

      <div className="closet-stats">

        <div className="closet-stat-card">
          <span className="closet-stat-label">
            TOTAL ITEMS
          </span>

          <strong className="closet-stat-value">
            {clothingItems.length}
          </strong>
        </div>

        <div className="closet-stat-card">
          <span className="closet-stat-label">
            FAVORITES
          </span>

          <strong className="closet-stat-value">
            {favoriteCount}
          </strong>
        </div>

        <div className="closet-stat-card">
          <span className="closet-stat-label">
            CATEGORIES
          </span>

          <strong className="closet-stat-value">
            {categoryCount}
          </strong>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="closet-toolbar">

        <div className="closet-tabs">

          {categories.map(
            (category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory ===
                  category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>

        <div className="closet-search">

          <span className="closet-search-icon">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            placeholder="Search your closet..."
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

      </div>

      {/* CLOTHING GRID */}

      {filteredItems.length > 0 ? (

        <div className="closet-grid">

          {filteredItems.map(
            (item) => (
              <article
                className="closet-item-card"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="closet-item-image">

                  {imageUrls[
                    item.id
                  ] ? (

                    <img
                      src={
                        imageUrls[
                          item.id
                        ]
                      }
                      alt={item.name}
                    />

                  ) : (

                    <div className="closet-item-placeholder">

                      <span>
                        {item.category ===
                        "Tops"
                          ? "👕"
                          : item.category ===
                            "Bottoms"
                          ? "👖"
                          : item.category ===
                            "Shoes"
                          ? "👟"
                          : item.category ===
                            "Outerwear"
                          ? "🧥"
                          : "⌚"}
                      </span>

                    </div>

                  )}

                  <button
                    type="button"
                    className="closet-favorite-button"
                    onClick={() =>
                      onToggleFavorite(
                        item.id
                      )
                    }
                    aria-label={
                      item.favorite
                        ? `Remove ${item.name} from favorites`
                        : `Add ${item.name} to favorites`
                    }
                  >
                    {item.favorite
                      ? "♥"
                      : "♡"}
                  </button>

                </div>

                {/* DETAILS */}

                <div className="closet-item-details">

                  <div className="closet-item-title-row">

                    <div>
                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.color}
                        <span> · </span>
                        {item.style}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="closet-delete-button"
                      onClick={() =>
                        onDeleteClothing(
                          item.id
                        )
                      }
                      aria-label={`Delete ${item.name}`}
                    >
                      ×
                    </button>

                  </div>

                  <div className="closet-item-tags">

                    <span>
                      {item.category}
                    </span>

                    <span>
                      {item.season}
                    </span>

                  </div>

                  <div className="closet-item-occasions">

                    {item.occasions
                      .slice(0, 2)
                      .map(
                        (occasion) => (
                          <span
                            key={
                              occasion
                            }
                          >
                            {occasion}
                          </span>
                        )
                      )}

                  </div>

                  <div className="closet-item-footer">

                    <small>
                      Added{" "}
                      {item.dateAdded}
                    </small>

                  </div>

                </div>

              </article>
            )
          )}

          {/* ADD CARD */}

          <button
            type="button"
            className="closet-add-card"
            onClick={onAddClothes}
          >

            <span className="closet-add-card-icon">
              +
            </span>

            <strong>
              Add clothing
            </strong>

            <small>
              Expand your wardrobe
            </small>

          </button>

        </div>

      ) : (

        <div className="closet-empty">

          <div className="closet-empty-icon">
            ✦
          </div>

          <h2>
            No clothing found
          </h2>

          <p>
            Try another category or search.
          </p>

        </div>

      )}

    </section>
  );
}

export default MyCloset;