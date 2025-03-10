"use client";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // Do not render if modal is closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin({ email, password });
      // On successful login, clear fields and close modal
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      {/* The overlay to darken background */}
      <div className="overlay" onClick={onClose}></div>
      <div className="login-form-window">
        <button className="btn--close-modal" onClick={onClose}>
          &times;
        </button>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login__column">
            <h3 className="login__heading">Log In</h3>
            {error && <ErrorMessage text={error} />}
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="login__btn" type="submit">
              <svg>
                <use href="img/icons.svg#icon-login"></use>
              </svg>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
