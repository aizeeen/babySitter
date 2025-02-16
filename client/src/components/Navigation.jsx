import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  // Navigation items based on user role
  const parentNavItems = [
    { name: 'Home', href: '/parent-dashboard', icon: HomeIcon },
    { name: 'Find Babysitters', href: '/babysitters', icon: UserGroupIcon },
    { name: 'My Reservations', href: '/reservations', icon: CalendarIcon },
  ];

  const babysitterNavItems = [
    { name: 'Dashboard', href: '/babysitter-dashboard', icon: HomeIcon },
    { name: 'Reservations', href: '/reservations', icon: ClockIcon },
    // Removed the Reviews link
  ];

  const navItems = user?.role === 'parent' ? parentNavItems : babysitterNavItems;

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${
            location.pathname === item.href
              ? 'bg-primary-100 text-primary-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
        >
          <item.icon
            className={`${
              location.pathname === item.href
                ? 'text-primary-500'
                : 'text-gray-400 group-hover:text-gray-500'
            } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
          />
          <span className="truncate">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
} 