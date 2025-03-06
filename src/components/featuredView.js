"use client";
import { useEffect, useState } from "react";

const FeaturedOpportunities = ({ fetchFeaturedOpportunities }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await fetchFeaturedOpportunities();
        setOpportunities(data);
      } catch (err) {
        setError("No featured opportunities found. Please try again later!");
      }
    };

    loadOpportunities();
  }, [fetchFeaturedOpportunities]);

  return (
    <section id="featured-section" className="featured-opportunity">
      <div className="container">
        <h2>Featured Opportunities</h2>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="opportunities-grid">
            {opportunities.length > 0 ? (
              opportunities.map((opportunity) => (
                <div className="opportunity-item" key={opportunity.id}>
                  <h3>{opportunity.title || "Untitled Opportunity"}</h3>
                  <p>
                    {opportunity.type || "Unknown Type"} -{" "}
                    {opportunity.location || "Location not specified"}
                  </p>
                  <a href={`#${opportunity.id}`} className="view-opportunity-btn">
                    View Opportunity
                  </a>
                </div>
              ))
            ) : (
              <p>Loading opportunities...</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
