import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { user, signOut } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    if (!user) {
      // Public navigation
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Babysitter', href: '/babysitters' }
      ];
    }

    if (user.role === 'parent') {
      // Parent navigation
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Babysitter', href: '/babysitters' },
        { name: 'My Reservations', href: '/reservations' },
        { name: 'Dashboard', href: '/parent-dashboard' }
      ];
    }

    if (user.role === 'babysitter') {
      // Babysitter navigation
      return [
        { name: 'Home', href: '/' },
        { name: 'My Reservations', href: '/reservations' },
        { name: 'My Profile', href: '/profile' },
        { name: 'Availability', href: '/availability' },
        { name: 'My Reviews', href: '/my-reviews' },
        { name: 'Dashboard', href: '/babysitter-dashboard' }
      ];
    }

    // Default case, should not happen
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-primary-600">
                    BabySitter
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">
                      Welcome, {user.name}
                    </span>
                    <button
                      onClick={signOut}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigationItems.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user ? (
                <Disclosure.Button
                  as="button"
                  onClick={signOut}
                  className="block w-full text-left py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  Logout
                </Disclosure.Button>
              ) : (
                <>
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    Register
                  </Disclosure.Button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
} 