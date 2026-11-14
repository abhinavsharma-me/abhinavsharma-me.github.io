import React from 'react';

export default function SectionLabel({ number, children, className = '' }) {
  return (
    <span className={`section-eyebrow ${className}`}>
      <span className="eyebrow-num">{number}</span>
      <span className="eyebrow-slash">&nbsp;/&nbsp;</span>
      <span className="eyebrow-title">{children}</span>
    </span>
  );
}
