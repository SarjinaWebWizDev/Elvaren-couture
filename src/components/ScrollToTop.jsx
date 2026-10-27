import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Scroll to top on new navigations (not on back/forward, not on filter changes).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const type = useNavigationType();
  useEffect(() => {
    if (type === 'POP') return;
    if (hash) {
      document.querySelector(hash)?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, type]);
  return null;
}
