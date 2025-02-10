import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Add request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Babysitters
export const getBabysitters = async (filters) => {
  try {
    const response = await api.get('/babysitters', { params: filters });
    // Ensure we're returning an array even if the response structure varies
    if (response.data?.data?.babysitters) {
      return { data: response.data.data.babysitters };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      console.warn('Unexpected response structure:', response.data);
      return { data: [] };
    }
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};

export const getBabysitterById = async (id) => {
  try {
    const response = await api.get(`/babysitters/${id}`);
    return response.data?.data ? response.data : { data: response.data };
  } catch (error) {
    console.error('Error fetching babysitter details:', error);
    throw error;
  }
};

// Reservations
export const createReservation = async (data) => {
  try {
    console.log('Creating reservation with data:', data);
    const response = await api.post('/reservations', {
      ...data,
      date: new Date(data.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: data.time,
      duration: parseInt(data.duration)
    });
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const getReservations = () => api.get('/reservations');
export const updateReservationStatus = (id, status) => 
  api.patch(`/reservations/${id}/status`, { status });

// Reviews
export const createReview = (data) => api.post('/reviews', data);
export const getBabysitterReviews = (babysitterId) => 
  api.get(`/reviews/babysitter/${babysitterId}`);

// Auth endpoints
export const login = async (data) => {
  console.log('Making login request with data:', data); // Debug log
  try {
    const response = await api.post('/auth/login', data);
    console.log('Login API response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Login API error:', error); // Debug log
    throw error;
  }
};

export const register = async (data) => {
  console.log('Making registration request with data:', data); // Debug log
  try {
    const response = await api.post('/auth/signup', data);
    console.log('Registration API response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Registration API error:', error); // Debug log
    throw error;
  }
};

export const logout = () => api.post('/auth/logout');

// Add these new endpoints to your existing api.js
export const searchBabysitters = (params) => api.get('/search/babysitters', { params });

export const updateProfile = (data) => api.put('/profile', data);
export const getProfile = () => api.get('/profile');

export const addToFavorites = (babysitterId) => api.post(`/parents/favorites/${babysitterId}`);
export const getFavorites = () => api.get('/parents/favorites');

export const updateAvailability = (data) => api.put('/babysitters/availability', data);

export default api; 