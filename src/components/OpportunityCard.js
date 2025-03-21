import Image from "next/image";

export default function OpportunityCard({ opportunity }) {
  return (
    <div className="opportunity-card">
      <Image
        src="/img/logo.webp"
        alt="Company logo"
        className="card-logo"
        width={60}
        height={40}
      />
      <div className="card-info">
        <h3 className="card-type">{opportunity.type || "N/A"}</h3>
        <h2 className="card-title">
          {opportunity.title || "Untitled Opportunity"}
        </h2>
      </div>
      <div className="card-details">
        <div className="card-detail-item">
          <div className="card-detail-label">
            <svg className="card-icon">
              <use href="/img/icons.svg#icon-location-marker" />
            </svg>
            <span>Location</span>
          </div>
          <p>{opportunity.location || "Not specified"}</p>
        </div>
        <div className="card-detail-item">
          <div className="card-detail-label">
            <svg className="card-icon">
              <use href="/img/icons.svg#icon-experience" />
            </svg>
            <span>Experience</span>
          </div>
          <p>
            {Array.isArray(opportunity.experience)
              ? opportunity.experience.join(", ")
              : opportunity.experience || "N/A"}
          </p>
        </div>
        <div className="card-detail-item last-item">
          <div className="card-detail-label">
            <svg className="card-icon">
              <use href="/img/icons.svg#icon-deadline" />
            </svg>
            <span>Deadline</span>
          </div>
          <p>{opportunity.deadline || "No deadline"}</p>
        </div>
      </div>
      <a href={`#${opportunity.id}`} className="card-link">
        <button className="card-btn">View Opportunity</button>
      </a>
    </div>
  );
}
