import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../services/api';

export default function ReservationForm({ babysitter }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 1,
    description: ''
  });

  // Calculate total cost based on duration and babysitter's rate
  const calculateTotal = (hours) => {
    return (babysitter.tarif * hours).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Recalculate total when duration changes
      if (name === 'duration') {
        newData.totale = calculateTotal(value);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const reservationData = {
        ...formData,
        babysitter: babysitter._id,
        duration: parseInt(formData.duration),
        totale: parseFloat(calculateTotal(formData.duration))
      };

      console.log('Sending reservation data:', reservationData);

      const response = await createReservation(reservationData);
      
      if (response.success) {
        navigate('/reservations');
      } else {
        throw new Error(response.message || 'Failed to create reservation');
      }
    } catch (err) {
      console.error('Reservation error:', err);
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <input
          type="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
        <select
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'hour' : 'hours'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Any special requirements or notes..."
        />
      </div>

      {/* Display calculated total */}
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Rate per hour:</span>
          <span className="font-medium">{babysitter.tarif} TND</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-500">Hours:</span>
          <span className="font-medium">{formData.duration}</span>
        </div>
        <div className="flex justify-between items-center mt-2 text-lg font-semibold">
          <span className="text-gray-900">Total:</span>
          <span className="text-primary-600">{calculateTotal(formData.duration)} TND</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
} 