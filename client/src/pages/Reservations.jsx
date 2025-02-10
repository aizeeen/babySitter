import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReservations, updateReservationStatus } from '../services/api';
import { format } from 'date-fns';

export default function Reservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await getReservations();
      setReservations(response.data);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      // Refresh reservations after update
      fetchReservations();
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No reservations found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <li key={reservation._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.role === 'parent' ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={reservation.babysitter?.photo || 'default-avatar.png'}
                            alt={reservation.babysitter?.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                              {reservation.parent?.name?.[0] || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.role === 'parent'
                            ? `Babysitter: ${reservation.babysitter?.name}`
                            : `Parent: ${reservation.parent?.name}`}
                        </h3>
                        <div className="text-sm text-gray-500">
                          <p>Date: {format(new Date(reservation.date), 'PPP')}</p>
                          <p>Time: {reservation.time}</p>
                          <p>Duration: {reservation.duration} hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                      <span className="mt-1 text-sm font-medium text-gray-900">
                        ${reservation.totale}
                      </span>
                    </div>
                  </div>

                  {user.role === 'babysitter' && reservation.status === 'pending' && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                        className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {reservation.description && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{reservation.description}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 