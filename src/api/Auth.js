import axios from 'axios';
import config from '../utils/config';

const isProduction = config.NODE_ENV === 'production';

const baseUrl = isProduction ? 'https://cryptotrack-2021.herokuapp.com' : 'http://localhost:8000';

// User login
export async function login(username, password) {
  const response = await axios.post(`${baseUrl}/auth-api/login`, { username, password }, { withCredentials: true });
  return response;
}

// Register a new user
export async function register(username, password) {
  const response = await axios.post(`${baseUrl}/auth-api/register`, { username, password }, { withCredentials: true });
  return response;
}

// User logout
export async function logout() {
  const response = await axios.delete(`${baseUrl}/auth-api/logout`, { withCredentials: true });
  return response;
}

export default { login, register, logout };
