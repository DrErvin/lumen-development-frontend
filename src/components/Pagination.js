"use client";
import React from "react";

export default function Pagination({
  currentPage,
  totalResults,
  resultsPerPage,
  onPageChange,
}) {
  const numPages = Math.ceil(totalResults / resultsPerPage);
  if (numPages <= 1) return null;

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button
          className="pagination-btn pagination__btn--prev"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg className="pagination-icon">
            <use href="img/icons.svg#icon-arrow-left" />
          </svg>
          <span>Page {currentPage - 1}</span>
        </button>
      )}
      {currentPage < numPages && (
        <button
          className="pagination-btn pagination__btn--next"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <svg className="pagination-icon">
            <use href="img/icons.svg#icon-arrow-right" />
          </svg>
          <span>Page {currentPage + 1}</span>
        </button>
      )}
    </div>
  );
}
