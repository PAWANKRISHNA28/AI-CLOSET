import { Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              minHeight: "100vh",
              background: "#08090C",
              color: "#F5F5F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1>AI Closet</h1>
            <p style={{ color: "#A1A1AA" }}>
              Your wardrobe. Smarter outfits. Every day.
            </p>
          </div>
        }
      />

      <Route path="/login" element={<h1>Login</h1>} />
    </Routes>
  );
}

export default AppRoutes;