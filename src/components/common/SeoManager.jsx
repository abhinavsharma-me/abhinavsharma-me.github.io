import { useEffect } from 'react';

/**
 * Production SEO manager that dynamically updates document metadata,
 * OpenGraph, Twitter cards, and canonical links.
 */
export default function SeoManager({ title, description, path = '', image = '/hero.jpeg' }) {
  useEffect(() => {
    // 1. Update Title
    const siteTitle = 'Abhinav Sharma — AI Architect & Systems Engineer';
    document.title = title ? `${title} | ${siteTitle}` : siteTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      if (!value) return;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        el.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attribute, value);
    };

    const finalDescription = description ||
      'Abhinav Sharma is an AI Architect & Systems Engineer specializing in multi-agent orchestration, production AI guardrails, distributed systems, and scalable full-stack engineering.';

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', finalDescription);
    setMetaTag('meta[name="author"]', 'content', 'Abhinav Sharma');
    setMetaTag('meta[name="robots"]', 'content', 'index, follow');

    // 3. OpenGraph Tags
    const fullUrl = `https://abhinavsharma.me${path}`;
    setMetaTag('meta[property="og:title"]', 'content', title ? `${title} | Abhinav Sharma` : siteTitle);
    setMetaTag('meta[property="og:description"]', 'content', finalDescription);
    setMetaTag('meta[property="og:url"]', 'content', fullUrl);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    setMetaTag('meta[property="og:image"]', 'content', `https://abhinavsharma.me${image}`);

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:site"]', 'content', '@abhinavsharma_x');
    setMetaTag('meta[name="twitter:creator"]', 'content', '@abhinavsharma_x');
    setMetaTag('meta[name="twitter:title"]', 'content', title ? `${title} | Abhinav Sharma` : siteTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', finalDescription);
    setMetaTag('meta[name="twitter:image"]', 'content', `https://abhinavsharma.me${image}`);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);
  }, [title, description, path, image]);

  return null;
}

