import React from 'react';
import { ArrowUpRight, BookMarked, GitPullRequest, Github } from 'lucide-react';
import { openSourceProjects, recentPullRequests } from '../../data/openSource';

export default function OpenSourceSection() {
  return (
    <section id="open-source" className="oss-section page-width" aria-labelledby="oss-main-heading">
      {/* Section Header */}
      <div className="oss-header-row">
        <div className="oss-header-left">
          <span className="section-eyebrow">04 &nbsp;/ &nbsp;OPEN SOURCE</span>
          <h2 id="oss-main-heading" className="oss-heading-main">Building in the open.</h2>
          <p className="oss-subheading">
            Projects and contributions where I build, extend and improve developer tools, AI systems, and real-world infrastructure in the open.
          </p>
        </div>
       
      </div>

      <div className="oss-header-divider" />

      {/* Subsection 1: Open Source Projects */}
      <div className="oss-subsection" id="oss-projects-group">
        <div className="oss-subsection-header">
          <Github size={18} className="oss-section-icon" />
          <h3 id="oss-projects-heading" className="oss-subsection-title">Open Source Projects</h3>
        </div>

        <div className="oss-projects-grid">
          {openSourceProjects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="oss-project-card"
              aria-label={`Open ${project.owner}/${project.repo} on GitHub`}
            >
              {/* Terminal Window Header */}
              <div className="terminal-window-bar">
                <div className="terminal-dots">
                  <span className="terminal-dot dot-red" />
                  <span className="terminal-dot dot-yellow" />
                  <span className="terminal-dot dot-green" />
                </div>
                <div className="terminal-stars">
                  <span className="star-icon">★</span>
                  <span className="star-count">{project.stars}</span>
                </div>
              </div>

              {/* Repo Name */}
              <div className="terminal-repo-title">
                <span className="repo-owner">{project.owner}</span>
                <span className="repo-slash"> / </span>
                <span className="repo-name">{project.repo}</span>
              </div>

              {/* Description */}
              <p className="terminal-repo-desc">{project.description}</p>

              {/* Footer Row */}
              <div className="terminal-card-footer">
                <div className="terminal-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="terminal-tag">{tag}</span>
                  ))}
                </div>
                <span className="terminal-type-label">{project.type}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="oss-subsections-divider" />

      {/* Subsection 2: Recent Pull Requests */}
      <div className="oss-subsection" id="oss-prs-group">
        <div className="oss-subsection-header pr-header-split">
          <div className="pr-header-left">
            <GitPullRequest size={18} className="oss-section-icon" />
            <h3 id="oss-prs-heading" className="oss-subsection-title">Pull Requests & Commits</h3>
          </div>
          <a
            href="https://github.com/pulls?q=is%3Apr+author%3Aabhinavsharma-me"
            target="_blank"
            rel="noopener noreferrer"
            className="oss-view-all-prs-link"
          >
            <span>View All Pull Requests</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        <div className="oss-prs-grid">
          {recentPullRequests.map((pr) => (
            <a
              key={pr.id}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="oss-pr-card"
              aria-label={`View Pull Request ${pr.prNumber} on GitHub`}
            >
              {/* Overlapping PR Number Badge */}
              <div className="pr-number-tab">{pr.prNumber}</div>

              {/* PR Card Top Row */}
              <div className="pr-card-top">
                <div className="pr-repo-info">
                  <BookMarked size={14} className="pr-book-icon" />
                  <span className="pr-repo-path">
                    {pr.owner} <span className="pr-path-sep">/</span> {pr.repo}
                  </span>
                </div>
                <div className="pr-stars-count">
                  <span className="pr-star-num">{pr.stars}</span>
                  <span className="pr-star-symbol">★</span>
                </div>
              </div>

              {/* PR Title with Accent Bar */}
              <div className="pr-card-body">
                <div className="pr-accent-bar" />
                <h4 className="pr-title-text">{pr.title}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
