function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        AI Closet
      </div>

      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#about">About</a>
      </div>

      <button className="nav-button">
        Get Started
      </button>
    </nav>
  );
}

export default Navbar;