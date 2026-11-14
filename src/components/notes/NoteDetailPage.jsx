import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, Check, Clock, Copy, FileText, Share2 } from 'lucide-react';
import { marked } from 'marked';
import { notes, getNoteBySlug } from '../../data/notes';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false
});

export default function NoteDetailPage({ slug, onBack, onSelectNote, onNavigateHome, onNavigateNotes }) {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const note = getNoteBySlug(slug) || notes[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Scroll to top when note changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`/notes/${note.filename}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load note: HTTP ${res.status}`);
        }
        return res.text();
      })
      .then((text) => {
        if (isMounted) {
          setMarkdown(text);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [note.filename]);

  // Strip initial redundant `# Title` line since it is rendered in our custom editorial header
  let processedMarkdown = markdown;
  if (processedMarkdown.startsWith('# ')) {
    const firstNewline = processedMarkdown.indexOf('\n');
    if (firstNewline !== -1) {
      processedMarkdown = processedMarkdown.slice(firstNewline + 1).trim();
    }
  }

  const htmlContent = marked.parse(processedMarkdown);

  // Attach interactive copy buttons to all `<pre>` code blocks
  useEffect(() => {
    if (!contentRef.current) return;
    const preBlocks = contentRef.current.querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.type = 'button';
      copyBtn.setAttribute('aria-label', 'Copy code snippet');
      copyBtn.innerHTML = '<span>Copy</span>';

      copyBtn.onclick = () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = '<span>Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>';
          }, 2000);
        });
      };

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    });
  }, [htmlContent]);

  const handleCopyNoteLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const otherNotes = notes.filter((n) => n.slug !== note.slug);

  return (
    <article className="note-detail-page page-width" aria-labelledby="note-title">
      {/* Top Breadcrumb & Action Bar */}
      <nav className="note-breadcrumb-bar" aria-label="Breadcrumb navigation">
        <div className="note-breadcrumb-links">
          <button
            type="button"
            className="note-nav-back-btn"
            onClick={onBack || onNavigateNotes}
          >
            <ArrowLeft size={14} />
            <span>All Notes</span>
          </button>
          <span className="note-breadcrumb-divider">/</span>
          <button
            type="button"
            className="note-breadcrumb-home-link"
            onClick={onNavigateHome}
          >
            Home
          </button>
          <span className="note-breadcrumb-divider">/</span>
          <span className="note-breadcrumb-current">{note.category}</span>
        </div>

        <button
          type="button"
          className="note-share-btn"
          onClick={handleCopyNoteLink}
          title="Copy link to this note"
          aria-label="Copy note link"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </nav>

      {/* Note Header / Meta Banner */}
      <header className="note-article-header">
        <div className="note-meta-badges">
          <span className="note-category-pill">{note.category}</span>
          <span className="note-meta-item">
            <Calendar size={13} />
            {note.date}
          </span>
          <span className="note-meta-dot">·</span>
          <span className="note-meta-item">
            <Clock size={13} />
            {note.readTime}
          </span>
        </div>

        <h1 id="note-title" className="note-article-title">
          {note.title}
        </h1>

        {note.excerpt && (
          <p className="note-article-excerpt">{note.excerpt}</p>
        )}

        <div className="note-header-divider" />
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div className="note-loading-box" role="status" aria-live="polite">
          <div className="note-skeleton-line wide" />
          <div className="note-skeleton-line" />
          <div className="note-skeleton-line mid" />
          <p className="note-loading-text">Loading technical note...</p>
        </div>
      ) : error ? (
        <div className="note-error-box" role="alert">
          <h3>Failed to load note</h3>
          <p>{error}</p>
          <button
            type="button"
            className="button-outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div
          ref={contentRef}
          className="note-markdown-body"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}

      {/* Note End Divider & Author Signoff */}
      <footer className="note-article-footer">
        <div className="note-author-box">
          <div className="note-author-avatar-frame">
            <img
              src="/logo-square.jpg"
              alt="Abhinav Sharma"
              className="note-author-avatar"
            />
          </div>
          <div className="note-author-info">
            <span className="note-author-name">Abhinav Sharma</span>
            <p className="note-author-role">
              AI Architect &amp; Systems Engineer
            </p>
          </div>
        </div>

        {/* Other Technical Notes */}
        {otherNotes.length > 0 && (
          <div className="note-more-section">
            <div className="note-more-header">
              <span className="note-more-eyebrow">CONTINUE READING</span>
              <h3 className="note-more-title">More Technical Notes</h3>
            </div>

            <div className="note-more-grid">
              {otherNotes.map((item) => (
                <div
                  key={item.slug}
                  className="note-more-card"
                  onClick={() => onSelectNote && onSelectNote(item.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelectNote && onSelectNote(item.slug);
                  }}
                >
                  <div className="note-more-card-top">
                    <span className="note-card-badge">{item.category}</span>
                    <span className="note-card-time">{item.readTime}</span>
                  </div>
                  <h4 className="note-more-card-title">{item.title}</h4>
                  <p className="note-more-card-excerpt">{item.excerpt}</p>
                  <div className="note-more-card-link">
                    <span>Read Note</span>
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Back Action */}
        <div className="note-bottom-back-row">
          <button
            type="button"
            className="button-outline"
            onClick={onBack || onNavigateNotes}
          >
            <ArrowLeft size={14} />
            <span>Back to All Technical Notes</span>
          </button>
        </div>
      </footer>
    </article>
  );
}

