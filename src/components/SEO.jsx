import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    const baseTitle = "Magic Embroidery — It's Digital";
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
