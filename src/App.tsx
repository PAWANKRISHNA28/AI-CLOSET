import { useState } from "react";
import "./App.css";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AppLayout from "./components/layout/AppLayout";

type AuthPage = "login" | "signup" | "app";

function App() {
  const [authPage, setAuthPage] =
    useState<AuthPage>("login");

  // After successful login
  if (authPage === "app") {
    return (
      <AppLayout
        onLogout={() => setAuthPage("login")}
      />
    );
  }

  // Signup page
  if (authPage === "signup") {
    return (
      <Signup
        onLogin={() => setAuthPage("login")}
      />
    );
  }

  // Login page
  return (
    <Login
      onSignup={() => setAuthPage("signup")}
      onLogin={() => setAuthPage("app")}
    />
  );
}

export default App;