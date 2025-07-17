import React from 'react';

export function MoreMenu() {
  return (
    <button className="more-menu">
      <svg className="more-menu__icon">
        <circle cx="10" cy="4" r="2" />
        <circle cx="10" cy="10" r="2" />
        <circle cx="10" cy="16" r="2" />
      </svg>
    </button>
  );
}
