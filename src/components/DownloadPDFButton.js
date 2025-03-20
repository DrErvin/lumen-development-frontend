// components/DownloadPDFButton.js
"use client";
import PDFView from "../utils/PDFView.js"; // Adjust the path if necessary

export default function DownloadPDFButton({ opportunity, user }) {
  const handleDownload = () => {
    // Ensure the user is logged in as a Company employee
    if (!user || user.accountType !== "company") {
      alert(
        "You must be logged in as a Company employee to download the PDF."
      );
      return;
    }
    // Call the PDF generation function with the opportunity data
    PDFView.generatePDF(opportunity);
  };

  return (
    <div className="download-button">
      <button
        id="download-pdf-btn"
        type="button"
        onClick={handleDownload}
      >
        Download as PDF
      </button>
    </div>
  );
}
