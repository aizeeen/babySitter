import { useState } from 'react';
import { updateAvailability } from '../services/api';

export default function AvailabilityForm() {
  const [availability, setAvailability] = useState({
    disponibilite: true,
    schedule: [
      { day: 'Monday', startTime: '', endTime: '' },
      { day: 'Tuesday', startTime: '', endTime: '' },
      { day: 'Wednesday', startTime: '', endTime: '' },
      { day: 'Thursday', startTime: '', endTime: '' },
      { day: 'Friday', startTime: '', endTime: '' },
      { day: 'Saturday', startTime: '', endTime: '' },
      { day: 'Sunday', startTime: '', endTime: '' },
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateAvailability(availability);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="disponibilite"
          checked={availability.disponibilite}
          onChange={(e) => setAvailability(prev => ({
            ...prev,
            disponibilite: e.target.checked
          }))}
          className="h-4 w-4 text-primary-600 rounded"
        />
        <label htmlFor="disponibilite" className="ml-2 text-sm text-gray-700">
          Available for bookings
        </label>
      </div>

      <div className="space-y-4">
        {availability.schedule.map((slot, index) => (
          <div key={slot.day} className="grid grid-cols-3 gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">{slot.day}</span>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => {
                const newSchedule = [...availability.schedule];
                newSchedule[index].startTime = e.target.value;
                setAvailability(prev => ({ ...prev, schedule: newSchedule }));
              }}
              className="rounded-md border-gray-300"
            />
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => {
                const newSchedule = [...availability.schedule];
                newSchedule[index].endTime = e.target.value;
                setAvailability(prev => ({ ...prev, schedule: newSchedule }));
              }}
              className="rounded-md border-gray-300"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
      >
        {loading ? 'Updating...' : 'Update Availability'}
      </button>
    </form>
  );
} 