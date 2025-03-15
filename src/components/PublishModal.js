// components/PublishModal.js
"use client";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { MODAL_CLOSE_SEC } from "../utils/config";

export default function PublishModal({ isOpen, onClose, onPublish }) {
  // Set up a state object for all the form fields.
  const [formData, setFormData] = useState({
    type: "",
    fieldOfStudy: "",
    title: "",
    location: "",
    description: "",
    qualificationsAndRequirements: "",
    benefits: "",
    tags: "",
    engagementType: "",
    workArrangement: "",
    contactPerson: "",
    contactPersonEmail: "",
    experienceRequired: "",
    endingDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onPublish(formData);
      setSuccess("Opportunity published successfully!");
      // Optionally, clear the form here if desired
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, MODAL_CLOSE_SEC * 1000);
    } catch (err) {
      setError(err.message || "An error occurred while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-modal">
      <div
        className="overlay overlay--publish"
        onClick={onClose}
      ></div>
      <div className="publish-opportunity-window fade-in">
        <button
          className="btn--close-modal upload-btn--close-modal"
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
          <form className="upload" onSubmit={handleSubmit}>
            <div className="upload__column">
              <h3 className="upload__heading">Opportunity Details</h3>
              <label>Type</label>
              <select
                required
                name="type"
                onChange={handleChange}
                value={formData.type}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Job Offer">Job Offer</option>
                <option value="Internship">Internship</option>
                <option value="Thesis Topic">Thesis Topic</option>
                <option value="Mentorship">Mentorship</option>
                <option value="Extra Curriculum Project">
                  Extra Curriculum Project
                </option>
              </select>
              <label>Field of Study</label>
              <select
                required
                name="fieldOfStudy"
                onChange={handleChange}
                value={formData.fieldOfStudy}
              >
                <option value="" disabled>
                  Select Field of Study
                </option>
                <option value="Architecture">Architecture</option>
                <option value="Software Engineering">
                  Software Engineering
                </option>
                <option value="Computer Sciences and Engineering">
                  Computer Sciences and Engineering
                </option>
                <option value="Artificial Intelligence and Data Engineering">
                  Artificial Intelligence and Data Engineering
                </option>
                <option value="Genetics and Bioengineering">
                  Genetics and Bioengineering
                </option>
                <option value="Electrical and Electronics Engineering">
                  Electrical and Electronics Engineering
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Visual Arts and Visual Communications Design">
                  Visual Arts and Visual Communications Design
                </option>
                <option value="Media and Communication">
                  Media and Communication
                </option>
              </select>
              <label>Title</label>
              <input
                required
                name="title"
                type="text"
                placeholder="E.g., Frontend Developer"
                onChange={handleChange}
                value={formData.title}
              />
              <label>Location</label>
              <input
                required
                name="location"
                type="text"
                placeholder="E.g., Berlin"
                onChange={handleChange}
                value={formData.location}
              />
              <label>Job Description</label>
              <textarea
                required
                name="description"
                placeholder="Add a brief description..."
                onChange={handleChange}
                value={formData.description}
              ></textarea>
              <label>Qualifications & Requirements</label>
              <textarea
                required
                name="qualificationsAndRequirements"
                placeholder="Semicolon-separated qualifications"
                onChange={handleChange}
                value={formData.qualificationsAndRequirements}
              ></textarea>
              <label>Benefits</label>
              <textarea
                required
                name="benefits"
                placeholder="Semicolon-separated benefits"
                onChange={handleChange}
                value={formData.benefits}
              ></textarea>
            </div>
            <div className="upload__column">
              <h3 className="upload__heading">Additional Details</h3>
              <label>Tags</label>
              <input
                required
                name="tags"
                type="text"
                placeholder="Comma-separated, e.g., JavaScript,React"
                onChange={handleChange}
                value={formData.tags}
              />
              <label>Engagement Type</label>
              <input
                required
                name="engagementType"
                type="text"
                placeholder="E.g., Full-time, Part-time"
                onChange={handleChange}
                value={formData.engagementType}
              />
              <label>Work Arrangement</label>
              <input
                required
                name="workArrangement"
                type="text"
                placeholder="E.g., Remote, On-site"
                onChange={handleChange}
                value={formData.workArrangement}
              />
              <label>Contact Person</label>
              <input
                required
                name="contactPerson"
                type="text"
                placeholder="E.g., Jane Doe"
                onChange={handleChange}
                value={formData.contactPerson}
              />
              <label>
                Contact Email{" "}
                <span className="note">
                  This email will be the recipient address for all
                  applications
                </span>
              </label>
              <input
                required
                name="contactPersonEmail"
                type="email"
                placeholder="E.g., jane.doe@example.com"
                onChange={handleChange}
                value={formData.contactPersonEmail}
              />
              <label>Experience Required</label>
              <input
                name="experienceRequired"
                type="text"
                placeholder="Comma-separated, e.g., Junior, Senior"
                onChange={handleChange}
                value={formData.experienceRequired}
              />
              <label>Deadline</label>
              <input
                required
                name="endingDate"
                type="date"
                onChange={handleChange}
                value={formData.endingDate}
              />
            </div>
            {error && <ErrorMessage text={error} />}
            <button className="btn upload__btn" type="submit">
              <svg>
                <use href="/img/icons.svg#icon-upload-cloud" />
              </svg>
              <span>Publish Opportunity</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
