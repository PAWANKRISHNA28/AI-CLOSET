import { useState } from "react";

function OutfitPlanner() {
  const [selectedOutfit, setSelectedOutfit] = useState(0);

  const outfits = [
    {
      name: "Smart Casual",
      match: "94%",
      shirt: "Oxford Shirt",
      pants: "Dark Denim",
      shoes: "White Sneakers",
      reason:
        "A lightweight combination that works well for today's warm weather and gives you a clean everyday look.",
    },
    {
      name: "Relaxed Weekend",
      match: "89%",
      shirt: "Black T-Shirt",
      pants: "Beige Chinos",
      shoes: "White Sneakers",
      reason:
        "A relaxed combination with neutral tones that is comfortable for casual activities.",
    },
    {
      name: "Classic Look",
      match: "86%",
      shirt: "Blue Polo",
      pants: "Dark Denim",
      shoes: "White Sneakers",
      reason:
        "A simple classic combination that balances comfort and a polished appearance.",
    },
  ];

  const outfit = outfits[selectedOutfit];

  return (
    <div className="outfit-planner-page">
      {/* Header */}
      <header className="outfit-planner-header">
        <div>
          <p className="dashboard-eyebrow">AI STYLIST</p>

          <h1>What should I wear today?</h1>

          <p>
            Your AI stylist combines your wardrobe, today's weather,
            and your outfit history to find the right look.
          </p>
        </div>

        <div className="stylist-status">
          <span>✦</span>
          AI Stylist Ready
        </div>
      </header>

      {/* Weather */}
      <section className="planner-weather">
        <div className="weather-main">
          <div className="planner-weather-icon">☀</div>

          <div>
            <span>CHENNAI · TODAY</span>
            <strong>28°C</strong>
            <p>Sunny · Feels like 30°C</p>
          </div>
        </div>

        <div className="weather-details">
          <div>
            <span>Humidity</span>
            <strong>62%</strong>
          </div>

          <div>
            <span>Wind</span>
            <strong>14 km/h</strong>
          </div>

          <div>
            <span>Condition</span>
            <strong>Warm</strong>
          </div>
        </div>
      </section>

      {/* Main planner */}
      <div className="planner-layout">
        {/* Outfit */}
        <section className="recommended-outfit">
          <div className="planner-section-heading">
            <div>
              <p className="dashboard-eyebrow">TODAY'S RECOMMENDATION</p>
              <h2>{outfit.name}</h2>
            </div>

            <div className="match-score">
              <span>AI MATCH</span>
              <strong>{outfit.match}</strong>
            </div>
          </div>

          <div className="outfit-items">
            <article className="planner-clothing-card">
              <div className="planner-clothing-image shirt-image">
                👔
              </div>

              <div>
                <span>TOP</span>
                <h3>{outfit.shirt}</h3>
                <p>White · Lightweight</p>
              </div>
            </article>

            <article className="planner-clothing-card">
              <div className="planner-clothing-image pants-image">
                👖
              </div>

              <div>
                <span>BOTTOM</span>
                <h3>{outfit.pants}</h3>
                <p>Blue · Denim</p>
              </div>
            </article>

            <article className="planner-clothing-card">
              <div className="planner-clothing-image shoes-image">
                👟
              </div>

              <div>
                <span>SHOES</span>
                <h3>{outfit.shoes}</h3>
                <p>White · Casual</p>
              </div>
            </article>
          </div>

          <div className="planner-actions">
            <button className="wear-today-button">
              Wear this today
              <span>→</span>
            </button>

            <button className="save-outfit-button">
              ♡ Save outfit
            </button>
          </div>
        </section>

        {/* AI explanation */}
        <aside className="ai-reasoning">
          <div className="ai-reasoning-header">
            <div className="ai-reasoning-icon">✦</div>

            <div>
              <span>AI STYLIST</span>
              <h3>Why this outfit?</h3>
            </div>
          </div>

          <p className="ai-reasoning-main">
            {outfit.reason}
          </p>

          <div className="reason-list">
            <div>
              <span>☀</span>
              <p>
                <strong>Weather suitable</strong>
                <br />
                Lightweight pieces work well in today's heat.
              </p>
            </div>

            <div>
              <span>◌</span>
              <p>
                <strong>Not recently worn</strong>
                <br />
                These items haven't been used recently.
              </p>
            </div>

            <div>
              <span>✦</span>
              <p>
                <strong>Color harmony</strong>
                <br />
                Neutral colors create an easy combination.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Alternatives */}
      <section className="alternative-outfits">
        <div className="alternative-heading">
          <div>
            <p className="dashboard-eyebrow">MORE OPTIONS</p>
            <h2>Alternative outfits</h2>
          </div>

          <span>3 looks generated</span>
        </div>

        <div className="alternative-grid">
          {outfits.map((item, index) => (
            <button
              key={item.name}
              className={`alternative-card ${
                selectedOutfit === index ? "selected" : ""
              }`}
              onClick={() => setSelectedOutfit(index)}
            >
              <div className="alternative-visual">
                <span>👕</span>
                <span>👖</span>
                <span>👟</span>
              </div>

              <div className="alternative-info">
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.shirt} · {item.pants}
                  </p>
                </div>

                <strong>{item.match}</strong>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default OutfitPlanner;