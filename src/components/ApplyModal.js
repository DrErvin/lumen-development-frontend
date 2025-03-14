"use client";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { MODAL_CLOSE_SEC } from "../utils/config";

export default function ApplyModal({ isOpen, onClose, onApply }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    if (file) {
      formData.append("cvUpload", file);
    }
    try {
      // Append additional data in the onApply handler (see below)
      await onApply(formData);
      setSuccess("Your application has been submitted successfully!");
      setFile(null);
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      setError(err.message || "An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-modal">
      <div className="overlay overlay--apply" onClick={onClose}></div>
      <div className="apply-form-window fade-in">
        <button
          className="btn--close-modal apply-btn--close-modal"
          onClick={onClose}
        >
          &times;
        </button>
        {success ? (
          <div className="message">
            <svg>
              <use href="img/icons.svg#icon-smile" />
            </svg>
            <p>{success}</p>
          </div>
        ) : loading ? (
          <LoadingSpinner />
        ) : (
          <form className="apply-form" onSubmit={handleSubmit}>
            <div className="apply__column">
              <h3 className="apply__heading">Apply Now</h3>
              <div className="disclaimer">
                <p>
                  Your information is auto-generated based on your
                  email. After applying, you will receive a
                  confirmation email with your details.
                </p>
              </div>
              <label htmlFor="cvUpload">
                Upload Your CV (optional)
              </label>
              <input
                id="cvUpload"
                name="cvUpload"
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="apply__note">
                *Only PDF, DOC, and DOCX files are accepted.
              </p>
              {error && <ErrorMessage text={error} />}
              <button className="btn apply__btn" type="submit">
                <svg>
                  <use href="/img/icons.svg#icon-apply" />
                </svg>
                <span>Apply</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
