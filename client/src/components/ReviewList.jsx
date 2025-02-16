import { useState, useEffect } from 'react';
import { getBabysitterReviews } from '../services/api';
import { StarIcon } from '@heroicons/react/20/solid';
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';

export default function ReviewList({ babysitterId, canReview }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getBabysitterReviews(babysitterId);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [babysitterId]);

  const handleReviewSubmitted = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Show review form only for authenticated parents */}
      {canReview && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <ReviewForm 
            babysitterId={babysitterId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <img
                    src={review.parent.photo || '/default-avatar.png'}
                    alt={review.parent.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-medium">{review.parent.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-4 text-gray-600">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 