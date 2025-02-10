import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find the Perfect Babysitter for Your Family
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Connect with experienced and trusted babysitters in your area. 
              Book with confidence and peace of mind.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/babysitters"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Browse Babysitters <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'parent' ? '/babysitters' : '/babysitter-dashboard'}
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  {user.role === 'parent' ? 'Find a Babysitter' : 'View Dashboard'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for childcare
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
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