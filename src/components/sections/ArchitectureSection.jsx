import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import MermaidChart from '../common/MermaidChart';
import { architectureCards } from '../../data/architectures';

export default function ArchitectureSection({ onSelectArch }) {
  return (
    <section id="architecture" className="architecture-section page-width" aria-labelledby="arch-section-heading">
      <div className="architecture-header">
        <div className="architecture-header-left">
          <span className="section-eyebrow">03 &nbsp;/ &nbsp;ARCHITECTURE</span>
          <h2 id="arch-section-heading" className="section-heading">System Architecture</h2>
          <p className="architecture-subheading">
            Original architectures for real-world problems I've designed and built.
          </p>
        </div>
        <div className="architecture-header-right">
          <a
            href="https://github.com/abhinavsharma-me"
            target="_blank"
            rel="noreferrer"
            className="architecture-header-link"
          >
            Visit GitHub <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="architecture-header-divider" />

      {/* 4 Cards Grid - Rendered in a single row */}
      <div className="architecture-cards-grid">
        {architectureCards.map((item) => (
          <div
            key={item.id}
            className="architecture-card"
            onClick={() => onSelectArch(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectArch(item.id);
              }
            }}
          >
            <div className="card-top-row">
              <span className="card-number">{item.number}</span>
              <span className={`card-badge card-badge-${item.badgeType}`}>
                <span className="badge-dot" />
                {item.badge}
              </span>
            </div>

            <h3 className="card-title">{item.title}</h3>
            <p className="card-subtitle">{item.subtitle}</p>

            <div className="card-diagram-box">
              <MermaidChart
                chart={item.previewChart}
                id={`card-${item.id}`}
                className="card-mermaid"
              />
            </div>

            <div className="card-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="card-tag">{tag}</span>
              ))}
            </div>

            <div className="card-footer-row">
              <span className="card-action-link">
                View Architecture <span className="action-arrow">→</span>
              </span>
              {item.visitUrl && (
                <a
                  href={item.visitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-direct-visit-link"
                  onClick={(e) => e.stopPropagation()}
                  title={`Visit ${item.title} (${item.visitLabel || item.visitUrl})`}
                >
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

