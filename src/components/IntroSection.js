// src/components/IntroSection.js
export default function IntroSection({ query }) {
  // Destructure the query data; if query is null, we fall back to default values.
  const { location, fieldOfStudy, type, titleOrKeyword } =
    query || {};

  const title =
    location || fieldOfStudy || type
      ? `${location ? `${location} Opportunities` : "Opportunities"}${
          fieldOfStudy ? ` in ${fieldOfStudy}` : ""
        }${type ? ` of type ${type}` : ""}`.trim()
      : "Opportunities of all types";

  const description = titleOrKeyword
    ? `With "${titleOrKeyword}"`
    : "With all titles and keywords";

  return (
    <div className="container">
      <h1 className="intro-title">{title}</h1>
      <p className="intro-text">{description}</p>
    </div>
  );
}
