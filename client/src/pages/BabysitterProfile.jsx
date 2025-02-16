import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getBabysitterById } from '../services/api';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import ReviewList from '../components/ReviewList';
import ReservationForm from '../components/ReservationForm';
import { useAuth } from '../context/AuthContext';

export default function BabysitterProfile() {
  const { id } = useParams();
  const [babysitter, setBabysitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Add debug logs
  console.log('Auth state:', { isAuthenticated, user });
  console.log('User role:', user?.role);

  // Add state for availability modal if needed
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  useEffect(() => {
    const fetchBabysitter = async () => {
      try {
        setLoading(true);
        const response = await getBabysitterById(id);
        setBabysitter(response.data);
      } catch (err) {
        console.error('Error fetching babysitter:', err);
        setError('Failed to load babysitter profile');
      } finally {
        setLoading(false);
      }
    };

    fetchBabysitter();
  }, [id]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!babysitter) {
    return <div>Babysitter not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Babysitter Info Section */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                  {babysitter.photo ? (
                    <img 
                      src={babysitter.photo} 
                      alt={babysitter.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-primary-600">
                      {babysitter.name[0]}
                    </span>
                  )}
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">{babysitter.name}</h1>
                  <div className="flex items-center mt-1">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">
                      {babysitter.rating?.toFixed(1) || 'No ratings yet'} ({babysitter.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Show Availability Button only if the logged-in user is this babysitter */}
              {isAuthenticated && user?.role === 'babysitter' && user?._id === babysitter._id && (
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Manage Availability
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                <p className="mt-1 text-lg text-gray-900">{babysitter.experience} years</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
                <p className="mt-1 text-lg text-gray-900">{babysitter.tarif} TND/hr</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">About</h3>
              <p className="mt-1 text-gray-900">{babysitter.bio}</p>
            </div>

            {babysitter.competances?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {babysitter.competances.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {babysitter.languages?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Languages</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {babysitter.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {babysitter.certifications?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Certifications</h3>
                <ul className="mt-2 divide-y divide-gray-200">
                  {babysitter.certifications.map((cert, index) => (
                    <li key={index} className="py-2">
                      <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-500">
                        {cert.issuer} • {new Date(cert.date).getFullYear()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <ReviewList 
              babysitterId={id} 
              canReview={isAuthenticated && user?.role === 'parent'} 
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-1">
          {console.log('Rendering conditions:', {
            isAuthenticated,
            userRole: user?.role,
            isBabysitter: user?._id === babysitter._id
          })}
          
          {isAuthenticated && user?.role === 'parent' ? (
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900">Book a Session</h2>
              <ReservationForm babysitter={babysitter} />
            </div>
          ) : isAuthenticated && user?.role === 'babysitter' && user?._id === babysitter._id ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Profile Stats</h2>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Reviews</span>
                  <span className="font-medium">{babysitter.totalReviews || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Average Rating</span>
                  <span className="font-medium">{babysitter.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </div>
          ) : isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-700">
                Only parents can book sessions with babysitters.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-700">
                Please <Link to="/login" className="font-medium underline">log in</Link> as a parent to book a session.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Availability Modal here if needed */}
        </div>
  );
} 