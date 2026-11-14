import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Globe } from 'lucide-react';
import architecturePages from '../../architecture.json';

export default function ArchitectureDetailPage({ archId, onBack, onSelectArch }) {
  const currentArch =
    architecturePages[archId] ||
    architecturePages['creatorsarthi'] ||
    Object.values(architecturePages)[0];

  const pageKeys = Object.keys(architecturePages);
  const currentIndex = pageKeys.indexOf(currentArch.id);
  const prevKey = pageKeys[(currentIndex - 1 + pageKeys.length) % pageKeys.length];
  const nextKey = pageKeys[(currentIndex + 1) % pageKeys.length];
  const prevArch = architecturePages[prevKey];
  const nextArch = architecturePages[nextKey];
  const iframeRef = useRef(null);

  const syncIframeHeight = () => {
    if (!iframeRef.current) return;
    try {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.documentElement.style.overflow = 'hidden';
        doc.body.style.overflow = 'hidden';
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight,
          doc.body.offsetHeight,
          doc.documentElement.offsetHeight
        );
        if (height > 100) {
          iframeRef.current.style.height = `${height + 24}px`;
        }
      }
    } catch {
      // Fallback: cross-origin or sandbox restrictions
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [archId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      syncIframeHeight();
      setTimeout(syncIframeHeight, 150);
      setTimeout(syncIframeHeight, 400);
    };

    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [archId]);

  return (
    <article className="arch-detail-page page-width" aria-labelledby="detail-arch-heading">
      {/* Top back navigation */}
      <nav className="arch-detail-topbar" aria-label="Architecture detail navigation">
        <button
          type="button"
          onClick={onBack}
          className="arch-back-btn"
          aria-label="Back to architectures list"
        >
          <ArrowLeft size={16} /> Back to Architectures
        </button>
        <div className="arch-detail-meta">
          <span className="arch-meta-num">{currentArch.number || '01 /'}</span>
          {currentArch.badge && (
            <span className={`card-badge card-badge-${currentArch.badgeType || 'production'}`}>
              <span className="badge-dot" />
              {currentArch.badge}
            </span>
          )}
          {currentArch.visitUrl && (
            <a
              href={currentArch.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-topbar-visit-link"
              title={`Visit ${currentArch.title} (${currentArch.visitLabel || currentArch.visitUrl})`}
            >
              {currentArch.visitType === 'github' ? <Github size={13} /> : <Globe size={13} />}
              <span>Visit {currentArch.visitType === 'github' ? 'GitHub' : 'Live Site'}</span>
              <ArrowUpRight size={12} />
            </a>
          )}
          {currentArch.htmlFile && (
            <a
              href={currentArch.htmlFile}
              target="_blank"
              rel="noreferrer"
              className="arch-open-external-link"
              title="Open standalone HTML diagram in a new tab"
            >
              Open Fullscreen <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </nav>

      {/* Hero header */}
      <header className="arch-detail-header">
        <span className="arch-detail-eyebrow">SYSTEM ARCHITECTURE</span>
        <h1 id="detail-arch-heading" className="arch-detail-title">
          {currentArch.heading || currentArch.title}
        </h1>
        {currentArch.description && (
          <p className="arch-detail-subtitle">{currentArch.description}</p>
        )}
       
      </header>

      {/* Overview section placed above the HTML diagram */}
      {currentArch.overview && (
        <section className="arch-overview-top-block" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="arch-block-heading">Overview</h2>
          <p className="arch-block-text">{currentArch.overview}</p>
        </section>
      )}

      {/* HTML Architecture Diagram Canvas */}
      <section className="arch-diagram-section arch-html-section" aria-label="Interactive architecture diagram">
        <div className="arch-html-container">
          <iframe
            ref={iframeRef}
            src={currentArch.htmlFile || '/architectures/creatorsarthi.html'}
            title={`${currentArch.title} Architecture Diagram`}
            className="arch-html-frame"
            scrolling="no"
            onLoad={syncIframeHeight}
          />
        </div>
      </section>

      {/* Detailed Technical Content */}
      <div className="arch-detail-content-blocks">
        {currentArch.architecturalDecisions && currentArch.architecturalDecisions.length > 0 && (
          <section className="arch-components-block" aria-labelledby="decisions-heading">
            <h2 id="decisions-heading" className="arch-block-heading">Key Architectural Decisions</h2>
            <div className="arch-decisions-grid">
              {currentArch.architecturalDecisions.map((item, idx) => (
                <div key={idx} className="arch-decision-card">
                  <h3 className="decision-title">{item.decision}</h3>
                  <p className="decision-text"><strong>Reasoning:</strong> {item.reasoning}</p>
                  <p className="decision-text"><strong>Trade-off:</strong> {item.tradeoff}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentArch.components && currentArch.components.length > 0 && (
          <section className="arch-components-block" aria-labelledby="components-heading">
            <h2 id="components-heading" className="arch-block-heading">Core Architectural Components</h2>
            <div className="arch-components-grid">
              {currentArch.components.map((comp) => (
                <div key={comp.name} className="arch-component-card">
                  <div className="comp-card-header">
                    <span className="comp-role-badge">{comp.role}</span>
                    <h3 className="comp-name">{comp.name}</h3>
                  </div>
                  <p className="comp-desc">{comp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentArch.engineeringPrinciples && currentArch.engineeringPrinciples.length > 0 && (
          <section className="arch-prose-block" aria-labelledby="principles-heading">
            <h2 id="principles-heading" className="arch-block-heading">Engineering Principles</h2>
            <ul className="arch-bullets-list">
              {currentArch.engineeringPrinciples.map((p, idx) => (
                <li key={idx}>
                  <span className="bullet-square">■</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {currentArch.outcomes && currentArch.outcomes.length > 0 && (
          <section className="arch-prose-block" aria-labelledby="outcomes-heading">
            <h2 id="outcomes-heading" className="arch-block-heading">Outcomes &amp; Impact</h2>
            <ul className="arch-bullets-list">
              {currentArch.outcomes.map((o, idx) => (
                <li key={idx}>
                  <span className="bullet-square">■</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Pagination Footer */}
      <footer className="arch-detail-pagination">
        {prevArch && (
          <button
            type="button"
            onClick={() => onSelectArch(prevArch.id)}
            className="pagination-btn pagination-prev"
          >
            <span className="pagination-kicker">← PREVIOUS ARCHITECTURE</span>
            <span className="pagination-title">{prevArch.title}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="pagination-btn pagination-center"
        >
          Back to Architectures
        </button>

        {nextArch && (
          <button
            type="button"
            onClick={() => onSelectArch(nextArch.id)}
            className="pagination-btn pagination-next"
          >
            <span className="pagination-kicker">NEXT ARCHITECTURE →</span>
            <span className="pagination-title">{nextArch.title}</span>
          </button>
        )}
      </footer>
    </article>
  );
}

