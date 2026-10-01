function Features() {
  const features = [
    {
      number: "01",
      title: "Digital Closet",
      description:
        "Upload your clothes and build a beautiful digital wardrobe that keeps everything organized.",
    },
    {
      number: "02",
      title: "AI Outfit Planner",
      description:
        "Get personalized outfit combinations using the clothes you already own.",
    },
    {
      number: "03",
      title: "Weather Aware",
      description:
        "Your recommendations adapt to the current weather so your outfit is practical and stylish.",
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-heading">
        <p className="eyebrow">SMARTER WARDROBE</p>

        <h2>
          Everything your wardrobe
          <br />
          <span>needs.</span>
        </h2>

        <p className="section-description">
          AI Closet combines your personal wardrobe, artificial intelligence,
          and real-world conditions to make getting dressed easier.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <article className="feature-card" key={feature.number}>
            <span className="feature-number">{feature.number}</span>

            <div className="feature-icon">
              ✦
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

            <div className="feature-arrow">↗</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;