// src/components/SearchForm.js
import { useState } from "react";

export default function SearchForm({ onSearch }) {
  const [location, setLocation] = useState("");
  const [titleOrKeyword, setTitleOrKeyword] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit was called");
    // Build the query object
    const query = { location, titleOrKeyword, fieldOfStudy, type };
    // Call the onSearch callback prop with the query
    onSearch(query);
    // Clear form fields after search
    setLocation("");
    setTitleOrKeyword("");
    setFieldOfStudy("");
    setType("");
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Title or Keyword"
          value={titleOrKeyword}
          onChange={(e) => setTitleOrKeyword(e.target.value)}
        />
        <select
          name="field-of-study"
          className="dropdown"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        >
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
        <select
          name="type"
          className="dropdown"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            Select Type
          </option>
          <option>Thesis Topic</option>
          <option>Internship</option>
          <option>Job Offer</option>
          <option>Mentorship</option>
          <option>Extra Curriculum Project</option>
        </select>
      </div>
      <button className="btn-search" type="submit">
        Search
      </button>
    </form>
  );
}
