import { createPortal } from 'react-dom';

// Drawers and dialogs render at <body> level so transformed or filtered
// ancestors (sticky header, animated cards) can never trap `position: fixed`.
export default function Portal({ children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}
