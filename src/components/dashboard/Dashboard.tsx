import { useEffect, useState } from "react";
import type { ClothingItem } from "../layout/AppLayout";
import { supabase } from "../../lib/supabase";

interface DashboardProps {
  clothingItems: ClothingItem[];
  onNavigate: (
    page:
      | "Dashboard"
      | "My Closet"
      | "AI Stylist"
      | "Add Clothes"
      | "Outfit History"
      | "Favorites"
      | "Settings"
  ) => void;
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

const isTop = (item: ClothingItem) =>
  categoryContains(item.category, [
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
    "sweater",
    "sweatshirt",
    "hoodie",
  ]);

const isBottom = (item: ClothingItem) =>
  categoryContains(item.category, [
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
    "legging",
    "leggings",
    "jogger",
    "joggers",
    "chino",
    "cargo",
  ]);

const isShoes = (item: ClothingItem) =>
  categoryContains(item.category, [
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
  ]);

const isOuterwear = (item: ClothingItem) =>
  categoryContains(item.category, [
    "outerwear",
    "jacket",
    "coat",
    "blazer",
    "cardigan",
    "overcoat",
  ]);

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  clothingItems,
  onNavigate,
}: DashboardProps) {
  /* =======================================================
     WEATHER STATE
  ======================================================= */

  const [weather, setWeather] = useState({
    temperature: 0,
    feelsLike: 0,
    humidity: 0,
    wind: 0,
    description: "Loading...",
    icon: "☀",
    location: "Chennai, Tamil Nadu",
  });

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  /* =======================================================
     AI OUTFIT INDEX
  ======================================================= */

  const [outfitIndex, setOutfitIndex] =
    useState(0);

  /* =======================================================
     AI PREVIEW IMAGE STATE
  ======================================================= */

  const [previewImages, setPreviewImages] =
    useState<{
      top?: string;
      bottom?: string;
      shoes?: string;
    }>({});

  /* =======================================================
     FETCH WEATHER
  ======================================================= */

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);

        const latitude = 13.0827;
        const longitude = 80.2707;

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        if (!response.ok) {
          throw new Error(
            "Weather request failed"
          );
        }

        const data =
          await response.json();

        const weatherCode =
          data.current.weather_code;

        let description = "Clear";
        let icon = "☀";

        if (weatherCode === 0) {
          description = "Clear";
          icon = "☀";
        } else if (
          weatherCode === 1 ||
          weatherCode === 2
        ) {
          description = "Partly cloudy";
          icon = "🌤";
        } else if (weatherCode === 3) {
          description = "Cloudy";
          icon = "☁";
        } else if (
          weatherCode === 45 ||
          weatherCode === 48
        ) {
          description = "Foggy";
          icon = "🌫";
        } else if (
          weatherCode >= 51 &&
          weatherCode <= 67
        ) {
          description = "Rainy";
          icon = "🌧";
        } else if (
          weatherCode >= 71 &&
          weatherCode <= 77
        ) {
          description = "Snowy";
          icon = "❄";
        } else if (
          weatherCode >= 80 &&
          weatherCode <= 82
        ) {
          description = "Rain showers";
          icon = "🌦";
        } else if (weatherCode >= 95) {
          description = "Thunderstorm";
          icon = "⛈";
        }

        setWeather({
          temperature: Math.round(
            data.current.temperature_2m
          ),
          feelsLike: Math.round(
            data.current.apparent_temperature
          ),
          humidity: Math.round(
            data.current.relative_humidity_2m
          ),
          wind: Math.round(
            data.current.wind_speed_10m
          ),
          description,
          icon,
          location:
            "Chennai, Tamil Nadu",
        });
      } catch (error) {
        console.error(
          "Failed to fetch weather:",
          error
        );
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  /* =======================================================
     REAL WARDROBE STATISTICS
  ======================================================= */

  const totalItems =
    clothingItems.length;

  const favoriteCount =
    clothingItems.filter(
      (item) => item.favorite
    ).length;

  const categoryCounts = {
    Tops: clothingItems.filter(isTop)
      .length,

    Bottoms: clothingItems.filter(
      isBottom
    ).length,

    Shoes: clothingItems.filter(
      isShoes
    ).length,

    Outerwear: clothingItems.filter(
      isOuterwear
    ).length,
  };

  /* =======================================================
     RECENT ITEMS
  ======================================================= */

  const recentClothes = [
    ...clothingItems,
  ]
    .sort((a, b) => {
      return (
        new Date(
          b.dateAdded
        ).getTime() -
        new Date(
          a.dateAdded
        ).getTime()
      );
    })
    .slice(0, 4);

  const clothes =
    recentClothes.length > 0
      ? recentClothes
      : clothingItems.slice(0, 4);

  /* =======================================================
     CATEGORY DATA
  ======================================================= */

  const categories = [
    {
      icon: "👕",
      name: "Tops",
      count: categoryCounts.Tops,
    },
    {
      icon: "👖",
      name: "Bottoms",
      count: categoryCounts.Bottoms,
    },
    {
      icon: "👟",
      name: "Shoes",
      count: categoryCounts.Shoes,
    },
    {
      icon: "🧥",
      name: "Outerwear",
      count: categoryCounts.Outerwear,
    },
  ];

  /* =======================================================
     AI OUTFIT PREVIEW
  ======================================================= */

  const availableTops =
    clothingItems.filter(isTop);

  const availableBottoms =
    clothingItems.filter(isBottom);

  const availableShoes =
    clothingItems.filter(isShoes);

  const previewTop =
    availableTops.length > 0
      ? availableTops[
          outfitIndex %
            availableTops.length
        ]
      : undefined;

  const previewBottom =
    availableBottoms.length > 0
      ? availableBottoms[
          outfitIndex %
            availableBottoms.length
        ]
      : undefined;

  const previewShoes =
    availableShoes.length > 0
      ? availableShoes[
          outfitIndex %
            availableShoes.length
        ]
      : undefined;

  /* =======================================================
     LOAD PRIVATE STORAGE IMAGES
  ======================================================= */

  useEffect(() => {
    const loadPreviewImages =
      async () => {
        const items = [
          {
            key: "top" as const,
            item: previewTop,
          },
          {
            key: "bottom" as const,
            item: previewBottom,
          },
          {
            key: "shoes" as const,
            item: previewShoes,
          },
        ];

        const results: {
          top?: string;
          bottom?: string;
          shoes?: string;
        } = {};

        for (const {
          key,
          item,
        } of items) {
          if (!item?.image) {
            continue;
          }

          const {
            data,
            error,
          } = await supabase.storage
            .from("clothing-images")
            .createSignedUrl(
              item.image,
              3600
            );

          if (
            !error &&
            data?.signedUrl
          ) {
            results[key] =
              data.signedUrl;
          }
        }

        setPreviewImages(
          results
        );
      };

    loadPreviewImages();
  }, [
    previewTop?.id,
    previewBottom?.id,
    previewShoes?.id,
  ]);

  /* =======================================================
     TRY ANOTHER OUTFIT
  ======================================================= */

  const handleTryAnother = () => {
    setOutfitIndex(
      (current) => current + 1
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="dashboard">

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-date">
              {new Date()
                .toLocaleDateString(
                  "en-US",
                  {
                    weekday:
                      "long",
                    month:
                      "long",
                    day:
                      "numeric",
                  }
                )
                .toUpperCase()}
            </p>

            <h1>
              Good morning,{" "}
              <span>
                Pawan.
              </span>
            </h1>

            <p className="dashboard-subtitle">
              Here's what your wardrobe
              looks like today.
            </p>

          </div>

          <div className="dashboard-actions">

            <button
              type="button"
              className="icon-button"
              onClick={() =>
                onNavigate(
                  "Favorites"
                )
              }
              aria-label="Open favorites"
            >
              ♡
            </button>

            <button
              type="button"
              className="icon-button"
              onClick={() =>
                onNavigate(
                  "AI Stylist"
                )
              }
              aria-label="Open AI Stylist"
            >
              ◌
            </button>

            <div className="header-avatar">
              P
            </div>

          </div>

        </header>

        {/* TOP GRID */}

        <section className="dashboard-grid">

          {/* WEATHER */}

          <article className="weather-card">

            <div className="card-top">

              <span>
                YOUR WEATHER
              </span>

              <span className="weather-status">
                ●{" "}
                {weatherLoading
                  ? "LOADING"
                  : "LIVE"}
              </span>

            </div>

            <div className="weather-main">

              <div className="weather-large-icon">
                {weather.icon}
              </div>

              <div>

                <strong>
                  {weatherLoading
                    ? "--°"
                    : `${weather.temperature}°`}
                </strong>

                <span>
                  {weatherLoading
                    ? "Loading..."
                    : weather.description}
                </span>

              </div>

            </div>

            <div className="weather-location">

              <span>
                ⌖
              </span>

              {weather.location}

            </div>

            <div className="weather-details">

              <div>

                <span>
                  Feels like
                </span>

                <strong>
                  {weatherLoading
                    ? "--°"
                    : `${weather.feelsLike}°`}
                </strong>

              </div>

              <div>

                <span>
                  Humidity
                </span>

                <strong>
                  {weatherLoading
                    ? "--%"
                    : `${weather.humidity}%`}
                </strong>

              </div>

              <div>

                <span>
                  Wind
                </span>

                <strong>
                  {weatherLoading
                    ? "-- km/h"
                    : `${weather.wind} km/h`}
                </strong>

              </div>

            </div>

          </article>

          {/* AI OUTFIT */}

          <article className="ai-outfit-card">

            <div className="card-top">

              <span>
                ✦ AI RECOMMENDATION
              </span>

              <span className="match-score">
                {categoryCounts.Tops >
                  0 &&
                categoryCounts.Bottoms >
                  0 &&
                categoryCounts.Shoes >
                  0
                  ? "94% MATCH"
                  : "BUILDING OUTFIT"}
              </span>

            </div>

            <div className="ai-outfit-content">

              <div className="outfit-preview">

                {/* TOP */}

                <div className="outfit-preview-item">

                  {previewImages.top ? (
                    <img
                      src={
                        previewImages.top
                      }
                      alt={
                        previewTop?.name ??
                        "Top"
                      }
                    />
                  ) : (
                    "👔"
                  )}

                </div>

                {/* BOTTOM */}

                <div className="outfit-preview-item">

                  {previewImages.bottom ? (
                    <img
                      src={
                        previewImages.bottom
                      }
                      alt={
                        previewBottom?.name ??
                        "Bottom"
                      }
                    />
                  ) : (
                    "👖"
                  )}

                </div>

                {/* SHOES */}

                <div className="outfit-preview-item">

                  {previewImages.shoes ? (
                    <img
                      src={
                        previewImages.shoes
                      }
                      alt={
                        previewShoes?.name ??
                        "Shoes"
                      }
                    />
                  ) : (
                    "👟"
                  )}

                </div>

              </div>

              <div className="ai-outfit-info">

                <p>
                  Today's Look
                </p>

                <h2>
                  {categoryCounts.Tops >
                    0 &&
                  categoryCounts.Bottoms >
                    0 &&
                  categoryCounts.Shoes >
                    0
                    ? "Smart Casual"
                    : "Build Your Look"}
                </h2>

                <div className="outfit-items">

                  <span>
                    Smart Casual
                  </span>

                  <span>
                    {categoryCounts.Tops >
                      0 &&
                    categoryCounts.Bottoms >
                      0 &&
                    categoryCounts.Shoes >
                      0
                      ? "From your wardrobe"
                      : "Add more clothing"}
                  </span>

                </div>

                {/* TRY ANOTHER */}

                <button
                  type="button"
                  className="view-outfit-button"
                  onClick={
                    handleTryAnother
                  }
                >
                  Try another
                  <span>
                    ↻
                  </span>
                </button>

              </div>

            </div>

          </article>

        </section>

        {/* STATS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <span className="stat-icon">
              ▦
            </span>

            <div>

              <span>
                Total items
              </span>

              <strong>
                {totalItems}
              </strong>

            </div>

            <small>
              In your closet
            </small>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              ✦
            </span>

            <div>

              <span>
                AI outfits
              </span>

              <strong>
                {categoryCounts.Tops *
                  categoryCounts.Bottoms *
                  categoryCounts.Shoes}
              </strong>

            </div>

            <small>
              Possible outfit
              combinations
            </small>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              ◷
            </span>

            <div>

              <span>
                Wardrobe
              </span>

              <strong>
                {Object.values(
                  categoryCounts
                ).filter(
                  (count) =>
                    count > 0
                ).length}
              </strong>

            </div>

            <small>
              Categories covered
            </small>

          </div>

          <div className="stat-card">

            <span className="stat-icon">
              ♡
            </span>

            <div>

              <span>
                Favorites
              </span>

              <strong>
                {favoriteCount}
              </strong>

            </div>

            <small>
              Favorite clothing
            </small>

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <p className="dashboard-eyebrow">
                YOUR WARDROBE
              </p>

              <h2>
                Closet overview
              </h2>

            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                onNavigate(
                  "My Closet"
                )
              }
            >
              View all →
            </button>

          </div>

          <div className="category-grid">

            {categories.map(
              (category) => (

                <button
                  type="button"
                  className="category-card"
                  key={
                    category.name
                  }
                  onClick={() =>
                    onNavigate(
                      "My Closet"
                    )
                  }
                >

                  <div className="category-icon">
                    {
                      category.icon
                    }
                  </div>

                  <div>

                    <strong>
                      {
                        category.name
                      }
                    </strong>

                    <span>
                      {category.count ===
                      0
                        ? "No items yet"
                        : `${category.count} ${
                            category.count ===
                            1
                              ? "item"
                              : "items"
                          }`}
                    </span>

                  </div>

                  <span className="category-arrow">
                    →
                  </span>

                </button>

              )
            )}

          </div>

        </section>

        {/* RECENT CLOTHES */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <p className="dashboard-eyebrow">
                RECENTLY ADDED
              </p>

              <h2>
                New to your closet
              </h2>

            </div>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                onNavigate(
                  "My Closet"
                )
              }
            >
              View closet →
            </button>

          </div>

          <div className="clothes-grid">

            {clothes.length > 0 ? (
              clothes.map(
                (item) => (

                  <article
                    className="dashboard-clothing-card"
                    key={item.id}
                  >

                    <div className="clothing-image">

                      {item.image ? (
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />
                      ) : (
                        <span>
                          👕
                        </span>
                      )}

                      <button
                        type="button"
                        className="favorite-button"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          onNavigate(
                            "Favorites"
                          );
                        }}
                        aria-label="Open favorites"
                      >
                        {item.favorite
                          ? "♥"
                          : "♡"}
                      </button>

                    </div>

                    <div className="clothing-details">

                      <strong>
                        {
                          item.name
                        }
                      </strong>

                      <span>
                        {
                          item.category
                        }
                      </span>

                    </div>

                  </article>

                )
              )
            ) : (
              <div className="empty-closet-message">

                <strong>
                  Your closet is empty
                </strong>

                <span>
                  Add your first
                  clothing item
                  to start building
                  your wardrobe.
                </span>

              </div>
            )}

            <button
              type="button"
              className="add-clothing-card"
              onClick={() =>
                onNavigate(
                  "Add Clothes"
                )
              }
            >

              <span>
                ＋
              </span>

              <strong>
                Add clothing
              </strong>

              <small>
                Add something new
              </small>

            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;