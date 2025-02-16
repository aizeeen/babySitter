import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    loading: true
  });

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('Initializing auth with user:', parsedUser);
          setState(prevState => ({ ...prevState, user: parsedUser }));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setState(prevState => ({ ...prevState, loading: false }));
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Add debug log
    console.log('Current auth state:', state);
  }, [state]);

  const signIn = async (credentials) => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      console.log('AuthContext: Attempting login with:', credentials.email);
      
      const response = await login(credentials);
      console.log('AuthContext: Login response:', response);
      
      if (!response.success || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setState(prevState => ({ ...prevState, user: response.user, loading: false }));
      return response;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setState(prevState => ({ ...prevState, loading: false }));
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      const response = await register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setState(prevState => ({ ...prevState, user: response.user, loading: false }));
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setState(prevState => ({ ...prevState, loading: false }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setState(prevState => ({ ...prevState, user: null }));
    }
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user: state.user, 
      loading: state.loading,
      isAuthenticated: !!state.user,
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 