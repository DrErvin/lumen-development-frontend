"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SearchForm from "../components/SearchForm.js";
import ResultsList from "../components/ResultsList.js";
import ErrorMessage from "../components/ErrorMessage.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
import IntroSection from "../components/IntroSection.js";
import FeaturedOpportunities from "../components/FeaturedOpportunities.js";
import Pagination from "../components/Pagination.js";
import LoginModal from "../components/LoginModal.js";
import LogoutModal from "../components/LogoutModal.js";
import SignupModal from "../components/SignupModal.js";
import ApplyModal from "../components/ApplyModal.js";
import OpportunityDetails from "../components/OpportunityDetails.js";
import PublishModal from "../components/PublishModal.js";
import * as model from "../utils/model.js";
import { scrollToTop } from "../utils/helpers.js";
import { RES_PER_PAGE } from "../utils/config.js";
import { initializeApp } from './utils/model';


export default function Home() {

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeApp(); // Initialize the app state
        const userData = await model.getUserDetails(); // Fetch user details from Supabase
        if (userData) {
          setUser(userData); // Set the user state
        }
      } catch (err) {
        console.error("Initialization error:", err.message);
      }
    };
  
    initialize();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the centralized logout function
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div>
      {/* Render the user's name and logout button */}
      {user ? (
        <div>
          <p>Welcome, {user.name_and_surname}</p>
          <button onClick={() => setIsModalOpen(true)}>Log Out</button>
        </div>
      ) : (
        <p>Please log in.</p>
      )}

      {/* Render the LogoutModal */}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogout} // Pass the logout function
        user={user} // Pass the current user data
      />
    </div>
  );
}

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(RES_PER_PAGE);
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Load user state from local storage on mount
  

  // Handle opportunity details based on URL hash
  useEffect(() => {
    async function handleHashChange() {
      const id = window.location.hash.slice(1);
      if (id === "featured-section" || id === "newsletter-section") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      scrollToTop();
      if (id) {
        setDetailsLoading(true);
        try {
          await model.loadOpportunity(id);
          const loadedOpportunity = model.state.opportunity;
          setSelectedOpportunity(loadedOpportunity);
        } catch (err) {
          console.error(err);
        } finally {
          setDetailsLoading(false);
        }
      } else {
        setSelectedOpportunity(null);
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on mount in case there is already a hash
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle search queries
  const handleSearch = async (query) => {
    try {
      scrollToTop();
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setSearchQuery(query);
      window.location.hash = "";
      await model.loadSearchResults(query);
      const searchState = model.state.search;
      if (searchState && searchState.results && searchState.results.length > 0) {
        setTotalResults(searchState.results.length);
        setResultsPerPage(searchState.resultsPerPage);
        setCurrentPage(1);
        setResults(model.getSearchResultsPage(1));
      } else {
        setTotalResults(0);
        setResultsPerPage(10);
        setCurrentPage(1);
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    scrollToTop();
    setCurrentPage(page);
    setResults(model.getSearchResultsPage(page));
  };

  // Load featured opportunities
  useEffect(() => {
    async function loadFeatured() {
      try {
        setFeaturedLoading(true);
        const data = await model.fetchFeatured();
        setFeatured(data);
      } catch (err) {
        console.error(err);
        setFeaturedError("No featured opportunities found. Please try again later!");
      } finally {
        setFeaturedLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // Login handler
  const handleLogin = async ({ email, password }) => {
    try {
      const account = await model.verifyLogin({ email, password });
      if (!account) {
        throw new Error("Invalid email or password");
      }
      const loggedInUser = model.state.user; // Get the user object from the global state
      setUser(loggedInUser); // Update the React state
    } catch (err) {
      console.error("Login error:", err.message);
      throw err;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      model.clearState(); // Clear user state in memory
      setUser(null); // Reset user state in React
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };
  // Preload university domains for signup
  useEffect(() => {
    async function preloadDomains() {
      if (isSignUpModalOpen && !model.areUniversitiesCached()) {
        await model.preloadUniversityDomains();
      }
    }
    preloadDomains();
  }, [isSignUpModalOpen]);

  // Signup handler
  const handleSignUp = async (newAccount) => {
    try {
      await model.uploadAccount(newAccount);
      const loggedInUser = model.state.user;
      setUser(loggedInUser);
    } catch (err) {
      console.error("Signup error:", err.message);
      throw err;
    }
  };

  // Application submission handler
  const handleApply = async (formData) => {
    try {
      if (!user || user.accountType !== "student") {
        throw new Error("You must be logged in as a student to apply.");
      }
      if (!selectedOpportunity) {
        throw new Error("No opportunity selected.");
      }
      formData.append("userId", user.id);
      formData.append("opportunityId", selectedOpportunity.id);
      await model.submitApplication(formData);
    } catch (err) {
      console.error("Application error:", err.message);
      throw err;
    }
  };

  return (
    <>
      {!mounted ? (
        <LoadingSpinner />
      ) : (
        <main>
          {/* Header Section */}
          <header className="main-header">
            <nav className="nav">
              <img
                src="/img/logo.webp"
                alt="Company logo"
                className="nav__logo"
                id="logo"
              />
              <ul className="nav__links">
                <li className="nav__item">
                  <Link
                    href="/"
                    className="nav__link"
                    id="homeBtn"
                    onClick={() => {
                      window.location.hash = "";
                      setHasSearched(false);
                      setSearchQuery(null);
                      setResults([]);
                      setError(null);
                    }}
                  >
                    Home
                  </Link>
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
                <button
                  className="nav__button"
                  id="publishOpportunities"
                  onClick={() => {
                    if (!user || user.accountType !== "company") {
                      alert("You must be logged in as a Company user to publish.");
                      return;
                    }
                    setIsPublishModalOpen(true);
                  }}
                >
                  Publish Opportunity
                </button>
                <button
                  className="nav__button"
                  id="logInSignUp"
                  onClick={() => {
                    if (user) {
                      setIsLogoutModalOpen(true);
                    } else {
                      setIsLoginModalOpen(true);
                    }
                  }}
                >
                  {user ? "Log Out" : "Log In/Sign Up"}
                </button>
              </div>
            </nav>
          </header>

          {/* Login Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
            onShowSignUp={() => setIsSignUpModalOpen(true)}
          />

          {/* Logout Modal */}
          {isLogoutModalOpen && (
            <LogoutModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              onLogout={handleLogout}
              user={user}
            />
          )}

          {/* Signup Modal */}
          {isSignUpModalOpen && (
            <SignupModal
              isOpen={isSignUpModalOpen}
              onClose={() => setIsSignUpModalOpen(false)}
              onSignUp={handleSignUp}
              onValidateEmail={model.validateEmail}
            />
          )}

          {/* Apply Modal */}
          <ApplyModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            onApply={handleApply}
          />

          {/* Publish Modal */}
          <PublishModal
            isOpen={isPublishModalOpen}
            onClose={() => setIsPublishModalOpen(false)}
            onPublish={async (data) => {
              await model.uploadOpportunity(data);
              setSelectedOpportunity(model.state.opportunity);
              window.history.pushState(null, "", `#${model.state.opportunity.id}`);
            }}
          />

          {/* Conditional Content */}
          {typeof window !== "undefined" && window.location.hash ? (
            detailsLoading || !selectedOpportunity ? (
              <LoadingSpinner />
            ) : (
              <OpportunityDetails
                opportunity={selectedOpportunity}
                onClose={() => {
                  window.location.hash = "";
                  setSelectedOpportunity(null);
                }}
                user={user}
                onApply={() => {
                  if (!user || user.accountType !== "student") {
                    alert("You must be logged in as a student to apply.");
                    return;
                  }
                  setIsApplyModalOpen(true);
                }}
              />
            )
          ) : (
            <div id="main-content" className="">
              <section className="intro-section">
                {hasSearched && searchQuery ? (
                  <IntroSection query={searchQuery} />
                ) : (
                  <div className="container">
                    <h1 className="intro-title">
                      Headstart your career with the Company
                    </h1>
                    <p className="intro-text">
                      Search from thousands of student opportunities in multiple sectors and locations.
                    </p>
                  </div>
                )}
              </section>

              {/* Search Form Section */}
              <section className="search-section">
                <div className="container search-container">
                  <SearchForm onSearch={handleSearch} />
                </div>
              </section>

              {/* Loading and Error Messages */}
              {loading && <LoadingSpinner />}
              {error && <ErrorMessage text={error} />}

              {/* Results List & Pagination */}
              {hasSearched &&
                !loading &&
                !error &&
                (results.length > 0 ? (
                  <section className="opportunities-list">
                    <div className="container">
                      <h2>Available Opportunities</h2>
                      <ResultsList results={results} />
                      <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </section>
                ) : (
                  <ErrorMessage text="No opportunities found for your query! Please try again." />
                ))}

              {/* Featured Opportunities Section */}
              {!hasSearched && (
                <section id="featured-section" className="featured-opportunity">
                  <div className="container">
                    <h2>Featured Opportunities</h2>
                    <FeaturedOpportunities
                      data={featured}
                      loading={featuredLoading}
                      error={featuredError}
                    />
                  </div>
                </section>
              )}

              {/* Newsletter Subscription Section */}
              <section id="newsletter-section" className="newsletter">
                <h2>Top Company opportunities in your inbox</h2>
                <p>
                  Subscribe to the Company Portal newsletter to receive latest opportunities once a week.
                </p>
                <form action="#">
                  <div className="select-field">
                    <select name="field-of-interest" required defaultValue="">
                      <option value="" disabled>
                        Choose a field...
                      </option>
                      <option value="Architecture">Architecture</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Computer Sciences and Engineering">Computer Sciences and Engineering</option>
                      <option value="Artificial Intelligence and Data Engineering">
                        Artificial Intelligence and Data Engineering
                      </option>
                      <option value="Genetics and Bioengineering">Genetics and Bioengineering</option>
                      <option value="Electrical and Electronics Engineering">
                        Electrical and Electronics Engineering
                      </option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Visual Arts and Visual Communications Design">
                        Visual Arts and Visual Communications Design
                      </option>
                      <option value="Media and Communication">Media and Communication</option>
                    </select>
                  </div>
                  <input type="email" placeholder="Your email address..." required />
                  <button type="submit">Subscribe</button>
                </form>
              </section>

              {/* Footer Section */}
              <footer className="main-footer">
                <div className="container">
                  <p>&copy; 2025 The Company Student Platform. All Rights Reserved.</p>
                </div>
              </footer>
            </div>
          )}
        </main>
      )}
    </>
  );
}