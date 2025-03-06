"use client";
import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const AdminDashboard = ({
  opportunities,
  applications,
  isLoggedIn,
  onShow,
}) => {
  const [activeOpportunities, setActiveOpportunities] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const pieChartRef = useRef(null); // Reference for chart

  useEffect(() => {
    // Calculate active opportunities
    const active = opportunities.filter((opp) => {
      const currentDate = new Date();
      const endingDate = new Date(opp.endingDate);
      return endingDate >= currentDate;
    }).length;

    setActiveOpportunities(active);
    setTotalApplications(applications.length);
  }, [opportunities, applications]);

  useEffect(() => {
    if (pieChartRef.current) {
      renderPieChart(pieChartRef.current, applications);
    }
  }, [applications]);

  const handleShowSection = (e) => {
    e.preventDefault();
    if (!isLoggedIn("Telekom")) {
      alert(
        "You must be logged in as a Telekom user to access Admin Dashboard."
      );
      return;
    }
    onShow();
  };

  const renderPieChart = (canvas, applicantsData) => {
    const applicantsByCountry = applicantsData.reduce((acc, applicant) => {
      const country = applicant.university_location || "Unknown";
      if (!acc[country]) acc[country] = new Set();
      acc[country].add(applicant.id);
      return acc;
    }, {});

    const labels = Object.keys(applicantsByCountry).map(
      (country) => `${country} (${applicantsByCountry[country].size})`
    );
    const values = Object.values(applicantsByCountry).map((set) => set.size);

    new Chart(canvas, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Applicants by Country",
            data: values,
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
  };

  return (
    <div id="admin-content">
      <button id="admin-btn" onClick={handleShowSection}>
        Show Admin Dashboard
      </button>
      <div className="smart-search"></div>
      <div className="admin-statistics">
        <h3>
          Active Opportunities:{" "}
          <span id="opportunities-count">{activeOpportunities}</span>
        </h3>
        <h3>
          Total Applications:{" "}
          <span id="applications-count">{totalApplications}</span>
        </h3>
      </div>
      <div className="admin-header"></div>
      <canvas ref={pieChartRef} id="pieChart"></canvas>
    </div>
  );
};

export default AdminDashboard;
