import axios from 'axios';

const API_URL = '/api/auth';

export const requestOTP = async (mobile: string) => {
  const response = await axios.post(`${API_URL}/request-otp`, { mobile });
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: { mobile: string, dob: string }) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
