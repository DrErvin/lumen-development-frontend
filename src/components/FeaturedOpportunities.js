"use client";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

export default function FeaturedOpportunities({data, loading, error}) {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage text={error} />;
  if (!data || data.length === 0) return null; // No data to show
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, rotate: 1 }
  };

  return (
    <div className="opportunities-grid">
      {data.map((opportunity) => (
        <motion.div
          className="opportunity-item"
          key={opportunity.id}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={cardVariants}
        >
          <h3>{opportunity.title || "Untitled Opportunity"}</h3>
          <p>
            {opportunity.type || "Unknown Type"} -{" "}
            {opportunity.location || "Location not specified"}
          </p>
          <a
  href={`#${opportunity.id}`}
  className="view-opportunity-btn"
  onClick={(e) => {
    // Only prevent default if the hash is already set
    if (window.location.hash.slice(1) === opportunity.id) {
      e.preventDefault();
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      // Allow default navigation to occur by not preventing it
      // Optionally, you could also manually set the new hash:
      window.location.hash = opportunity.id;
    }
  }}
>
  View Opportunity
</a>
        </motion.div>
      ))}
    </div>
  );
}
