import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, config.data);
    const token = localStorage.getItem('token');
    console.log('Token in request:', token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Babysitters
export const getBabysitters = async (params) => {
  try {
    console.log('Searching with params:', params);
    const response = await api.get('/babysitters', { params });
    console.log('Response from server:', response.data);
    console.log('Extracted babysitters:', response.data.data.babysitters.length);
    return response.data;
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    throw error;
  }
};

export const getBabysitterById = async (id) => {
  try {
    console.log('Fetching babysitter details for ID:', id);
    const response = await api.get(`/babysitters/${id}`);
    console.log('Babysitter response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching babysitter:', error);
    throw error;
  }
};

// Reservations
export const createReservation = async (reservationData) => {
  try {
    console.log('Sending reservation request:', reservationData);
    const response = await api.post('/reservations', reservationData);
    console.log('Reservation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error.response || error);
    throw error;
  }
};

export const getReservations = async () => {
  try {
    const response = await api.get('/reservations');
    // Ensure we're returning an object with a reservations array
    return {
      data: {
        reservations: response.data?.reservations || response.data || []
      }
    };
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);

// Reviews
export const getBabysitterReviews = async (babysitterId) => {
  try {
    console.log('Fetching reviews for:', babysitterId);
    const response = await api.get(`/reviews/babysitter/${babysitterId}`);
    console.log('Reviews response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error.response?.data || error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    console.log('Creating review:', reviewData);
    const response = await api.post(`/reviews/${reviewData.babysitterId}`, {
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    console.log('Review response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error.response?.data || error);
    throw error;
  }
};

// Auth endpoints
export const login = async (credentials) => {
  try {
    console.log('API: Sending login request with:', credentials.email);
    const response = await api.post('/auth/login', credentials);
    console.log('API: Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Login error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Making registration request with data:', userData);
    const response = await api.post('/auth/signup', userData);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
};

// Favorites
export const getFavorites = async () => {
  try {
    const response = await api.get('/parents/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

export const addToFavorites = (babysitterId) => api.post(`/parents/favorites/${babysitterId}`);
export const removeFromFavorites = (babysitterId) => api.delete(`/parents/favorites/${babysitterId}`);

// Profile
export const updateProfile = (data) => api.put('/profile', data);
export const getProfile = () => api.get('/profile');

// Availability
export const updateAvailability = (data) => api.put('/babysitters/availability', data);
export const getBabysitterAvailability = (babysitterId) => api.get(`/babysitters/${babysitterId}/availability`);

// Search
export const searchBabysitters = (params) => api.get('/search/babysitters', { params });

export const getParentDashboard = async () => {
  try {
    console.log('Fetching parent dashboard data...');
    const response = await api.get('/parents/dashboard');
    console.log('Dashboard response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent dashboard:', error.response?.data || error);
    throw error;
  }
};

export const getBabysitterDashboard = async () => {
  try {
    const response = await api.get('/babysitters/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching babysitter dashboard:', error);
    throw error;
  }
};

export default api; 