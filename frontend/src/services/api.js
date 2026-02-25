import axios from 'axios';

// Use environment variable or fallback to production backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://homeproweb-production.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Category endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Provider endpoints
export const providerAPI = {
  getAll: (categoryId) => api.get('/providers', { params: { category_id: categoryId } }),
  getById: (id) => api.get(`/providers/${id}`),
  getAvailability: (id, date) => api.get(`/providers/${id}/availability`, { params: { date } }),
};

// Booking endpoints
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (status) => api.get('/bookings', { params: { status } }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { cancellation_reason: reason }),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (data) => api.post('/user/addresses', data),
  updateAddress: (id, data) => api.put(`/user/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
};
// Payment endpoints
export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
};
export default api;
