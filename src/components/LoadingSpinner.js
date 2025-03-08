// src/components/LoadingSpinner.js
export default function LoadingSpinner() {
  return (
    <div className="spinner">
      <svg>
        <use href="/img/icons.svg#icon-loading" />
      </svg>
    </div>
  );
}
