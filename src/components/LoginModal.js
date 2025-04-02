"use client";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { MODAL_CLOSE_SEC } from "../utils/config";

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  onShowSignUp,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Close the modal if it's not open
  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the login handler passed as a prop
      await onLogin({ email, password });

      // Show success message and clear input fields
      setSuccess("You have been successfully logged in!");
      setEmail("");
      setPassword("");

      // Automatically close the modal after a delay
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      // Handle login errors
      console.error("Login error:", err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      {/* Overlay for the modal */}
      <div className="overlay overlay--login" onClick={onClose}></div>

      {/* Modal window */}
      <div className="login-form-window fade-in">
        {/* Close button */}
        <button
          className="btn--close-modal login-btn--close-modal"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Success message */}
        {success ? (
          <div className="message">
            <svg>
              <use href="img/icons.svg#icon-smile" />
            </svg>
            <p>{success}</p>
          </div>
        ) : loading ? (
          // Loading spinner
          <div className="spinner">
            <svg>
              <use href="img/icons.svg#icon-loading" />
            </svg>
          </div>
        ) : (
          // Login form
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login__column">
              <h3 className="login__heading">Log In</h3>

              {/* Email input */}
              <label htmlFor="loginEmail">Email</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password input */}
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Error message */}
              {error && <ErrorMessage text={error} />}

              {/* Submit button */}
              <button className="login__btn" type="submit">
                <svg>
                  <use href="img/icons.svg#icon-login" />
                </svg>
                Log In
              </button>
            </div>

            {/* Footer section */}
            <div className="login__footer">
              <p>
                Don&apos;t have an account?
                <button
                  className="show__signup__btn"
                  id="openSignUpForm"
                  type="button"
                  onClick={() => {
                    onClose(); // Close the login modal
                    onShowSignUp(); // Open the signup modal
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}