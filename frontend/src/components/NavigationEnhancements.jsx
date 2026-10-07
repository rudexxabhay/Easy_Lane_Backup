import { useEffect } from 'react';
import { navigate } from '../lib/router.js';
import { canHandleRoute } from '../lib/routePrefetch.js';

export default function NavigationEnhancements() {
  useEffect(() => {
    const getInternalLink = (event) => {
      const link = event.target?.closest?.('a[href]');
      if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return null;
      const url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin ? { link, url } : null;
    };

    const navigateInternally = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const internalLink = getInternalLink(event);
      if (!internalLink || !canHandleRoute(internalLink.url.pathname)) return;
      const { url } = internalLink;
      if (url.hash && url.pathname !== window.location.pathname) return;
      if (url.search !== window.location.search && url.pathname === window.location.pathname) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        if (url.hash) return;
        event.preventDefault();
        window.scrollTo(0, 0);
        return;
      }
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener('click', navigateInternally, true);
    return () => {
      document.removeEventListener('click', navigateInternally, true);
    };
  }, []);

  return null;
}
