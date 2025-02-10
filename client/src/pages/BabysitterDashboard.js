import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReservations } from '../services/api';
import { Link } from 'react-router-dom';

export default function BabysitterDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingReservations: 0,
    totalEarnings: 0,
    totalReviews: 0,
    averageRating: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const reservationsResponse = await getReservations();
      const reservations = reservationsResponse.data;
      
      // Calculate stats
      const pending = reservations.filter(r => r.status === 'pending').length;
      const earnings = reservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.totale, 0);

      setStats({
        pendingReservations: pending,
        totalEarnings: earnings,
        totalReviews: user.totalReviews || 0,
        averageRating: user.rating || 0
      });

      setRecentReservations(reservations.slice(0, 5)); // Get 5 most recent
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user.name}!</h1>
      
      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-sm font-medium text-gray-500">Pending Requests</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.pendingReservations}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-sm font-medium text-gray-500">Total Earnings</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  ${stats.totalEarnings}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-sm font-medium text-gray-500">Reviews</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.totalReviews}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-sm font-medium text-gray-500">Average Rating</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.averageRating.toFixed(1)}⭐
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Reservations</h2>
          <Link
            to="/reservations"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentReservations.map((reservation) => (
              <li key={reservation._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.parent.name}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        reservation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 