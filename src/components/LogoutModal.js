"use client";
import { useState, useEffect } from "react";
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
      await onLogout(); // This should clear state, localStorage, etc.
      setSuccess("You have been logged out!");
      // Clear the success message and close the modal after a delay
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
    <div className="logout-modal">
      <div
        className="overlay overlay--logout"
        onClick={onClose}
      ></div>
      <div className="logout-form-window fade-in">
        <button
          className="btn--close-modal logout-btn--close-modal"
          onClick={onClose}
        >
          &times;
        </button>
        {success ? (
          // Render success message if logout succeeded
          <div className="message">
            <svg>
              <use href="img/icons.svg#icon-smile" />
            </svg>
            <p>{success}</p>
          </div>
        ) : loading ? (
          // Render spinner while logout is in progress
          <div className="spinner">
            <svg>
              <use href="img/icons.svg#icon-loading" />
            </svg>
          </div>
        ) : (
          // Otherwise, render the logout form
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
              {error && <ErrorMessage text={error} />}
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
