import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getParentDashboard } from '../services/api';
import { CalendarIcon, HeartIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Current user:', user); // Debug log
        console.log('Token:', localStorage.getItem('token')); // Debug log

        const response = await getParentDashboard();
        console.log('Dashboard response:', response);

        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch dashboard data');
        }

        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    } else {
      console.log('No user ID found'); // Debug log
    }
  }, [user]);

  // Add debug output
  console.log('Current state:', { user, dashboardData, loading, error });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
          <pre className="mt-2 text-sm">
            User: {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
          No dashboard data available
          <pre className="mt-2 text-sm">
            User: {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-primary-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-primary-100">
              Manage your babysitting appointments and favorites
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <CalendarIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming
                </h2>
                <p className="text-3xl font-bold text-primary-600">
                  {dashboardData?.stats.upcomingReservationsCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100">
                <HeartIcon className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Favorites
                </h2>
                <p className="text-3xl font-bold text-pink-600">
                  {dashboardData?.stats.favoritesCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Hours
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData?.stats.totalHoursBooked}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Bookings
                </h2>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData?.stats.totalReservations}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reservations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.recentReservations.map((reservation) => (
              <div key={reservation._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={reservation.babysitter?.photo || '/default-avatar.png'}
                      alt={reservation.babysitter?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {reservation.babysitter?.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${reservation.totale}
                    </p>
                    <p className={`text-sm ${
                      new Date(reservation.date) > new Date() 
                        ? 'text-green-600' 
                        : 'text-gray-500'
                    }`}>
                      {new Date(reservation.date) > new Date() ? 'Upcoming' : 'Completed'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Babysitters */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Babysitters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {dashboardData?.favorites.map((babysitter) => (
              <div key={babysitter._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <img
                    src={babysitter.photo || '/default-avatar.png'}
                    alt={babysitter.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{babysitter.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {babysitter.adresse}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{babysitter.tarif} TND/hr</span>
                  <Link
                    to={`/babysitters/${babysitter._id}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 