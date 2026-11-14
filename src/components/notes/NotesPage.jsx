import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, FileText, Search } from 'lucide-react';
import { notes } from '../../data/notes';

export default function NotesPage({ onSelectNote, onNavigateHome }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      note.title.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query) ||
      (note.excerpt && note.excerpt.toLowerCase().includes(query))
    );
  });

  return (
    <div className="notes-index-page page-width">
      {/* Top Breadcrumb & Back Action */}
      <nav className="notes-index-topbar" aria-label="Breadcrumb navigation">
        <button
          type="button"
          className="note-nav-back-btn"
          onClick={onNavigateHome}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>
        <span className="notes-index-counter">{notes.length} Technical Notes</span>
      </nav>

      {/* Hero Header */}
      <header className="notes-index-header">
        <span className="section-eyebrow">05 &nbsp;/ &nbsp;WRITING ARCHIVE</span>
        <h1 className="notes-index-title">Technical Notes</h1>
        <p className="notes-index-subtitle">
          Working notes and architectural essays on building reliable distributed AI systems,
          asynchronous API boundaries, and modular enterprise platforms.
        </p>

        {/* Search Input Bar */}
        <div className="notes-search-wrap">
          <Search size={16} className="notes-search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technical notes by topic, title, or keyword..."
            className="notes-search-input"
            aria-label="Search notes"
          />
          {searchQuery && (
            <button
              type="button"
              className="notes-search-clear"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <div className="notes-index-divider" />

      {/* Notes List / Grid */}
      <section className="notes-index-list" aria-label="Technical Notes Directory">
        {filteredNotes.length === 0 ? (
          <div className="notes-empty-state">
            <p>No notes matched &ldquo;{searchQuery}&rdquo;</p>
            <button
              type="button"
              className="button-outline"
              onClick={() => setSearchQuery('')}
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <article
              key={note.slug}
              className="notes-index-card"
              onClick={() => onSelectNote(note.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectNote(note.slug);
              }}
              aria-label={`Read note: ${note.title}`}
            >
              <div className="notes-card-top-row">
                <div className="notes-card-badges">
                  <span className="notes-card-index">0{index + 1}</span>
                  <span className="notes-card-category">{note.category}</span>
                </div>

                <div className="notes-card-meta">
                  <span className="notes-card-meta-item">
                    <Calendar size={13} />
                    {note.date}
                  </span>
                  <span className="notes-card-dot">·</span>
                  <span className="notes-card-meta-item">
                    <Clock size={13} />
                    {note.readTime}
                  </span>
                </div>
              </div>

              <h2 className="notes-card-title">{note.title}</h2>
              <p className="notes-card-excerpt">{note.excerpt}</p>

              <div className="notes-card-footer">
                <div className="notes-card-action">
                  <span>Read Note</span>
                  <ArrowUpRight size={14} className="notes-card-arrow" />
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

