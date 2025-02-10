import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BabysitterList from './pages/BabysitterList';
import BabysitterProfile from './pages/BabysitterProfile';
import Reservations from './pages/Reservations';
import ParentDashboard from './pages/ParentDashboard';
import BabysitterDashboard from './pages/BabysitterDashboard';
import BabysitterAvailability from './pages/BabysitterAvailability';
import BabysitterReviews from './pages/BabysitterReviews';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "babysitters", element: <BabysitterList /> },
      { path: "babysitters/:id", element: <BabysitterProfile /> },
      { 
        path: "reservations", 
        element: <PrivateRoute><Reservations /></PrivateRoute> 
      },
      { 
        path: "parent-dashboard", 
        element: <PrivateRoute allowedRoles={['parent']}><ParentDashboard /></PrivateRoute> 
      },
      { 
        path: "babysitter-dashboard", 
        element: <PrivateRoute allowedRoles={['babysitter']}><BabysitterDashboard /></PrivateRoute> 
      },
      {
        path: "profile",
        element: <PrivateRoute><Profile /></PrivateRoute>
      },
      {
        path: "availability",
        element: <PrivateRoute allowedRoles={['babysitter']}><BabysitterAvailability /></PrivateRoute>
      },
      {
        path: "my-reviews",
        element: <PrivateRoute allowedRoles={['babysitter']}><BabysitterReviews /></PrivateRoute>
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
} 