import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBabysitterReviews } from '../services/api';
import { StarIcon } from '@heroicons/react/20/solid';

export default function BabysitterReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getBabysitterReviews(user._id);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            My Reviews
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            All reviews from parents
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="border-t border-gray-200">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <li key={review._id} className="p-4 sm:p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                        {review.parent?.name?.[0] || '?'}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.parent?.name || 'Anonymous Parent'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                        {review.comment}
                      </p>
                      {review.reservation && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            Reservation date:{' '}
                            {new Date(review.reservation.date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stats Summary */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Reviews
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {reviews.length}
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Average Rating
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {reviews.length > 0
                  ? (
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : '0.0'}
              </dd>
            </div>
            <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                5 Star Reviews
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {reviews.filter(review => review.rating === 5).length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 