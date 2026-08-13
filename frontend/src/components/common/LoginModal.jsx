import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login-modal.css";

function LoginModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  if (!isOpen) {
    return null;
  }

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await login(email, password);

      setEmail("");
      setPassword("");

      onSuccess();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await apiRegister();

      setSuccess(
        "Account created successfully. You can now login."
      );

      setTimeout(() => {
        switchMode("login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create account"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const apiRegister = async () => {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          data
        }
      };
    }

    return data;
  };

  return (
    <div
      className="login-modal-overlay"
      onClick={onClose}
    >
      <div
        className="login-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="login-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        {mode === "login" ? (
          <>
            <div className="login-modal-header">
              <div className="login-modal-icon">
                🔐
              </div>

              <h2>Login Required</h2>

              <p>
                Please login to add and manage
                recipes.
              </p>
            </div>

            {error && (
              <div className="login-modal-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="login-modal-form"
            >
              <div className="form-group">
                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-modal-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  switchMode("register")
                }
              >
                Create new user
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="login-modal-header">
              <div className="login-modal-icon">
                👤
              </div>

              <h2>Create Account</h2>

              <p>
                Create an account to add
                your recipes.
              </p>
            </div>

            {error && (
              <div className="login-modal-error">
                {error}
              </div>
            )}

            {success && (
              <div className="login-modal-success">
                {success}
              </div>
            )}

            <form
              onSubmit={handleRegister}
              className="login-modal-form"
            >
              <div className="form-group">
                <label htmlFor="register-name">
                  Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">
                  Email
                </label>

                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-modal-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : "Create Account"}
              </button>
            </form>

            <div className="auth-switch">
              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  switchMode("login")
                }
              >
                Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;