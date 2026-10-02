import "./Favorites.css";
import { useState } from "react";

function Favorites() {
  const [activeTab, setActiveTab] = useState("Clothing");

  const clothing = [
    {
      name: "Oxford Shirt",
      category: "Shirt",
      color: "White",
      worn: "7 times",
      icon: "👔",
    },
    {
      name: "White Sneakers",
      category: "Sneakers",
      color: "White",
      worn: "6 times",
      icon: "👟",
    },
    {
      name: "Dark Denim",
      category: "Jeans",
      color: "Blue",
      worn: "5 times",
      icon: "👖",
    },
    {
      name: "Casual Jacket",
      category: "Jacket",
      color: "Brown",
      worn: "3 times",
      icon: "🧥",
    },
    {
      name: "Blue Polo",
      category: "Polo",
      color: "Blue",
      worn: "4 times",
      icon: "👕",
    },
    {
      name: "Classic Watch",
      category: "Watch",
      color: "Silver",
      worn: "2 times",
      icon: "⌚",
    },
  ];

  const outfits = [
    {
      name: "Smart Casual",
      match: "94%",
      occasion: "Everyday",
      items: "Oxford Shirt · Dark Denim · White Sneakers",
    },
    {
      name: "Smart Evening",
      match: "92%",
      occasion: "Party",
      items: "Black T-Shirt · Dark Denim · Casual Jacket",
    },
    {
      name: "Classic Blue",
      match: "91%",
      occasion: "College",
      items: "Blue Polo · Dark Denim · White Sneakers",
    },
  ];

  return (
    <div className="favorites-page">
      {/* Header */}
      <header className="favorites-header">
        <div>
          <p className="dashboard-eyebrow">YOUR COLLECTION</p>

          <h1>Favorites.</h1>

          <p>
            Your favorite clothes and AI-generated outfits,
            saved in one place.
          </p>
        </div>

        <div className="favorites-count">
          <strong>9</strong>
          <span>SAVED</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="favorites-tabs">
        <button
          className={activeTab === "Clothing" ? "active" : ""}
          onClick={() => setActiveTab("Clothing")}
        >
          <span>♡</span>
          Favorite Clothing
          <strong>6</strong>
        </button>

        <button
          className={activeTab === "Outfits" ? "active" : ""}
          onClick={() => setActiveTab("Outfits")}
        >
          <span>✦</span>
          Saved Outfits
          <strong>3</strong>
        </button>
      </div>

      {/* Clothing */}
      {activeTab === "Clothing" && (
        <section className="favorites-content">
          <div className="favorites-section-heading">
            <div>
              <p className="dashboard-eyebrow">FAVORITE CLOTHING</p>
              <h2>Pieces you love.</h2>
            </div>

            <span>6 items</span>
          </div>

          <div className="favorite-clothing-grid">
            {clothing.map((item) => (
              <article
                className="favorite-clothing-card"
                key={item.name}
              >
                <div className="favorite-clothing-image">
                  <span>{item.icon}</span>

                  <button className="remove-favorite">
                    ♥
                  </button>
                </div>

                <div className="favorite-clothing-info">
                  <div>
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.color}</p>
                  </div>

                  <div className="wear-count">
                    <strong>{item.worn.split(" ")[0]}</strong>
                    <span>worn</span>
                  </div>
                </div>

                <button className="favorite-view-button">
                  View item
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Outfits */}
      {activeTab === "Outfits" && (
        <section className="favorites-content">
          <div className="favorites-section-heading">
            <div>
              <p className="dashboard-eyebrow">SAVED OUTFITS</p>
              <h2>Looks worth repeating.</h2>
            </div>

            <span>3 outfits</span>
          </div>

          <div className="favorite-outfits-grid">
            {outfits.map((outfit) => (
              <article
                className="favorite-outfit-card"
                key={outfit.name}
              >
                <div className="favorite-outfit-visual">
                  <span>👔</span>
                  <span>👖</span>
                  <span>👟</span>

                  <button className="remove-favorite">
                    ♥
                  </button>
                </div>

                <div className="favorite-outfit-info">
                  <div>
                    <span>{outfit.occasion}</span>
                    <h3>{outfit.name}</h3>
                    <p>{outfit.items}</p>
                  </div>

                  <strong>{outfit.match}</strong>
                </div>

                <button className="favorite-view-button">
                  View outfit
                  <span>→</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* AI suggestion */}
      <section className="favorites-ai-tip">
        <div className="favorites-ai-icon">✦</div>

        <div>
          <span>AI STYLIST TIP</span>

          <h3>
            Your favorites can create 12+ new combinations.
          </h3>

          <p>
            AI Closet can use your favorite pieces as a starting
            point for generating new outfits.
          </p>
        </div>

        <button>
          Create an outfit
          <span>→</span>
        </button>
      </section>
    </div>
  );
}

export default Favorites;