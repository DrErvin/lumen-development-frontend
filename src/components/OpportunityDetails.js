// components/OpportunityDetails.js
export default function OpportunityDetails({
  opportunity,
  onClose,
  user,
  onDownloadPDF,
  onApply,
}) {
  const isTelekom = user && user.accountType === "Telekom";

  return (
    // {/* Opportunity Details Section */}
    <div id="details-content">
      <section className="details-opportunity">
        <div className="details-opportunity-container">
          <div className="container details-container">
            <div className="details-header">
              <button
                className="btn--close-details"
                onClick={() => {
                  // Clear the hash and call onClose to go back to the main view
                  window.location.hash = "";
                  onClose();
                }}
              >
                &larr; Back to Search
              </button>
              <img
                src="img/logo.jpg"
                alt="Company Logo"
                className="company-logo"
              />
              <h1 className="opportunity-title">
                {opportunity.title || "Untitled Opportunity"}
              </h1>
              <p className="opportunity-type">
                {opportunity.type || "N/A"}
              </p>
              <p className="opportunity-location">
                <svg className="icon-opport-header">
                  <use href="img/icons.svg#icon-location-marker" />
                </svg>
                {opportunity.location || "Not specified"}
              </p>
              <p className="opportunity-tags">
                {opportunity.tags && opportunity.tags.length > 0
                  ? opportunity.tags.map((tag, i) => (
                      <span key={i} className="tag">
                        {tag}
                      </span>
                    ))
                  : "No tags"}
              </p>
            </div>

            <div className="opportunity-info">
              <div className="opportunity-experience">
                <svg className="icon-opport-header">
                  <use href="img/icons.svg#icon-experience" />
                </svg>
                <p>
                  <strong>Experience:</strong>{" "}
                  {opportunity.experience || "N/A"}
                </p>
              </div>
              <div className="opportunity-engagement">
                <svg className="icon-opport-header">
                  <use href="img/icons.svg#icon-engagement" />
                </svg>
                <p>
                  <strong>Engagement:</strong>{" "}
                  {opportunity.engagementType || "N/A"}
                </p>
              </div>
              <div className="opportunity-deadline">
                <svg className="icon-opport-header">
                  <use href="img/icons.svg#icon-deadline" />
                </svg>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {opportunity.deadline || "N/A"}
                </p>
              </div>
            </div>

            {/* Role-based button block inserted BEFORE the description section */}
            <div className="role-based-button">
              {isTelekom ? (
                <div className="download-button">
                  <button
                    id="download-pdf-btn"
                    onClick={onDownloadPDF}
                  >
                    Download as PDF
                  </button>
                </div>
              ) : (
                <div className="apply-button">
                  <button className="apply-now-btn" onClick={onApply}>
                    Apply Now
                  </button>
                </div>
              )}
            </div>

            <div className="opportunity-section">
              <h2>Your Tasks (Job Description)</h2>
              <p>
                {opportunity.opportunityDescription ||
                  "Description not available."}
              </p>
            </div>
            <div className="opportunity-section">
              <h2>Your Profile (Qualifications & Requirements)</h2>
              <ul>
                {opportunity.yourProfile &&
                opportunity.yourProfile.length > 0
                  ? opportunity.yourProfile.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))
                  : null}
              </ul>
            </div>
            <div className="opportunity-section">
              <h2>What We Offer</h2>
              <ul>
                {opportunity.benefits &&
                opportunity.benefits.length > 0
                  ? opportunity.benefits.map((ben, i) => (
                      <li key={i}>{ben}</li>
                    ))
                  : null}
              </ul>
            </div>
            <div className="opportunity-section">
              <h2>About Telekom DE</h2>
              <p>{opportunity.employeeInfo}</p>
            </div>
            <div className="contact-person-section">
              <h2>Contact Person</h2>
              <div className="contact-person-details">
                <img
                  src="img/LoveMagenta.jpeg"
                  alt="Contact Person"
                  className="contact-person-image"
                />
                <div className="contact-person-info">
                  <p>
                    <strong>Name:</strong>{" "}
                    {opportunity.contactPerson || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${
                        opportunity.contactPersonEmail || ""
                      }`}
                    >
                      {opportunity.contactPersonEmail || "N/A"}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Role-based button block inserted AFTER the contact-person section */}
            <div className="role-based-button">
              {isTelekom ? (
                <div className="download-button">
                  <button
                    id="download-pdf-btn"
                    onClick={onDownloadPDF}
                  >
                    Download as PDF
                  </button>
                </div>
              ) : (
                <div className="apply-button">
                  <button className="apply-now-btn" onClick={onApply}>
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
