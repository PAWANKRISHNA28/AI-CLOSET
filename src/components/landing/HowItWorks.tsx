function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "📸",
      title: "Upload your clothes",
      description:
        "Take photos of the clothes you own and add them to your digital closet.",
    },
    {
      number: "02",
      icon: "🧠",
      title: "AI understands them",
      description:
        "Computer vision identifies clothing type, color, category and useful style information.",
    },
    {
      number: "03",
      icon: "✨",
      title: "Get your outfit",
      description:
        "AI combines your wardrobe with weather and recent outfit history to create a recommendation.",
    },
  ];

  return (
    <section id="how-it-works" className="how-section">

      <div className="how-heading">
        <p className="eyebrow">HOW IT WORKS</p>

        <h2>
          From your closet
          <br />
          <span>to your outfit.</span>
        </h2>

        <p>
          Three simple steps turn your everyday wardrobe into an
          intelligent personal styling system.
        </p>
      </div>

      <div className="steps-container">

        {steps.map((step, index) => (
          <div className="step-wrapper" key={step.number}>

            <article className="step-card">

              <div className="step-top">
                <span>{step.number}</span>

                <div className="step-icon">
                  {step.icon}
                </div>
              </div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>

            </article>

            {index < steps.length - 1 && (
              <div className="step-line">
                <span>→</span>
              </div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;