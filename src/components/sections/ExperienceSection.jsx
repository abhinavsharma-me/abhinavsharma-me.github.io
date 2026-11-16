import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { careerRoles, allProjects } from '../../data/career';

export default function ExperienceSection() {
  const [activeRoleKey, setActiveRoleKey] = useState('tech-lead');
  const [projectTabs, setProjectTabs] = useState({});

  const setProjectTab = (projectId, tabName) => {
    setProjectTabs((prev) => ({ ...prev, [projectId]: tabName }));
  };

  const scrollToRole = (roleKey) => {
    setActiveRoleKey(roleKey);
    const roleConfig = careerRoles.find((r) => r.key === roleKey);
    if (!roleConfig) return;

    const targetProject = allProjects.find((p) => p.roleKey === roleKey);
    if (targetProject) {
      const el = document.getElementById(`project-${targetProject.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Observe scrolling to automatically sync the active role in the timeline
  useEffect(() => {
    const handleScroll = () => {
      const projects = allProjects.map((p) => ({
        key: p.roleKey,
        el: document.getElementById(`project-${p.id}`)
      }));

      const scrollPos = window.scrollY + 220;

      for (let i = projects.length - 1; i >= 0; i--) {
        const item = projects[i];
        if (item.el && item.el.offsetTop <= scrollPos) {
          setActiveRoleKey(item.key);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="experience" className="experience-showcase-section page-width" aria-labelledby="experience-heading">
      <div className="experience-header">
        <div className="experience-header-left">
          <div className="section-eyebrow">02 &nbsp;/&nbsp; EXPERIENCE</div>
          <h2 id="experience-heading" className="section-heading experience-heading">Systems I've Built</h2>
          <p className="experience-subheading">
            A record of the systems I've designed, engineered, and brought into production.
          </p>
        </div>
        <a
          href="https://www.linkedin.com/in/abhinavsharma07/"
          target="_blank"
          rel="noreferrer"
          className="experience-header-link"
        >
          View LinkedIn <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="experience-header-divider" />

      <div className="experience-body">
        {/* Left Column: Career Timeline (Sticky) */}
        <aside className="career-timeline" aria-label="Career timeline">
          <span className="timeline-heading">CAREER TIMELINE</span>
          <div className="timeline-items">
            {careerRoles.map((role) => {
              const isActive = activeRoleKey === role.key;
              return (
                <div
                  key={role.key}
                  className={`timeline-entry ${isActive ? 'active' : ''}`}
                  onClick={() => scrollToRole(role.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToRole(role.key);
                    }
                  }}
                >
                  <span className={`timeline-marker ${isActive ? 'active' : ''}`} />
                  <div className="timeline-entry-content">
                    {role.isCurrent && <span className="role-current-tag">CURRENT</span>}
                    <h3 className="timeline-role-title">{role.role}</h3>
                    <span className="timeline-company">{role.company}</span>
                    <time className="timeline-period">{role.period}</time>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Projects Column */}
        <div className="experience-showcase-panel">
          {allProjects.map((proj) => {
            const currentTab = projectTabs[proj.id] || 'OVERVIEW';
            return (
              <article className="project-card" key={proj.id} id={`project-${proj.id}`}>
                <div className="showcase-top-row">
                  <div className="showcase-breadcrumb">
                    <span>{proj.company.toUpperCase()}</span>
                    <span className="breadcrumb-slash">/</span>
                    <span>{proj.id}</span>
                    <span className="breadcrumb-role-tag">{proj.roleTitle.toUpperCase()}</span>
                  </div>

                  <a
                    href={proj.website}
                    target="_blank"
                    rel="noreferrer"
                    className="showcase-website-btn"
                  >
                    <ArrowUpRight size={13} /> {proj.websiteLabel}
                  </a>
                </div>

                <h3 className="showcase-project-title">{proj.title}</h3>
                <p className="showcase-project-subtitle">{proj.subtitle}</p>

                {/* View Tabs */}
                <div className="showcase-view-tabs" role="tablist" aria-label="Project views">
                  {['OVERVIEW', 'ARCHITECTURE', 'ENGINEERING', 'IMPACT'].map((tab) => (
                    <button
                      key={tab}
                      className={`view-tab-btn ${currentTab === tab ? 'active' : ''}`}
                      onClick={() => setProjectTab(proj.id, tab)}
                      role="tab"
                      aria-selected={currentTab === tab}
                      type="button"
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="showcase-tabs-divider" />

                {/* Content Grid */}
                <div className="showcase-content-grid">
                  {/* Left Column: Details */}
                  <div className="showcase-details-col">
                    {currentTab === 'OVERVIEW' ? (
                      <>
                        <div className="detail-block">
                          <span className="detail-label">THE PROBLEM</span>
                          <span className="detail-dash">—</span>
                          <p className="detail-text">{proj.problem}</p>
                        </div>
                        <div className="detail-block">
                          <span className="detail-label">THE SOLUTION</span>
                          <span className="detail-dash">—</span>
                          <p className="detail-text">{proj.solution}</p>
                        </div>
                        <div className="detail-block">
                          <span className="detail-label">KEY CONTRIBUTIONS</span>
                          <span className="detail-dash">—</span>
                          <ul className="contributions-list">
                            {proj.contributions.map((item, i) => (
                              <li key={i}>
                                <span className="bullet-square">■</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      proj.tabs[currentTab] && (
                        <>
                          <div className="detail-block">
                            <span className="detail-label">{currentTab} FOCUS</span>
                            <span className="detail-dash">—</span>
                            <h4 className="tab-focus-title">{proj.tabs[currentTab].title}</h4>
                            <p className="detail-text">{proj.tabs[currentTab].description}</p>
                          </div>
                          <div className="detail-block">
                            <span className="detail-label">KEY IMPLEMENTATION HIGHLIGHTS</span>
                            <span className="detail-dash">—</span>
                            <ul className="contributions-list">
                              {proj.tabs[currentTab].highlights.map((item, i) => (
                                <li key={i}>
                                  <span className="bullet-square">■</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )
                    )}
                  </div>

                  {/* Right Column: Outcomes & Tech Stack */}
                  <div className="showcase-metrics-col">
                    <div className="metrics-section">
                      <span className="metrics-header-label">OUTCOME</span>
                      <div className="outcome-stats-row">
                        <div className="stat-card">
                          <span className="stat-number">{proj.outcome.stat1}</span>
                          <span className="stat-label">{proj.outcome.stat1Label}</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-card">
                          <span className="stat-number stat-display">{proj.outcome.stat2}</span>
                          <span className="stat-label">{proj.outcome.stat2Label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="metrics-divider" />

                    <div className="tech-stack-section">
                      <span className="metrics-header-label">TECH STACK</span>
                      <div className="showcase-tech-pills">
                        {proj.techStack.map((tech) => (
                          <span key={tech} className="showcase-tech-pill">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

