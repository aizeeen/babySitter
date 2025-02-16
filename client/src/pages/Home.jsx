import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      <div className="relative">
        {/* Hero section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Find the perfect
                <span className="text-primary-600"> babysitter</span>
                <br />
                for your family
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Connect with experienced and trusted babysitters in your area. Book easily and securely through our platform.
              </p>
              <div className="mt-8 flex gap-4">
                {!user && (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                  </>
                )}
                {user && (
                  <Link
                    to={user.role === 'parent' ? '/babysitters' : '/babysitter-dashboard'}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/homepic.jpg"
                alt="Babysitter playing with children"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* Features section */}
          <div className="mt-24 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <div className="text-lg font-medium text-primary-600 mb-2">
                Verified Babysitters
              </div>
              <p className="text-base text-gray-500">
                All our babysitters go through a thorough verification process to ensure your family's safety.
              </p>
            </div>
            <div className="relative">
              <div className="text-lg font-medium text-primary-600 mb-2">
                Easy Booking
              </div>
              <p className="text-base text-gray-500">
                Book a babysitter in minutes with our simple and secure booking system.
              </p>
            </div>
            <div className="relative">
              <div className="text-lg font-medium text-primary-600 mb-2">
                Flexible Schedule
              </div>
              <p className="text-base text-gray-500">
                Find babysitters available when you need them, whether it's regular care or last-minute help.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Verified Babysitters',
    description: 'All our babysitters undergo thorough background checks and verification processes.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Flexible Booking',
    description: 'Book a babysitter for any duration, any time of the day or night.',
    icon: CalendarIcon,
  },
  {
    name: 'Secure Payments',
    description: 'Safe and secure payment processing for all bookings.',
    icon: CreditCardIcon,
  },
];

// Import these icons from heroicons or any other icon library
import { ShieldCheckIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline'; 