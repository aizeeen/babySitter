import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';

export default function BabysitterCard({ babysitter }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            {babysitter.photo ? (
              <img 
                src={babysitter.photo} 
                alt={babysitter.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-primary-600">
                {babysitter.name[0]}
              </span>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{babysitter.name}</h3>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-600">
                {babysitter.rating || 0} ({babysitter.totalReviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500 line-clamp-2">{babysitter.bio}</p>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-primary-600">
              ${babysitter.tarif}/hr
            </span>
            <span className="text-sm text-gray-500">
              {babysitter.experience} years exp.
            </span>
          </div>

          {babysitter.competances?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {babysitter.competances.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <Link
            to={`/babysitters/${babysitter._id}`}
            className="mt-4 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 