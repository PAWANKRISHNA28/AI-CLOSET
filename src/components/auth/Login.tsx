import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface LoginProps {
  onSignup: () => void;
  onLogin: () => void;
}

function Login({ onSignup, onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      onLogin();
    } catch (loginError) {
      if (loginError instanceof Error) {
        setError(loginError.message);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-background">
        <div className="light-ribbon ribbon-one" />
        <div className="light-ribbon ribbon-two" />

        <div className="ambient-glow glow-one" />
        <div className="ambient-glow glow-two" />
      </div>

      <div className="auth-card reference-auth-card">
        <button
          type="button"
          className="auth-close"
          aria-label="Close"
        >
          ×
        </button>

        <div className="auth-mode-switch">
          <button
            type="button"
            className="auth-mode-button"
            onClick={onSignup}
          >
            Sign up
          </button>

          <button
            type="button"
            className="auth-mode-button active"
          >
            Sign in
          </button>
        </div>

        <div className="auth-heading reference-heading">
          <h2>Welcome back</h2>

          <p>
            Sign in to continue to your wardrobe.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
          <div className="auth-field">
            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <div className="auth-password-label">
              <label htmlFor="login-password">
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-primary-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}

            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR SIGN IN WITH</span>
        </div>

        <div className="social-auth-row">
          <button
            type="button"
            className="social-auth-button"
          >
            <span className="google-letter">
              G
            </span>

            Google
          </button>

          <button
            type="button"
            className="social-auth-button"
          >
            <span className="apple-letter">
              ●
            </span>

            Apple
          </button>
        </div>

        <p className="auth-terms">
          By signing in, you agree to our{" "}
          <span>Terms & Service</span>
        </p>

        <p className="auth-switch reference-switch">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onSignup}
          >
            Create one
          </button>
        </p>
      </div>
    </section>
  );
}

export default Login;