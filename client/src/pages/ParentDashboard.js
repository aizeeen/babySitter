import { useAuth } from '../context/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Parent Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Overview</h2>
            <div className="mt-4">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              {/* Add more parent-specific information */}
            </div>
          </div>
        </div>
        {/* Add more dashboard widgets specific to parents */}
      </div>
    </div>
  );
} 