function OutfitShowcase() {
  return (
    <section className="outfit-showcase">

      <div className="outfit-intro">

        <p className="eyebrow">YOUR PERSONAL STYLIST</p>

        <h2>
          An outfit picked
          <br />
          <span>for you.</span>
        </h2>

        <p>
          AI Closet looks at your clothes, the weather, and your
          recent outfit history to create recommendations that
          actually make sense for your day.
        </p>

      </div>

      <div className="outfit-dashboard">

        {/* Left side — outfit */}
        <div className="outfit-visual">

          <div className="outfit-header">
            <div>
              <span>AI RECOMMENDATION</span>
              <h3>Today's Look</h3>
            </div>

            <div className="ai-badge">
              ✦ AI
            </div>
          </div>

          <div className="clothing-display">

            <div className="clothing-item shirt">
              👕
              <span>Oxford Shirt</span>
            </div>

            <div className="clothing-item pants">
              👖
              <span>Dark Denim</span>
            </div>

            <div className="clothing-item shoes">
              👟
              <span>White Sneakers</span>
            </div>

          </div>

          <div className="outfit-match">
            <div>
              <span>OUTFIT MATCH</span>
              <strong>94%</strong>
            </div>

            <div className="match-bar">
              <div />
            </div>
          </div>

        </div>


        {/* Right side — AI reasoning */}
        <div className="outfit-info">

          <div className="weather-box">

            <div className="weather-icon">
              ☀
            </div>

            <div>
              <span>Today's weather</span>
              <strong>28°C · Sunny</strong>
            </div>

          </div>


          <div className="reason-box">

            <div className="reason-title">
              <span>✦</span>
              Why this outfit?
            </div>

            <ul>
              <li>
                Lightweight shirt suits today's warm weather.
              </li>

              <li>
                Neutral colors create an easy everyday combination.
              </li>

              <li>
                These pieces haven't been worn recently.
              </li>
            </ul>

          </div>


          <button className="wear-button">
            Wear this today
            <span>→</span>
          </button>

        </div>

      </div>

    </section>
  );
}

export default OutfitShowcase;