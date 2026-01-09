import axios from 'axios';

const API_URL = '/api/users';

const getHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, getHeaders(token));
  return response.data;
};

export const updateUserProfile = async (userData: any, token: string) => {
  const response = await axios.put(`${API_URL}/profile`, userData, getHeaders(token));
  return response.data;
};
