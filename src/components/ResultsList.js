import OpportunityCard from "./OpportunityCard";

export default function ResultsList({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="error">
        No opportunities found for your query! Please try again.
      </div>
    );
  }

  return (
    <div className="container-opp-list">
      {results.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}
