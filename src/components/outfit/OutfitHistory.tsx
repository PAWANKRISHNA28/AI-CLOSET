import { useState } from "react";

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
      name: "Classic Blue",
      occasion: "College",
      match: "91%",
      weather: "27°C · Cloudy",
      items: ["Blue Polo", "Dark Denim", "White Sneakers"],
      favorite: false,
    },
    {
      date: "Sep 28",
      day: "September 28, 2026",
      name: "Relaxed Weekend",
      occasion: "Casual",
      match: "89%",
      weather: "29°C · Sunny",
      items: ["Black T-Shirt", "Beige Chinos", "White Sneakers"],
      favorite: true,
    },
    {
      date: "Sep 25",
      day: "September 25, 2026",
      name: "Clean & Simple",
      occasion: "Everyday",
      match: "87%",
      weather: "28°C · Sunny",
      items: ["Oxford Shirt", "Beige Chinos", "White Sneakers"],
      favorite: false,
    },
    {
      date: "Sep 22",
      day: "September 22, 2026",
      name: "Smart Evening",
      occasion: "Party",
      match: "92%",
      weather: "26°C · Clear",
      items: ["Black T-Shirt", "Dark Denim", "Casual Jacket"],
      favorite: true,
    },
    {
      date: "Sep 19",
      day: "September 19, 2026",
      name: "Weekend Casual",
      occasion: "Travel",
      match: "85%",
      weather: "30°C · Sunny",
      items: ["Blue Polo", "Beige Chinos", "White Sneakers"],
      favorite: false,
    },
  ];

  const filters = ["All", "Everyday", "College", "Casual", "Party", "Travel"];

  const filteredOutfits =
    filter === "All"
      ? outfits
      : outfits.filter((outfit) => outfit.occasion === filter);

  return (
    <div className="outfit-history-page">
      {/* Header */}
      <header className="history-header">
        <div>
          <p className="dashboard-eyebrow">OUTFIT HISTORY</p>

          <h1>Your style journey.</h1>

          <p>
            Keep track of what you've worn and discover the outfits
            you enjoy the most.
          </p>
        </div>

        <div className="history-summary">
          <strong>18</strong>
          <span>OUTFITS WORN</span>
        </div>
      </header>

      {/* Stats */}
      <section className="history-stats">
        <div className="history-stat-card">
          <span>THIS MONTH</span>
          <strong>12</strong>
          <p>outfits worn</p>
        </div>

        <div className="history-stat-card">
          <span>AVERAGE MATCH</span>
          <strong>89%</strong>
          <p>AI recommendation score</p>
        </div>

        <div className="history-stat-card">
          <span>MOST WORN</span>
          <strong>Oxford Shirt</strong>
          <p>7 times</p>
        </div>

        <div className="history-stat-card">
          <span>FAVORITES</span>
          <strong>6</strong>
          <p>saved outfits</p>
        </div>
      </section>

      {/* Filters */}
      <section className="history-toolbar">
        <div className="history-filters">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="history-sort">
          ↕ Sort by date
        </button>
      </section>

      {/* Outfit list */}
      <section className="history-list">
        {filteredOutfits.map((outfit) => (
          <article className="history-card" key={outfit.day}>
            {/* Date */}
            <div className="history-date">
              <strong>{outfit.date}</strong>
              <span>{outfit.day}</span>
            </div>

            {/* Outfit visual */}
            <div className="history-visual">
              <div>👔</div>
              <div>👖</div>
              <div>👟</div>
            </div>

            {/* Details */}
            <div className="history-details">
              <div className="history-title-row">
                <div>
                  <span className="history-occasion">
                    {outfit.occasion}
                  </span>

                  <h2>{outfit.name}</h2>
                </div>

                <button className="favorite-button">
                  {outfit.favorite ? "♥" : "♡"}
                </button>
              </div>

              <p className="history-items">
                {outfit.items.join(" · ")}
              </p>

              <div className="history-meta">
                <span>☀ {outfit.weather}</span>
                <span>✦ {outfit.match} AI match</span>
              </div>
            </div>

            {/* Action */}
            <button className="view-outfit-button">
              View outfit
              <span>→</span>
            </button>
          </article>
        ))}
      </section>

      {filteredOutfits.length === 0 && (
        <div className="empty-history">
          <div>✦</div>
          <h2>No outfits found</h2>
          <p>Try selecting another category.</p>
        </div>
      )}
    </div>
  );
}

export default OutfitHistory;