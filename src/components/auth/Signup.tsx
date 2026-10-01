import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface SignupProps {
  onLogin: () => void;
}

function Signup({ onLogin }: SignupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              full_name:
                `${firstName.trim()} ${lastName.trim()}`.trim(),
            },
          },
        });

      if (signupError) {
        throw signupError;
      }

      if (data.session) {
        setSuccess(
          "Account created successfully. Welcome to AI Closet!"
        );

        setTimeout(() => {
          onLogin();
        }, 700);
      } else {
        setSuccess(
          "Account created. Please check your email to confirm your account, then sign in."
        );
      }
    } catch (signupError) {
      if (signupError instanceof Error) {
        setError(signupError.message);
      } else {
        setError(
          "Unable to create your account. Please try again."
        );
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

      <div className="auth-card reference-auth-card signup-reference-card">

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
            className="auth-mode-button active"
          >
            Sign up
          </button>

          <button
            type="button"
            className="auth-mode-button"
            onClick={onLogin}
          >
            Sign in
          </button>

        </div>

        <div className="auth-heading reference-heading">

          <h2>Create an account</h2>

          <p>
            Build your intelligent digital wardrobe.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={handleSignup}
        >

          <div className="auth-name-row">

            <div className="auth-field">

              <label htmlFor="signup-first-name">
                First name
              </label>

              <input
                id="signup-first-name"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                required
              />

            </div>

            <div className="auth-field">

              <label htmlFor="signup-last-name">
                Last name
              </label>

              <input
                id="signup-last-name"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                required
              />

            </div>

          </div>

          <div className="auth-field">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
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

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={6}
              required
            />

          </div>

          <div className="auth-field">

            <label htmlFor="confirm-password">
              Confirm password
            </label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={6}
              required
            />

          </div>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create an account"}

            {!loading && <span>→</span>}
          </button>

        </form>

        <div className="auth-divider">
          <span>OR SIGN UP WITH</span>
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
          By creating an account, you agree to our{" "}
          <span>Terms & Service</span>
        </p>

        <p className="auth-switch reference-switch">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onLogin}
          >
            Sign in
          </button>
        </p>

      </div>

    </section>
  );
}

export default Signup;