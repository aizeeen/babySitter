import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReservation } from '../services/api';
import Button from './ui/Button';

export default function ReservationForm({ babysitter }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 1,
    description: '',
    totale: 0
  });

  // Calculate total cost when duration changes
  useEffect(() => {
    if (babysitter?.tarif) {
      const total = babysitter.tarif * formData.duration;
      setFormData(prev => ({ ...prev, totale: total }));
    }
  }, [formData.duration, babysitter?.tarif]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const reservationData = {
        babysitterId: babysitter._id,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        description: formData.description,
        totale: formData.totale
      };

      await createReservation(reservationData);
      navigate('/reservations');
    } catch (err) {
      console.error('Reservation error:', err);
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          min={minDate}
          required
          value={formData.date}
          onChange={handleChange}
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
        <input
          type="number"
          name="duration"
          min="1"
          max="12"
          required
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows="3"
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe your needs..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Total Cost:</span>
          <span className="text-lg font-semibold text-primary-600">
            ${formData.totale.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          ${babysitter.tarif} per hour × {formData.duration} hours
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating Reservation...' : 'Book Now'}
      </Button>

      {!user && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Please <a href="/login" className="text-primary-600 hover:text-primary-500">login</a> to make a reservation
        </p>
      )}
    </form>
  );
} 