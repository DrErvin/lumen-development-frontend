"use client";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { MODAL_CLOSE_SEC } from "../utils/config.js";

export default function LogoutModal({
  isOpen,
  onClose,
  onLogout,
  user,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the onLogout function passed as a prop
      await onLogout();

      // Show success message
      setSuccess("You have been logged out!");

      // Automatically close the modal after a delay
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      // Handle logout errors
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="logout-modal">
      {/* Overlay for the modal */}
      <div className="overlay overlay--logout" onClick={onClose}></div>

      {/* Modal window */}
      <div className="logout-form-window fade-in">
        {/* Close button */}
        <button
          className="btn--close-modal logout-btn--close-modal"
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
          // Logout form
          <form className="logout-form" onSubmit={handleSubmit}>
            <div className="logout__column">
              <h3 className="logout__heading">Log Out</h3>
              <p className="logout__message">
                You are currently logged in as{" "}
                <span id="logoutUserName">
                  {user ? user.name_and_surname : ""}
                </span>
                . Do you want to log out?
              </p>

              {/* Error message */}
              {error && <ErrorMessage text={error} />}

              {/* Submit button */}
              <button className="btn logout__btn" type="submit">
                <svg>
                  <use href="img/icons.svg#icon-logout" />
                </svg>
                Log Out
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}