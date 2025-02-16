import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBabysitters } from '../services/api';
import SearchBabysitters from '../components/SearchBabysitters';
import UserAvatar from '../components/UserAvatar';
import { StarIcon } from '@heroicons/react/24/solid';

export default function BabysitterList() {
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        setLoading(true);
        const adresse = searchParams.get('adresse');
        console.log('Searching for address:', adresse);

        if (adresse && adresse.trim()) {
          setSearched(true);
          const response = await getBabysitters({ adresse: adresse.trim() });
          console.log('Babysitters data:', response.data.babysitters);
          
          // Filter babysitters to only show exact or close matches
          const searchTerm = adresse.trim().toLowerCase();
          const filteredBabysitters = response.data.babysitters.filter(babysitter => 
            babysitter.adresse.toLowerCase().includes(searchTerm)
          );
          
          setBabysitters(filteredBabysitters);
        } else {
          setSearched(false);
          const response = await getBabysitters({});
          setBabysitters(response.data.babysitters);
        }
      } catch (err) {
        console.error('Error in fetchBabysitters:', err);
        setError('Failed to fetch babysitters');
      } finally {
        setLoading(false);
      }
    };

    fetchBabysitters();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const showNoResults = searched && (!babysitters || babysitters.length === 0);
  const currentAddress = searchParams.get('adresse');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBabysitters />
      
      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {showNoResults ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 text-6xl mb-4">😕</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Babysitters Available
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Sorry, we couldn't find any babysitters in "{currentAddress}". 
              Please try searching for a different location or check back later.
            </p>
          </div>
        ) : (
          babysitters.map((babysitter) => (
            <div
              key={babysitter._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <UserAvatar user={babysitter} size="lg" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {babysitter.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {babysitter.rating?.toFixed(1) || 'No ratings'} ({babysitter.totalReviews || 0} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{babysitter.adresse}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Experience</span>
                    <span className="font-medium">{babysitter.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Rate</span>
                    <span className="font-medium">{babysitter.tarif} TND/hr</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/babysitters/${babysitter._id}`)}
                  className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 