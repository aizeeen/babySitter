import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900">Oops!</h1>
        <p className="text-gray-600">
          {error.statusText || error.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
} 