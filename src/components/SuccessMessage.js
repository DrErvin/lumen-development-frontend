"use client";
export default function SuccessMessage({ text }) {
  return (
    <div className="message success">
      <svg>
        <use href="img/icons.svg#icon-smile" />
      </svg>
      <p>{text}</p>
    </div>
  );
}
