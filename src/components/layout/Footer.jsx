import React from 'react';

export default function Footer({ onLogoClick }) {
  return (
    <footer className="site-footer page-width">
      <a
        href="#home"
        className="footer-logo-link"
        onClick={onLogoClick}
        aria-label="Abhinav Sharma home"
      >
        <span className="footer-logo-badge">
          <img
            src="/logo-square.jpg"
            alt="Abhinav Sharma"
            className="footer-logo-img"
          />
        </span>
      </a>
      <span>ABHINAV SHARMA · AI ARCHITECT &amp; SYSTEMS ENGINEER</span>
      <a href="#top">BACK TO TOP ↑</a>
    </footer>
  );
}

