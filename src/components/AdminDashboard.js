// components/AdminDashboard.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import LoadingSpinner from "./LoadingSpinner.js";
import ErrorMessage from "./ErrorMessage.js";

Chart.register(...registerables);

const AdminDashboard = ({
  isCompanyUser,
  stats,
  loadingStats,
  error, // error for stats
  onSmartSearch,
  smartSearchResults,
  loadingSmartSearch,
  smartSearchError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAdminSearched, setHasAdminSearched] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Update the pie chart when stats.chartData changes
  useEffect(() => {
    if (stats && stats.chartData && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: stats.chartData.labels,
          datasets: [
            {
              label: "Applicants by Country",
              data: stats.chartData.values,
              backgroundColor: [
                "#e20074",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }
  }, [stats]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasAdminSearched(true);
    onSmartSearch(searchQuery);
  };

  return (
    <div id="admin-dashboard">
      {/* Admin Header */}
      <section className="admin-header">
        <div className="container">
          <h2 className="header-title">Admin Dashboard</h2>
          <p className="header-text">
            Use smart search functionality to enhance your data
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="admin-statistics">
        <div className="statistics-container">
          <div className="statistics-card">
            <h3>Total Applications</h3>
            <div id="applications-count">
              {loadingStats ? (
                <LoadingSpinner />
              ) : (
                stats?.applicationsCount ?? 0
              )}
            </div>
          </div>
          <div className="statistics-card">
            <h3>Active Listings</h3>
            <div id="opportunities-count">
              {loadingStats ? (
                <LoadingSpinner />
              ) : (
                stats?.opportunitiesCount ?? 0
              )}
            </div>
          </div>
          <div className="statistics-card pie-chart">
            <h3>Application Distribution by Country</h3>
            <canvas id="pieChart" ref={chartRef}></canvas>
          </div>
        </div>
      </section>

      {/* Smart Search Form */}
      <section className="smart-search">
        <h3 className="form-heading">Smart Search</h3>
        <form className="admin-search-form" onSubmit={handleSubmit}>
          <div className="admin-search-inputs">
            <input
              type="text"
              placeholder="Try Applications from Zagreb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
            <button type="submit" className="btn-admin-search">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Smart Search Results */}
      <section className="admin-search-results">
        {loadingSmartSearch ? (
          <LoadingSpinner />
        ) : hasAdminSearched ? (
          smartSearchResults && smartSearchResults.length > 0 ? (
            <div className="admin-result-cards">
              {smartSearchResults.map((result, index) => (
                <div className="admin-card" key={index}>
                  <div className="admin-card-content">
                    <h3 className="admin-card-title">
                      {result.opportunity_title ||
                        "Untitled Opportunity"}
                    </h3>
                    <p className="admin-card-subtitle">
                      Applicant: {result.applicant_name || "Unknown"}{" "}
                      <span className="admin-applicant-email">
                        (
                        {result.applicant_email ||
                          "No email provided"}
                        )
                      </span>
                    </p>
                    <div className="admin-card-details">
                      <p>
                        <strong>Application ID:</strong>{" "}
                        {result.application_id || "N/A"}
                      </p>
                      <p>
                        <strong>Opportunity Location:</strong>{" "}
                        {result.opportunity_location || "N/A"}
                      </p>
                      <p>
                        <strong>Applicant Country:</strong>{" "}
                        {result.university_location ||
                          "Unknown Country"}{" "}
                        (
                        {result.university_name ||
                          "No University Info"}
                        )
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {result.application_date || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ErrorMessage
              text={
                smartSearchError ||
                "No search results found for your query. Please try again."
              }
            />
          )
        ) : null}
      </section>

      {error && <ErrorMessage text={error} />}
    </div>
  );
};

export default AdminDashboard;
