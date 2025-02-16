import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const getNavigationItems = () => {
    if (!user) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Babysitter', href: '/babysitters' }
      ];
    }

    if (user.role === 'parent') {
      return [
        { name: 'Home', href: '/' },
        { name: 'Find Babysitter', href: '/babysitters' },
        { name: 'My Reservations', href: '/reservations' },
        { name: 'Dashboard', href: '/parent-dashboard' }
      ];
    }

    return [
      { name: 'Home', href: '/' },
      { name: 'My Reservations', href: '/reservations' },
      { name: 'My Profile', href: '/profile' },
      { name: 'Dashboard', href: '/babysitter-dashboard' }
    ];
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">BabySitter</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {getNavigationItems().map(item => (
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

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
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
    </nav>
  );
} 