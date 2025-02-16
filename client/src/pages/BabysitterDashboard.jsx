import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { StarIcon, ClockIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function BabysitterDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disponibilite, setDisponibilite] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/babysitters/dashboard');
      setDashboardData(response.data.data);
      setDisponibilite(response.data.data.disponibilite);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const response = await api.patch('/babysitters/availability', {
        disponibilite: !disponibilite
      });
      if (response.data.success) {
        setDisponibilite(!disponibilite);
      }
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 bg-primary-600">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-primary-100">
            Manage your babysitting services and availability
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Availability Status</h3>
              <p className="text-sm text-gray-500">
                {disponibilite ? 'You are currently available for bookings' : 'You are currently unavailable for bookings'}
              </p>
            </div>
            <button
              onClick={handleAvailabilityToggle}
              className={`${
                disponibilite ? 'bg-primary-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
            >
              <span className="sr-only">Toggle availability</span>
              <span
                className={`${
                  disponibilite ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
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
                  {dashboardData?.stats?.upcomingReservationsCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Earnings
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData?.stats?.totalEarnings || 0} TND
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Rating
                </h2>
                <p className="text-3xl font-bold text-yellow-600">
                  {dashboardData?.stats?.rating?.toFixed(1) || '0.0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Hours
                </h2>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData?.stats?.totalHoursBooked || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/availability"
              className="block p-6 bg-white border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Availability</h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage your working hours and schedule
              </p>
            </Link>

            <Link
              to="/reservations"
              className="block p-6 bg-white border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">Reservations</h3>
              <p className="mt-2 text-sm text-gray-500">
                View and manage your bookings
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 