import axios from 'axios';

const API_URL = '/api/admin';

const getHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getAllBookings = async (token: string) => {
  const response = await axios.get(`${API_URL}/bookings`, getHeaders(token));
  return response.data;
};

export const cancelBookingAdmin = async (id: string, token: string) => {
  const response = await axios.put(`${API_URL}/bookings/${id}/cancel`, {}, getHeaders(token));
  return response.data;
};

export const blockDate = async (date: string, reason: string, token: string) => {
  const response = await axios.post(`${API_URL}/block-date`, { date, reason }, getHeaders(token));
  return response.data;
};
