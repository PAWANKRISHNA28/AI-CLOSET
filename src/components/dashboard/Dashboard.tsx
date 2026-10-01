function Dashboard() {
  const categories = [
    { icon: "👕", name: "Tops", count: 12 },
    { icon: "👖", name: "Bottoms", count: 6 },
    { icon: "👟", name: "Shoes", count: 4 },
    { icon: "🧥", name: "Outerwear", count: 2 },
  ];

  const clothes = [
    {
      emoji: "👔",
      name: "Oxford Shirt",
      category: "Shirt",
    },
    {
      emoji: "👖",
      name: "Dark Denim",
      category: "Jeans",
    },
    {
      emoji: "👟",
      name: "White Sneakers",
      category: "Shoes",
    },
    {
      emoji: "🧥",
      name: "Casual Jacket",
      category: "Jacket",
    },
  ];

  return (
    <div className="dashboard">
      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">✦</div>

          <div>
            <strong>AI Closet</strong>
            <span>AI STYLING</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          <p className="nav-label">MAIN</p>

          <button className="dashboard-nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button className="dashboard-nav-item">
            <span>▦</span>
            My Closet
          </button>

          <button className="dashboard-nav-item">
            <span>✦</span>
            AI Stylist
          </button>

          <button className="dashboard-nav-item">
            <span>＋</span>
            Add Clothes
          </button>

          <p className="nav-label">PERSONAL</p>

          <button className="dashboard-nav-item">
            <span>◷</span>
            Outfit History
          </button>

          <button className="dashboard-nav-item">
            <span>♡</span>
            Favorites
          </button>

          <button className="dashboard-nav-item">
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>✦</span>

            <div>
              <strong>AI Stylist</strong>
              <p>
                Your wardrobe is ready
                for today's look.
              </p>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">P</div>

            <div>
              <strong>Pawan</strong>
              <span>My Account</span>
            </div>

            <span>⋮</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-date">
              MONDAY, OCTOBER 1
            </p>

            <h1>
              Good morning, <span>Pawan.</span>
            </h1>

            <p className="dashboard-subtitle">
              Here's what your wardrobe looks like today.
            </p>
          </div>

          <div className="dashboard-actions">
            <button className="icon-button">
              ♡
            </button>

            <button className="icon-button">
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
              <span>YOUR WEATHER</span>

              <span className="weather-status">
                ● LIVE
              </span>
            </div>

            <div className="weather-main">
              <div className="weather-large-icon">
                ☀
              </div>

              <div>
                <strong>28°</strong>
                <span>Sunny</span>
              </div>
            </div>

            <div className="weather-location">
              <span>⌖</span>
              Chennai, Tamil Nadu
            </div>

            <div className="weather-details">
              <div>
                <span>Feels like</span>
                <strong>30°</strong>
              </div>

              <div>
                <span>Humidity</span>
                <strong>62%</strong>
              </div>

              <div>
                <span>Wind</span>
                <strong>14 km/h</strong>
              </div>
            </div>
          </article>

          {/* AI OUTFIT */}

          <article className="ai-outfit-card">
            <div className="card-top">
              <span>✦ AI RECOMMENDATION</span>

              <span className="match-score">
                94% MATCH
              </span>
            </div>

            <div className="ai-outfit-content">
              <div className="outfit-preview">
                <div>👔</div>
                <div>👖</div>
                <div>👟</div>
              </div>

              <div className="ai-outfit-info">
                <p>Today's Look</p>

                <h2>Smart Casual</h2>

                <div className="outfit-items">
                  <span>Oxford Shirt</span>
                  <span>Dark Denim</span>
                  <span>White Sneakers</span>
                </div>

                <button className="view-outfit-button">
                  View outfit
                  <span>→</span>
                </button>
              </div>
            </div>
          </article>
        </section>

        {/* STATS */}

        <section className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon">▦</span>

            <div>
              <span>Total items</span>
              <strong>24</strong>
            </div>

            <small>+3 this week</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✦</span>

            <div>
              <span>AI outfits</span>
              <strong>18</strong>
            </div>

            <small>This month</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">◷</span>

            <div>
              <span>Most worn</span>
              <strong>7×</strong>
            </div>

            <small>Oxford Shirt</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon">♡</span>

            <div>
              <span>Favorites</span>
              <strong>6</strong>
            </div>

            <small>Saved outfits</small>
          </div>
        </section>

        {/* CATEGORIES */}

        <section className="dashboard-section">
          <div className="section-title-row">
            <div>
              <p className="dashboard-eyebrow">
                YOUR WARDROBE
              </p>

              <h2>Closet overview</h2>
            </div>

            <button className="text-button">
              View all →
            </button>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <div
                className="category-card"
                key={category.name}
              >
                <div className="category-icon">
                  {category.icon}
                </div>

                <div>
                  <strong>{category.name}</strong>
                  <span>{category.count} items</span>
                </div>

                <span className="category-arrow">
                  →
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT CLOTHES */}

        <section className="dashboard-section">
          <div className="section-title-row">
            <div>
              <p className="dashboard-eyebrow">
                RECENTLY ADDED
              </p>

              <h2>New to your closet</h2>
            </div>

            <button className="text-button">
              View closet →
            </button>
          </div>

          <div className="clothes-grid">
            {clothes.map((item) => (
              <article
                className="dashboard-clothing-card"
                key={item.name}
              >
                <div className="clothing-image">
                  <span>{item.emoji}</span>

                  <button className="favorite-button">
                    ♡
                  </button>
                </div>

                <div className="clothing-details">
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                </div>
              </article>
            ))}

            <button className="add-clothing-card">
              <span>＋</span>
              <strong>Add clothing</strong>
              <small>Add something new</small>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;