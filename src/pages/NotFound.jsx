import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <EmptyState
      title="This page could not be found"
      actions={
        <>
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/collections" className="btn btn-outline">Collections</Link>
        </>
      }
    >
      The link may be out of date, or the page may have moved.
    </EmptyState>
  );
}
