// src/components/ErrorMessage.js
export default function ErrorMessage({ text }) {
  return (
    <div className="error">
      <svg>
        <use href="/img/icons.svg#icon-warning" />
      </svg>
      <p>{text}</p>
    </div>
  );
}
