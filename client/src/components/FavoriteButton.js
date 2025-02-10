import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { addToFavorites } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FavoriteButton({ babysitterId, initialIsFavorite = false }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user) {
      // Handle not logged in state
      return;
    }

    try {
      setLoading(true);
      await addToFavorites(babysitterId);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'parent') return null;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
    >
      {isFavorite ? (
        <HeartSolidIcon className="h-6 w-6 text-red-500" />
      ) : (
        <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
      )}
    </button>
  );
} 