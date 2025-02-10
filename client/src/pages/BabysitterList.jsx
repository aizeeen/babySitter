import { useState, useEffect } from 'react';
import { getBabysitters } from '../services/api';
import BabysitterCard from '../components/BabysitterCard';

export default function BabysitterList() {
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBabysitters();
  }, []);

  const fetchBabysitters = async () => {
    try {
      setLoading(true);
      const response = await getBabysitters();
      setBabysitters(response.data);
    } catch (err) {
      setError('Failed to fetch babysitters');
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Babysitters</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {babysitters.map((babysitter) => (
          <BabysitterCard key={babysitter._id} babysitter={babysitter} />
        ))}
      </div>
    </div>
  );
} 