"use client";
import { useState, useEffect, useRef } from "react";

const ApplyForm = ({ isLoggedIn, onApply }) => {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const toggleWindow = () => {
    setIsVisible(!isVisible);
  };

  const handleShowWindow = (e) => {
    e.preventDefault();

    if (!isLoggedIn("student")) {
      alert("You must be logged in as a student to apply.");
      return;
    }

    toggleWindow();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    onApply(formData);
  };

  return (
    <>
      {/* Apply Button */}
      <button className="apply-now-btn" onClick={handleShowWindow}>
        Apply Now
      </button>

      {/* Modal & Overlay */}
      {isVisible && (
        <>
          <div
            className="overlay overlay--apply"
            ref={overlayRef}
            onClick={toggleWindow}
          ></div>
          <div className="apply-form-window">
            <button
              className="btn--close-modal apply-btn--close-modal"
              onClick={toggleWindow}
            >
              &times;
            </button>
            <form ref={formRef} className="apply-form" onSubmit={handleSubmit}>
              <div className="apply__column">
                <h3 className="apply__heading">Apply Now</h3>
                <p>Your information is auto-generated based on your email.</p>

                <label htmlFor="cvUpload">Upload Your CV (optional)</label>
                <input
                  id="cvUpload"
                  name="cvUpload"
                  type="file"
                  accept=".pdf, .doc, .docx"
                />

                <p className="apply__note">
                  *Only PDF, DOC, and DOCX files are accepted.
                </p>

                <button className="btn apply__btn" type="submit">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default ApplyForm;
