import { useState } from "react";
import "./OutfitHistory.css";

function OutfitHistory() {
  const [filter, setFilter] = useState("All");

  const outfits = [
    {
      date: "Today",
      day: "October 1, 2026",
      name: "Smart Casual",
      occasion: "Everyday",
      match: "94%",
      weather: "28°C · Sunny",
      items: ["Oxford Shirt", "Dark Denim", "White Sneakers"],
      favorite: true,
    },
    {
      date: "Yesterday",
      day: "September 30, 2026",
      name: "Relaxed Weekend",
      occasion: "Casual",
      match: "89%",
      weather: "29°C · Sunny",
      items: ["Black T-Shirt", "Beige Chinos", "White Sneakers"],
      favorite: false,
    },
    {
      date: "Sep 29",
      day: "September 29, 2026",
      name: "Classic Look",
      occasion: "College",
      match: "86%",
      weather: "27°C · Cloudy",
      items: ["Blue Polo", "Dark Denim", "White Sneakers"],
      favorite: true,
    },
    {
      date: "Sep 27",
      day: "September 27, 2026",
      name: "Evening Casual",
      occasion: "Party",
      match: "91%",
      weather: "26°C · Clear",
      items: ["Black Shirt", "Dark Denim", "Casual Shoes"],
      favorite: false,
    },
    {
      date: "Sep 25",
      day: "September 25, 2026",
      name: "Travel Ready",
      occasion: "Travel",
      match: "88%",
      weather: "29°C · Sunny",
      items: ["White T-Shirt", "Blue Jeans", "White Sneakers"],
      favorite: false,
    },
  ];

  const filters = [
    "All",
    "Everyday",
    "College",
    "Casual",
    "Party",
    "Travel",
  ];

  const filteredOutfits =
    filter === "All"
      ? outfits
      : outfits.filter(
          (outfit) => outfit.occasion === filter
        );

  return (
    <section className="history-page">
      {/* HEADER */}
      <header className="history-header">
        <div>
          <span className="history-eyebrow">
            YOUR STYLE JOURNEY
          </span>

          <h1>Outfit History</h1>

          <p>
            A record of the looks you've created and worn.
          </p>
        </div>

        <div className="history-summary">
          <span>LOOKS CREATED</span>
          <strong>{outfits.length}</strong>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="history-toolbar">
        <div className="history-filters">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <span className="history-count">
          {filteredOutfits.length}{" "}
          {filteredOutfits.length === 1
            ? "look"
            : "looks"}
        </span>
      </div>

      {/* HISTORY */}
      <div className="history-list">
        {filteredOutfits.map((outfit, index) => (
          <article
            className="history-card"
            key={`${outfit.day}-${outfit.name}`}
          >
            {/* DATE */}
            <div className="history-date">
              <span>{outfit.date}</span>
              <small>{outfit.day}</small>
            </div>

            {/* OUTFIT PREVIEW */}
            <div className="history-preview">
              <div className="history-piece">
                <span>👕</span>
              </div>

              <div className="history-piece">
                <span>👖</span>
              </div>

              <div className="history-piece">
                <span>👟</span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="history-details">
              <div className="history-title-row">
                <div>
                  <span className="history-occasion">
                    {outfit.occasion}
                  </span>

                  <h2>{outfit.name}</h2>
                </div>

                {outfit.favorite && (
                  <span className="history-favorite">
                    ♥
                  </span>
                )}
              </div>

              <div className="history-items">
                {outfit.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <div className="history-meta">
                <span>☁ {outfit.weather}</span>
                <span className="history-match">
                  {outfit.match} match
                </span>
              </div>
            </div>

            {/* ACTION */}
            <button
              type="button"
              className="history-view-button"
              onClick={() => {
                console.log(
                  "Viewing outfit:",
                  outfit.name
                );
              }}
            >
              View
              <span>→</span>
            </button>

            {index === 0 && (
              <span className="latest-badge">
                LATEST
              </span>
            )}
          </article>
        ))}
      </div>

      {/* EMPTY */}
      {filteredOutfits.length === 0 && (
        <div className="history-empty">
          <div>✦</div>

          <h2>No outfits here yet</h2>

          <p>
            Your saved outfit history will appear here.
          </p>
        </div>
      )}

      {/* FOOTER NOTE */}
      <div className="history-footer">
        <span>✦</span>
        Your outfit history helps your stylist understand
        your preferences.
      </div>
    </section>
  );
}

export default OutfitHistory;