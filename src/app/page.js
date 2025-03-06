"use client";
import { useState } from "react";
import SearchForm from "../components/SearchForm.js";
// Import other components as needed, for example a ResultsList component
// import ResultsList from "../components/ResultsList";
import * as model from "../utils/model";

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler function to process search queries
  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      // Use your model's function to load search results
      await model.loadSearchResults(query);
      // Get the first page results (or however you want to slice them)
      const searchResults = model.getSearchResultsPage();
      setResults(searchResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      {/* Header Section */}
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
              {/* <button data-section-to-show="home" className="nav__link">Home</button> */}
              <a className="nav__link" id="homeBtn" href="index.html">
                Home
              </a>
            </li>
            <li className="nav__item">
              <a className="nav__link" id="admin-btn" href="#">
                Admin Dashboard
              </a>
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

      {/* Search and Featured Opportunities Sections */}
      <div id="main-content" className="">
        {/* Main Content with Search Form and Intro Text */}
        <section className="intro-section">
          <div className="container">
            <h1 className="intro-title">
              Headstart your career with Deutsche Telekom
            </h1>
            <p className="intro-text">
              Search from thousands of student opportunities in
              multiple sectors and locations.
            </p>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="search-section">
          <div className="container search-container">
            <SearchForm onSearch={handleSearch} />
          </div>
        </section>
        {/* Optionally render loading, error, or results */}
        {loading && (
          <div className="spinner">
            <svg>
              <use href="/img/icons.svg#icon-loading" />
            </svg>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {/* <ResultsList results={results} /> */}

        {/* Featured Opportunities Section */}
        <section
          id="featured-section"
          className="featured-opportunity"
        >
          <div className="container">
            <h2>Featured Opportunities</h2>
            <div className="opportunities-grid">
              {/* Opportunities will be dynamically inserted here */}
            </div>
          </div>
        </section>

        {/* Opportunities List Section */}
        <section className="opportunities-list hidden">
          <div className="container">
            <h2>Available Opportunities</h2>
            <div className="container-opp-list">
              {/*
              <div className="opportunity-card">
                <img src="/src/img/logo2.jpg" alt="Telekom logo" className="card-logo" />
                <div className="card-info">
                  <h3 className="card-type">Job Offer</h3>
                  <h2 className="card-title">Frontend Developer</h2>
                </div>
                <div className="card-details">
                  <div className="card-detail-item">
                    <div className="card-detail-label">
                      <svg className="card-icon">
                        <use href="/src/img/icons.svg#icon-location-marker" />
                      </svg>
                      <span>Location</span>
                    </div>
                    <p>Sarajevo, Mostar</p>
                  </div>
                  <div className="card-detail-item">
                    <div className="card-detail-label">
                      <svg className="card-icon">
                        <use href="/src/img/icons.svg#icon-experience" />
                      </svg>
                      <span>Experience</span>
                    </div>
                    <p>Senior</p>
                  </div>
                  <div className="card-detail-item last-item">
                    <div className="card-detail-label">
                      <svg className="card-icon">
                        <use href="/src/img/icons.svg#icon-deadline" />
                      </svg>
                      <span>Deadline</span>
                    </div>
                    <p>28 days left</p>
                  </div>
                </div>
                <a href="#" className="card-link">
                  <button className="card-btn">View Opportunity</button>
                </a>
              </div>
              */}
            </div>
            <div className="pagination">
              {/*
              <button className="pagination-btn pagination__btn--prev">
                <svg className="pagination-icon">
                  <use href="/src/img/icons.svg#icon-arrow-left" />
                </svg>
                <span>Page 1</span>
              </button>
              <button className="pagination-btn pagination__btn--next">
                <svg className="pagination-icon">
                  <use href="/src/img/icons.svg#icon-arrow-right" />
                </svg>
                <span>Page 3</span>
              </button>
              */}
            </div>
          </div>
        </section>
      </div>

      {/* Opportunity Details Section (initially hidden) */}
      <div id="details-content" className="">
        <section className="details-opportunity hidden">
          {/*
          (Details opportunity section content commented out)
          */}
        </section>
      </div>

      <div id="admin-content">
        {/*
        <section className="admin-section hidden">
          <h1>Admin Dashboard</h1>
          <form className="admin-search-form">
            <div className="admin-search-inputs">
              <input type="text" placeholder="Search applications..." name="search" required />
              <button type="submit" className="btn-admin-search">Search</button>
            </div>
          </form>
        </section>
        */}
        <section className="admin-header hidden">
          <div className="container">
            <h2 className="header-title">Admin Dashboard</h2>
            <p className="header-text">
              Use smart search functionality to enhance your data
            </p>
          </div>
        </section>
        <section className="admin-statistics hidden">
          <div className="statistics-container">
            <div className="statistics-card">
              <h3>Total Applications</h3>
              <p id="applications-count">0</p>
            </div>
            <div className="statistics-card">
              <h3>Active Listings</h3>
              <p id="opportunities-count">0</p>
            </div>
            <div className="statistics-card pie-chart">
              <h3>Application Distribution by Country</h3>
              <canvas id="pieChart"></canvas>
            </div>
          </div>
        </section>
        <section className="smart-search hidden">
          <h3 className="form-heading">Smart Search</h3>
          <form className="admin-search-form">
            <div className="admin-search-inputs">
              <input
                type="text"
                placeholder="Try Applications from Berlin..."
                name="search"
                required
              />
              <button type="submit" className="btn-admin-search">
                Search
              </button>
            </div>
          </form>
        </section>
        <section className="admin-search-results hidden">
          <h2>Search Results</h2>
          <div className="admin-result-cards">
            {/*
            (Dynamic search results content commented out)
            */}
          </div>
        </section>
      </div>

      {/* Newsletter Subscription Section */}
      <section id="newsletter-section" className="newsletter">
        <h2>Top Telekom opportunities in your inbox</h2>
        <p>
          Subscribe to the Telekom Portal newsletter, and we'll send
          you the latest opportunities in your selected category once
          a week.
        </p>
        <form action="#">
          <div className="select-field">
            <select name="field-of-interest" required defaultValue="">
              <option value="" disabled>
                Choose a field...
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
          </div>
          <input
            type="email"
            placeholder="Your email address..."
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="main-footer">
        <div className="container">
          <p>
            &copy; 2025 Deutsche Telekom Student Platfrom. All Rights
            Reserved.
          </p>
        </div>
      </footer>

      <div className="overlay overlay--publish hidden-oppacity"></div>
      <div className="publish-opportunity-window hidden-oppacity">
        <button className="btn--close-modal upload-btn--close-modal">
          &times;
        </button>
        <form className="upload">
          <div className="upload__column">
            <h3 className="upload__heading">Opportunity Details</h3>
            <label>Type</label>
            <select required name="type" defaultValue="">
              <option value="" disabled>
                Select Type
              </option>
              <option>Job Offer</option>
              <option>Internship</option>
              <option>Thesis Topic</option>
              <option>Mentorship</option>
              <option>Extra Curriculum Project</option>
            </select>
            <label>Field of Study</label>
            <select required name="fieldOfStudy" defaultValue="">
              <option value="" disabled>
                Select Field of Study
              </option>
              <option>Architecture</option>
              <option>Software Engineering</option>
              <option>Computer Sciences and Engineering</option>
              <option>
                Artificial Intelligence and Data Engineering
              </option>
              <option>Genetics and Bioengineering</option>
              <option>Electrical and Electronics Engineering</option>
              <option>Mechanical Engineering</option>
              <option>
                Visual Arts and Visual Communications Design
              </option>
              <option>Media and Communication</option>
            </select>
            <label>Title</label>
            <input
              defaultValue="TEST23"
              required
              name="title"
              type="text"
              placeholder="E.g., Frontend Developer"
            />
            <label>Location</label>
            <input
              defaultValue="TEST23"
              required
              name="location"
              type="text"
              placeholder="E.g., Berlin"
            />
            <label>Job Description</label>
            <textarea
              required
              name="description"
              placeholder="Add a brief description..."
              defaultValue="TEST23"
            ></textarea>
            <label>Qualifications & Requirements</label>
            <textarea
              required
              name="qualificationsAndRequirements"
              placeholder="Semicolon-separated qualifications"
              defaultValue="TEST23"
            ></textarea>
            <label>Benefits</label>
            <textarea
              required
              name="benefits"
              placeholder="Semicolon-separated benefits"
              defaultValue="TEST23"
            ></textarea>
          </div>

          <div className="upload__column">
            <h3 className="upload__heading">Additional Details</h3>
            <label>Tags</label>
            <input
              defaultValue="TEST23"
              required
              name="tags"
              type="text"
              placeholder="Comma-separated, e.g., JavaScript,React"
            />
            <label>Engagement Type</label>
            <input
              defaultValue="TEST23"
              required
              name="engagementType"
              type="text"
              placeholder="E.g., Full-time, Part-time"
            />
            <label>Work Arrangement</label>
            <input
              defaultValue="TEST23"
              required
              name="workArrangement"
              type="text"
              placeholder="E.g., Remote, On-site"
            />
            <label>Contact Person </label>
            <input
              defaultValue="TEST23"
              required
              name="contactPerson"
              type="text"
              placeholder="E.g., Jane Doe"
            />
            <label>
              Contact Email{" "}
              <span className="note">
                This email will be the recipient address for all
                applications
              </span>
            </label>
            <input
              defaultValue="TEST23@gmail.com"
              required
              name="contactPersonEmail"
              type="email"
              placeholder="E.g., jane.doe@example.com"
            />
            <label>Experience Required</label>
            <input
              defaultValue="TEST23"
              name="experienceRequired"
              type="text"
              placeholder="Comma-separated, e.g., Junior, Senior"
            />
            <label>Deadline</label>
            <input required name="endingDate" type="date" />
          </div>

          <button className="btn upload__btn" type="submit">
            <svg>
              <use href="/img/icons.svg#icon-upload-cloud" />
            </svg>
            <span>Publish Opportunity</span>
          </button>
        </form>
      </div>

      <div className="overlay overlay--login hidden-oppacity"></div>
      <div className="login-form-window hidden-oppacity">
        <button className="btn--close-modal login-btn--close-modal">
          &times;
        </button>
        <form className="login-form">
          <div className="login__column">
            <h3 className="login__heading">Log In</h3>
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              required
              type="email"
              placeholder="Enter your email"
            />
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              required
              type="password"
              placeholder="Enter your password"
            />
            <button className="login__btn" type="submit">
              <svg>
                <use href="/img/icons.svg#icon-login" />
              </svg>
              <span>Log In</span>
            </button>
          </div>
          <div className="login__footer">
            {/* <p>Don't have an account? <a href="#" id="signUpLink">Sign Up</a></p> */}
            <p>
              Don't have an account?{" "}
              <button
                className="show__signup__btn"
                id="openSignUpForm"
                type="button"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>

      <div className="overlay overlay--logout hidden-oppacity"></div>
      <div className="logout-form-window hidden-oppacity">
        <button className="btn--close-modal logout-btn--close-modal">
          &times;
        </button>
        <form className="logout-form">
          <div className="logout__column">
            <h3 className="logout__heading">Log Out</h3>
            <p className="logout__message">
              You are currently logged in as{" "}
              <span id="logoutUserName">Name Surname</span>. Do you
              want to log out?
            </p>
            <button className="btn logout__btn" type="submit">
              <svg>
                <use href="/img/icons.svg#icon-logout" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </form>
      </div>

      <div className="overlay overlay--signup hidden-oppacity"></div>
      <div className="signup-form-window hidden-oppacity">
        <button className="btn--close-modal signup-btn--close-modal">
          &times;
        </button>
        <form className="signup-form">
          <div className="signup__column">
            <h3 className="signup__heading">Sign Up</h3>
            <div className="disclaimer">
              <p>
                We use your data to enhance your user journey on our
                platform by simplifying the application process.
              </p>
            </div>
            {/* <label htmlFor="user-type">User Type</label>
            <select id="user-type" required>
              <option defaultValue="" disabled>Select User Type</option>
              <option>Student</option>
              <option>Deutsche Telekom</option>
            </select> */}
            <label htmlFor="name">Name and Surname</label>
            <input
              id="name"
              name="nameAndSurname"
              required
              type="text"
              placeholder="Enter your name and surname"
            />
            <label htmlFor="signUpEmail">
              Email{" "}
              <span className="note">
                please use your university or company email address
              </span>
            </label>
            <input
              id="signUpEmail"
              name="email"
              required
              type="email"
              placeholder="Enter your email"
            />
            <p className="signup__emailError hidden">
              *Invalid email domain. Please use your university or
              Telekom email.
            </p>
            <label htmlFor="signUpPassword">Password</label>
            <input
              id="signUpPassword"
              name="password"
              required
              type="password"
              placeholder="Enter your password"
            />
            <button className="btn signup__btn" type="submit">
              <svg>
                <use href="/img/icons.svg#icon-signup" />
              </svg>
              <span>Sign Up</span>
            </button>
          </div>
        </form>
      </div>

      <div className="overlay overlay--apply hidden-oppacity"></div>
      <div className="apply-form-window hidden-oppacity">
        <button className="btn--close-modal apply-btn--close-modal">
          &times;
        </button>
        <form className="apply-form">
          <div className="apply__column">
            <h3 className="apply__heading">Apply Now</h3>
            <div className="disclaimer">
              <p>
                Your information is auto-generated based on your
                email. After applying, you will receive a confirmation
                email with your details.
              </p>
            </div>
            <label htmlFor="cvUpload">
              Upload Your CV (optional)
            </label>
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
              <svg>
                <use href="/img/icons.svg#icon-apply" />
              </svg>
              <span>Apply</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
