"use client";
import { useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import ApplyForm from "@/components/ApplyForm";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  const opportunities = [
    { endingDate: "2025-06-30" },
    { endingDate: "2024-12-01" },
  ];
  const applications = [
    { university_location: "Germany", id: 1 },
    { university_location: "USA", id: 2 },
  ];

  const isLoggedIn = (role) => role === "student";

  const handleShowDashboard = () => {
    setShowAdmin(true);
  };

  const handleApply = (formData) => {
    console.log("Application submitted:", Object.fromEntries(formData));
  };

  const fetchFeaturedOpportunities = async () => {
    return [
      {
        id: 1,
        title: "Frontend Developer",
        type: "Job Offer",
        location: "Berlin",
      },
      { id: 2, title: "AI Researcher", type: "Internship", location: "Munich" },
    ];
  };

  return (
    <main>
      <header className="main-header">
        <nav className="nav">
          <img
            src="/img/logo.jpg"
            alt="Telekom logo"
            className="nav__logo"
            id="logo"
          />
          <ul className="nav__links">
            <li className="nav__item">
              <a className="nav__link" id="homeBtn" href="index.html">
                Home
              </a>
            </li>
            <li className="nav__item">
              <button
                className="nav__link"
                id="admin-btn"
                onClick={handleShowDashboard}
              >
                Admin Dashboard
              </button>
            </li>
            <li className="nav__item">
              <a className="nav__link" href="#featured-section">
                Featured
              </a>
            </li>
            <li className="nav__item">
              <a className="nav__link" href="#newsletter-section">
                Newsletter
              </a>
            </li>
          </ul>
          <div className="nav__buttons">
            <button className="nav__button" id="publishOpportunities">
              Publish Opportunities
            </button>
            <button className="nav__button" id="logInSignUp">
              Log In/Sign Up
            </button>
          </div>
        </nav>
      </header>

      <div id="main-content">
        <section className="intro-section">
          <div className="container">
            <h1 className="intro-title">
              Headstart your career with Deutsche Telekom
            </h1>
            <p className="intro-text">
              Search from thousands of student opportunities in multiple sectors
              and locations.
            </p>
          </div>
        </section>
      </div>

      <FeaturedOpportunities
        fetchFeaturedOpportunities={fetchFeaturedOpportunities}
      />

      {showAdmin && (
        <AdminDashboard
          opportunities={opportunities}
          applications={applications}
          isLoggedIn={isLoggedIn}
          onShow={() => setShowAdmin(true)}
        />
      )}

      <section className="opportunities-list">
        <div className="container">
          <h2>Available Opportunities</h2>
          <div className="container-opp-list">
            <ApplyForm isLoggedIn={isLoggedIn} onApply={handleApply} />
          </div>
        </div>
      </section>

      <section id="newsletter-section" className="newsletter">
        <h2>Top Telekom opportunities in your inbox</h2>
        <p>
          Subscribe to the Telekom Portal newsletter, and we'll send you the
          latest opportunities in your selected category once a week.
        </p>
        <form action="#">
          <div className="select-field">
            <select name="field-of-interest" required defaultValue="">
              <option value="" disabled>
                Choose a field...
              </option>
              <option value="Architecture">Architecture</option>
              <option value="Software Engineering">Software Engineering</option>
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
          </div>
          <input type="email" placeholder="Your email address..." required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <footer className="main-footer">
        <div className="container">
          <p>
            &copy; 2025 Deutsche Telekom Student Platform. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
