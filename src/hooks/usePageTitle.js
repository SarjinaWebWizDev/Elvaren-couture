import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ÉLVARÉN` : 'ÉLVARÉN — Contemporary Luxury Ethnic Wear';
  }, [title]);
}
