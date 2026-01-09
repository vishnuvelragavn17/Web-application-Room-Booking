import axios from 'axios';

const API_URL = '/api/bookings';

const getHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getAvailability = async (date: string) => {
  const response = await axios.get(`${API_URL}/availability?date=${date}`);
  return response.data;
};

export const createBooking = async (bookingData: any, token: string) => {
  const response = await axios.post(API_URL, bookingData, getHeaders(token));
  return response.data;
};

export const getMyBookings = async (token: string) => {
  const response = await axios.get(`${API_URL}/my`, getHeaders(token));
  return response.data;
};

export const cancelBooking = async (id: string, token: string) => {
  const response = await axios.put(`${API_URL}/${id}/cancel`, {}, getHeaders(token));
  return response.data;
};

export const postponeBooking = async (id: string, data: any, token: string) => {
  const response = await axios.put(`${API_URL}/${id}/postpone`, data, getHeaders(token));
  return response.data;
};
