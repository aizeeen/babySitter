import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getBabysitterDashboard, updateBabysitterAvailability } from '../services/api';
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
      const response = await getBabysitterDashboard();
      if (response.success) {
        setDashboardData(response.data);
        if ('disponibilite' in response.data) {
          setDisponibilite(response.data.disponibilite);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const response = await updateBabysitterAvailability(!disponibilite);
      if (response.success) {
        setDisponibilite(!disponibilite);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center p-4">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={CalendarIcon}
          title="Upcoming Bookings"
          value={dashboardData.stats.upcomingReservationsCount}
          color="primary"
        />
        <StatCard
          icon={CurrencyDollarIcon}
          title="Total Earnings"
          value={`${dashboardData.stats.totalEarnings} TND`}
          color="green"
        />
        <StatCard
          icon={StarIcon}
          title="Average Rating"
          value={dashboardData.stats.averageRating}
          color="yellow"
        />
        <StatCard
          icon={ClockIcon}
          title="Total Reservations"
          value={dashboardData.stats.totalReservations}
          color="blue"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reservations</h2>
          {dashboardData.recentReservations.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentReservations.map((reservation) => (
                <ReservationCard key={reservation._id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent reservations</p>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          {dashboardData.recentReviews.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    primary: 'text-primary-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        <div className="ml-4">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className={`text-2xl font-semibold ${colorClasses[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({ reservation }) {
  return (
    <div className="border-l-4 border-primary-600 pl-4">
      <p className="font-medium">{reservation.parent.name}</p>
      <p className="text-sm text-gray-500">
        {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
      </p>
      <p className="text-sm font-medium text-primary-600">{reservation.status}</p>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="border-l-4 border-yellow-400 pl-4">
      <div className="flex items-center">
        <p className="font-medium">{review.parent.name}</p>
        <div className="flex ml-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
    </div>
  );
} 