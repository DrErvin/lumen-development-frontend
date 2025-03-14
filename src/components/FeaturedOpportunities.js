"use client";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function FeaturedOpportunities({
  data,
  loading,
  error,
}) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage text={error} />;
  if (!data || data.length === 0) return null; // Optionally, show a fallback message

  return (
    <div className="opportunities-grid">
      {data.map((opportunity) => (
        <div className="opportunity-item" key={opportunity.id}>
          <h3>{opportunity.title || "Untitled Opportunity"}</h3>
          <p>
            {opportunity.type || "Unknown Type"} -{" "}
            {opportunity.location || "Location not specified"}
          </p>
          <a
            href={`#${opportunity.id}`}
            className="view-opportunity-btn"
            onClick={(e) => {
              e.preventDefault();
              // If the hash is already the same, force a hashchange event.
              if (window.location.hash.slice(1) === opportunity.id) {
                window.dispatchEvent(
                  new HashChangeEvent("hashchange")
                );
              } else {
                window.location.hash = opportunity.id;
              }
            }}
          >
            View Opportunity
          </a>
        </div>
      ))}
    </div>
  );
}
