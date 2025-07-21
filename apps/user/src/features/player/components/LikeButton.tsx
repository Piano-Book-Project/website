import React, { useState } from 'react';

// Heroicons Heart (Outline/Fill)
const HeartOutline = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#fcfcfc"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
    />
  </svg>
);
const HeartFill = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#fcfcfc"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#fcfcfc"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z"
    />
  </svg>
);

export function LikeButton({ liked, onClick }: { liked: boolean; onClick: () => void }) {
  const [active, setActive] = useState(false);
  return (
    <button
      aria-label="좋아요"
      className={`like-button${active ? ' like-button--active' : ''}`}
      onClick={() => {
        setActive(true);
        onClick();
        setTimeout(() => setActive(false), 180);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{ color: '#fcfcfc' }}
    >
      <span className="like-button__icon">{liked ? HeartFill : HeartOutline}</span>
    </button>
  );
}
