import React from 'react';
import { ArrowUpRight, Menu, X as CloseIcon } from 'lucide-react';
import { sections } from '../../data/navigation';

export default function Navbar({
  menuOpen,
  setMenuOpen,
  onNavClick,
  onLogoClick
}) {
  return (
    <header className="topbar" id="top">
      {/* Brand Identity / Wordmark */}
      <a
        className="wordmark"
        href="#home"
        onClick={onLogoClick}
        aria-label="Abhinav Sharma home"
      >
        <span className="logo-badge">
          <img
            src="/logo-square.jpg"
            alt="Abhinav Sharma logo"
            className="logo-badge-img"
          />
          <span className="logo-status-indicator" title="Active AI Architect" />
        </span>
        <span className="wordmark-identity">
          <span className="wordmark-name">Abhinav Sharma</span>
        </span>
      </a>

      {/* Main Nav (Center on desktop, dropdown sheet on mobile) */}
      <nav
        className={menuOpen ? 'main-nav is-open' : 'main-nav'}
        aria-label="Main navigation"
      >
        {sections.map(([number, title, id]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => onNavClick(id)}
          >
            <span>{number}</span>
            {title}
          </a>
        ))}
      </nav>

      {/* Right Actions: Resume Button & Hamburger Menu (Hamburger placed furthest right) */}
      <div className="topbar-actions">
        <a
          className="resume-link"
          href="/My%20Resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Resume <ArrowUpRight size={14} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {menuOpen ? <CloseIcon /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
