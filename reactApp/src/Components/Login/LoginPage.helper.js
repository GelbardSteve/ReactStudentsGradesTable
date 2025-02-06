import axios from 'axios';

const API_BASE_URL = 'https://node-4-pdlj.onrender.com';

export const authenticateUser = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  return response.data;
};

export const authenticateStudent = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/students2/${data.studentNumber}`, data);
  return response.data;
};

export const verifyAuthentication = async (authToken, url) => {
  const response = await axios.post(`${API_BASE_URL}/${url}/authentication`, {
    authentication: authToken,
  });
  return response.data;
};
