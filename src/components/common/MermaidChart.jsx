import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

let mermaidInitialized = false;

function ensureMermaidInit() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      primaryColor: '#F7F7F6',
      primaryTextColor: '#1C1C1A',
      primaryBorderColor: '#8C8C88',
      lineColor: '#595956',
      secondaryColor: '#FFFFFF',
      tertiaryColor: '#FAFAFA',
      edgeLabelBackground: '#FFFFFF',
      fontFamily: 'Geist, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      fontSize: '11px',
      nodeBorder: '1px',
      mainBkg: '#FFFFFF'
    },
    flowchart: {
      curve: 'basis',
      padding: 12,
      nodeSpacing: 28,
      rankSpacing: 28,
      htmlLabels: true
    }
  });
  mermaidInitialized = true;
}

export default function MermaidChart({ chart, id, className = '' }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    ensureMermaidInit();

    const renderChart = async () => {
      if (!containerRef.current || !chart) return;
      try {
        const uniqueId = `mermaid-${id || Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Mermaid render warning:', err);
          setError(true);
        }
      }
    };

    renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-chart-wrapper ${className}`}
      aria-label="Architecture diagram"
    >
      {error && <span className="mermaid-fallback-text">Diagram loading...</span>}
    </div>
  );
}

