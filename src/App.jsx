import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SeoManager from './components/common/SeoManager';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ExperienceSection from './components/sections/ExperienceSection';
import ArchitectureSection from './components/sections/ArchitectureSection';
import OpenSourceSection from './components/sections/OpenSourceSection';
import WritingSection from './components/sections/WritingSection';
import ContactSection from './components/sections/ContactSection';
import ArchitectureDetailPage from './components/architecture/ArchitectureDetailPage';
import NotesPage from './components/notes/NotesPage';
import NoteDetailPage from './components/notes/NoteDetailPage';
import architecturePages from './architecture.json';
import { getNoteBySlug } from './data/notes';

function parseCurrentRoute() {
  if (typeof window === 'undefined') return { type: 'home' };

  const path = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash;

  // Path-based routing (/notes, /notes/:slug)
  if (path === '/notes') {
    return { type: 'notes' };
  }
  if (path.startsWith('/notes/')) {
    const slug = path.replace('/notes/', '');
    if (slug) {
      return { type: 'note', slug };
    }
  }

  // Hash-based routing (#architecture-:id, #notes, #/notes/:slug)
  if (hash.startsWith('#architecture-')) {
    const id = hash.replace('#architecture-', '');
    if (architecturePages[id]) {
      return { type: 'arch', id };
    }
  }
  if (hash === '#notes' || hash === '#/notes') {
    return { type: 'notes' };
  }
  if (hash.startsWith('#notes/') || hash.startsWith('#/notes/') || hash.startsWith('#note-')) {
    const slug = hash.replace(/^#\/?notes\//, '').replace(/^#note-/, '');
    if (slug) {
      return { type: 'note', slug };
    }
  }

  return { type: 'home' };
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(parseCurrentRoute);

  // Synchronize browser history / popstate / hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      setRoute(parseCurrentRoute());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const navigateToHome = (targetSectionId = null) => {
    setRoute({ type: 'home' });
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    if (targetSectionId) {
      window.location.hash = targetSectionId;
      setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToNotes = () => {
    setRoute({ type: 'notes' });
    window.history.pushState({}, '', '/notes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNote = (slug) => {
    setRoute({ type: 'note', slug });
    window.history.pushState({}, '', `/notes/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openArchitecturePage = (id) => {
    setRoute({ type: 'arch', id });
    window.location.hash = `architecture-${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArchitecturePage = () => {
    navigateToHome('architecture');
  };

  const handleNavClick = (id) => {
    setMenuOpen(false);

    // If currently on a subpage, return to home and scroll to section
    if (route.type !== 'home') {
      navigateToHome(id);
      return;
    }

    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogoClick = (e) => {
    if (route.type !== 'home') {
      e.preventDefault();
      navigateToHome();
    }
  };

  // Compute dynamic metadata based on active route
  const currentArch = route.type === 'arch' ? architecturePages[route.id] : null;
  const currentNote = route.type === 'note' ? getNoteBySlug(route.slug) : null;

  let seoTitle = null;
  let seoDesc = null;
  let seoPath = '/';

  if (currentArch) {
    seoTitle = `${currentArch.title} — System Architecture`;
    seoDesc = currentArch.description;
    seoPath = `/#architecture-${currentArch.id}`;
  } else if (currentNote) {
    seoTitle = `${currentNote.title} — Technical Note`;
    seoDesc = currentNote.excerpt;
    seoPath = `/notes/${currentNote.slug}`;
  } else if (route.type === 'notes') {
    seoTitle = 'Technical Notes & Writings — Abhinav Sharma';
    seoDesc = 'Working notes on building robust AI systems, asynchronous API boundaries, and modular architecture.';
    seoPath = '/notes';
  }

  return (
    <>
      {/* Dynamic SEO metadata manager */}
      <SeoManager
        title={seoTitle}
        description={seoDesc}
        path={seoPath}
      />

      {/* Accessible skip to main content */}
      <a href="#main-content" className="skip-to-content" tabIndex={0}>
        Skip to main content
      </a>

      {/* Persistent Navigation */}
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onNavClick={handleNavClick}
        onLogoClick={handleLogoClick}
      />

      {/* Main View Router */}
      <main id="main-content">
        {route.type === 'arch' ? (
          <ArchitectureDetailPage
            archId={route.id}
            onBack={closeArchitecturePage}
            onSelectArch={openArchitecturePage}
          />
        ) : route.type === 'notes' ? (
          <NotesPage
            onSelectNote={navigateToNote}
            onNavigateHome={navigateToHome}
          />
        ) : route.type === 'note' ? (
          <NoteDetailPage
            slug={route.slug}
            onBack={navigateToNotes}
            onSelectNote={navigateToNote}
            onNavigateHome={navigateToHome}
            onNavigateNotes={navigateToNotes}
          />
        ) : (
          <>
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <ArchitectureSection onSelectArch={openArchitecturePage} />
            <OpenSourceSection />
            <WritingSection
              onSelectNote={navigateToNote}
              onViewAllNotes={navigateToNotes}
            />
            <ContactSection />
          </>
        )}
      </main>

      {/* Site Footer */}
      <Footer onLogoClick={handleLogoClick} />
    </>
  );
}
