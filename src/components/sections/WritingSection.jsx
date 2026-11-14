import React from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { notes } from '../../data/notes';

export default function WritingSection({ onSelectNote, onViewAllNotes }) {
  // Show only the 3 notes on the homepage as requested
  const homepageNotes = notes.slice(0, 3);

  return (
    <section id="writing" className="writing-section page-width" aria-labelledby="writing-heading">
      {/* Section Header */}
      <div className="writing-header-row">
        <div className="writing-header-left">
          <span className="section-eyebrow">05 &nbsp;/ &nbsp;WRITING</span>
          <h2 id="writing-heading" className="writing-heading-main">Technical Notes</h2>
          <p className="writing-subheading">
            Working notes on building robust AI systems, evaluation frameworks, and agentic workflows.
          </p>
        </div>

        {onViewAllNotes && (
          <div className="writing-header-right">
            <button
              type="button"
              className="writing-view-all-btn"
              onClick={onViewAllNotes}
              aria-label="View all technical notes archive"
            >
              <span>VIEW ALL NOTES</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="writing-header-divider" />

      {/* Full-Width Writing List */}
      <div className="writing-list-full" aria-label="Technical Notes List">
        {homepageNotes.map((note) => (
          <article
            key={note.slug}
            className="writing-item"
            onClick={() => onSelectNote && onSelectNote(note.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSelectNote && onSelectNote(note.slug);
            }}
            aria-label={`Read note: ${note.title}`}
          >
            <div className="writing-item-left">
              <FileText size={16} className="writing-item-icon" />
              <div className="writing-item-text-group">
                <span className="writing-item-title">{note.title}</span>
                <span className="writing-item-meta">{note.readTime} · {note.date}</span>
              </div>
            </div>
            <div className="writing-item-right">
              <span className="writing-badge">{note.category}</span>
              <ArrowUpRight size={14} className="writing-item-arrow" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
