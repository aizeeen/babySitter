import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBabysitterById } from '../services/api';
import { StarIcon } from '@heroicons/react/20/solid';
import ReservationForm from '../components/ReservationForm';
import ReviewList from '../components/ReviewList';

export default function BabysitterProfile() {
  const { id } = useParams();
  const [babysitter, setBabysitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBabysitterDetails();
  }, [id]);

  const fetchBabysitterDetails = async () => {
    try {
      setLoading(true);
      const response = await getBabysitterById(id);
      setBabysitter(response.data);
    } catch (err) {
      setError('Failed to fetch babysitter details');
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

  if (error || !babysitter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          {error || 'Babysitter not found'}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
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
                    {babysitter.rating || 0} ({babysitter.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                <p className="mt-1 text-lg text-gray-900">{babysitter.experience} years</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
                <p className="mt-1 text-lg text-gray-900">${babysitter.tarif}/hr</p>
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
            <ReviewList babysitterId={id} />
          </div>
        </div>

        {/* Reservation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900">Book a Session</h2>
            <ReservationForm babysitter={babysitter} />
          </div>
        </div>
      </div>
    </div>
  );
} 