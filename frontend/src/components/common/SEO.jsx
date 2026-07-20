import { useEffect } from 'react';

const SEO = ({ title, description, url, image, type = 'website' }) => {
  useEffect(() => {
    // Update Title
    if (title) {
      document.title = title;
    }

    // Update Meta Tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    
    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', url || window.location.href);
    if (image) setMetaTag('property', 'og:image', image);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (image) setMetaTag('name', 'twitter:image', image);

    // Optional: cleanup could remove some tags if needed, but for standard SPA 
    // it's fine to just overwrite them on next route change.
  }, [title, description, url, image, type]);

  return null; // This component doesn't render any UI
};

export default SEO;
