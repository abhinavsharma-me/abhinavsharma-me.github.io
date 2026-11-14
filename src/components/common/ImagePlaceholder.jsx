import React from 'react';

export default function ImagePlaceholder({ name, className = '' }) {
  return (
    <div
      className={`image-placeholder ${className}`}
      role="img"
      aria-label={`${name} image placeholder`}
    >
      <span className="placeholder-corner" aria-hidden="true">+</span>
      <span className="placeholder-label">{name.toUpperCase()} · IMAGE PLACEHOLDER</span>
    </div>
  );
}

