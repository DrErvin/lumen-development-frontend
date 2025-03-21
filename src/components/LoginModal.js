"use client";
import { useState, useEffect } from "react";
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

  if (!isOpen) return null; // Do not render if modal is closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin({ email, password });
      // Instead of closing immediately, show the success message
      setSuccess("You have been successfully logged in!");
      // Clear the input fields
      setEmail("");
      setPassword("");
      // After a delay, clear the success and close the modal
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal">
      {/* Overlay for the modal */}
      <div className="overlay overlay--login" onClick={onClose}></div>
      <div className="login-form-window fade-in">
        <button
          className="btn--close-modal login-btn--close-modal"
          onClick={onClose}
        >
          &times;
        </button>
        {success ? (
          // Render success message in place of the form
          <div className="message">
            <svg>
              <use href="img/icons.svg#icon-smile" />
            </svg>
            <p>{success}</p>
          </div>
        ) : loading ? (
          // If loading, show spinner in the modal area instead of the form.
          <div className="spinner">
            <svg>
              <use href="img/icons.svg#icon-loading" />
            </svg>
          </div>
        ) : (
          // Render the login form
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login__column">
              <h3 className="login__heading">Log In</h3>

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
              {error && <ErrorMessage text={error} />}
              <button className="login__btn" type="submit">
                <svg>
                  <use href="img/icons.svg#icon-login" />
                </svg>
                Log In
              </button>
            </div>

            <div className="login__footer">
              <p>
                Don&apos;t have an account?{" "}
                <button
                  className="show__signup__btn"
                  id="openSignUpForm"
                  type="button"
                  onClick={() => {
                    onClose(); // Close the login modal
                    // Assume you pass an onShowSignUp prop that calls setIsSignUpModalOpen(true)
                    onShowSignUp();
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
