import React from 'react';
import { ArrowUpRight, Github, Instagram, Linkedin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">AI ARCHITECT&nbsp; / &nbsp;SYSTEMS ENGINEER</p>
        <h1 id="hero-title">Hello<span>,</span></h1>
        <p className="hero-intro">
          <span className="hero-intro-title">
            I design intelligent systems and build reliable AI workflows.
          </span>
        </p>
        <div className="hero-actions">
          <div className="hero-action-buttons">
            <a
              className="button button-dark"
              href="https://github.com/abhinavsharma-me"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={15} /> GitHub <ArrowUpRight size={14} />
            </a>
            <a
              className="button button-outline"
              href="/My%20Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Resume <ArrowUpRight size={14} />
            </a>
          </div>
          <a className="text-action hero-explore-link" href="#architecture">
            <span>Explore Work</span> <ArrowUpRight size={15} />
          </a>
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-image-frame">
          <img
            src="/hero.jpeg"
            alt="Abhinav Sharma — AI Architect"
            className="hero-image"
            loading="eager"
            fetchPriority="high"
          />
          <span className="hero-image-name">ABHINAV SHARMA</span>
        </div>
        <div className="hero-socials" aria-label="Social profiles">
          <a
            href="https://www.linkedin.com/in/abhinavsharma07/"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://github.com/abhinavsharma-me"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="https://x.com/abhinavsharma_x"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="X (Twitter)"
            title="X"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://instagram.com/me.abhinavsharma"
            target="_blank"
            rel="noreferrer"
            className="social-icon-btn"
            aria-label="Instagram"
            title="Instagram"
          >
            <Instagram size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

