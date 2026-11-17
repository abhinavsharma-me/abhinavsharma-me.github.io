import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { techStackCards } from '../../data/techStack';



export default function AboutSection() {
  // 'languages' open by default so the list demonstrates the statement + names immediately
  const [openIds, setOpenIds] = useState(['languages']);

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      if (prev.length === 1 && prev[0] === id) {
        return [];
      }
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [id];
    });
  };

  const handleExpandCollapseAll = () => {
    if (openIds.length === techStackCards.length) {
      setOpenIds([]);
    } else {
      setOpenIds(techStackCards.map((c) => c.id));
    }
  };

  return (
    <section id="about" className="about-exact-section page-width" aria-labelledby="about-eyebrow">
      {/* 01 / ABOUT Eyebrow */}
      <div className="about-top-row">
        <span id="about-eyebrow" className="section-eyebrow">01 &nbsp;/ &nbsp;ABOUT</span>
      </div>

      {/* Main Grid: Left Content (Bio + Tech Dropdown List) | Right Meta (Location, Focus) */}
      <div className="about-exact-layout">
        {/* Left Column */}
        <div className="about-exact-main">
          {/* Bio Lead Paragraph */}
          <p className="about-exact-bio">
            <strong>AI Architect &amp; Systems Engineer</strong> specializing in multi-agent architectures, orchestration, and enterprise-grade AI systems. Currently leading AI Engineering at{' '}
            <a
              href="https://www.qurovo.com"
              target="_blank"
              rel="noreferrer"
              className="about-company-highlight"
            >
              Qurovo
            </a>
            .
          </p>

          {/* TECHNOLOGIES & TOOLS Subheader with Expand/Collapse Action */}
          <div className="about-tech-header-wrap">
            <div className="about-tech-title-bar">
              <span className="about-tech-label">TECHNOLOGIES &amp; TOOLS I USE</span>
              <button
                type="button"
                className="tech-expand-toggle-btn"
                onClick={handleExpandCollapseAll}
                aria-label="Expand or collapse all technology categories"
              >
                {openIds.length === techStackCards.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
            <div className="about-tech-subrow">
              <span className="about-tech-subtext">The technologies behind the systems I build.</span>
              <div className="about-tech-line" />
            </div>
          </div>

          {/* Interactive Dropdown List: Language & others */}
          <div className="tech-accordion-list" role="region" aria-label="Technologies and Tools Categories">
            {techStackCards.map((card) => {
              const isOpen = openIds.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`tech-accordion-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="tech-accordion-header"
                    onClick={() => toggleItem(card.id)}
                    aria-expanded={isOpen}
                    aria-controls={`tech-panel-${card.id}`}
                    id={`tech-header-${card.id}`}
                  >
                    <div className="tech-accordion-header-left">
                      <span className="tech-accordion-title">{card.title}</span>
                    </div>

                    <div className="tech-accordion-header-right">
                      <span className="tech-accordion-count">{card.tags.length} tools</span>
                      <span className={`tech-accordion-arrow ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                        <ChevronDown size={15} />
                      </span>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`tech-panel-${card.id}`}
                      role="region"
                      aria-labelledby={`tech-header-${card.id}`}
                      className="tech-accordion-content"
                    >
                      {/* Statement */}
                      <div className="tech-accordion-statement-box">
                        <p className="tech-accordion-statement">{card.description}</p>
                      </div>

                      {/* Names */}
                      <div className="tech-accordion-names-box">

                        <div className="tech-accordion-pills">
                          {card.tags.map((tag) => (
                            <span key={tag} className="tech-pill">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Location & Focus with Vertical Separator */}
        <aside className="about-exact-sidebar" aria-label="Location and Focus details">
          <div className="about-sidebar-item">
            <span className="about-sidebar-label">LOCATION</span>
            <p className="about-sidebar-value">India · Remote Worldwide</p>
          </div>

          <div className="about-sidebar-item">
            <span className="about-sidebar-label">FOCUS</span>
            <p className="about-sidebar-value">AI Architectures &amp; Distributed Systems</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
