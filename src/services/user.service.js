import axios from 'axios';
import authHeader from './auth-header';
const BE_IP = require('../config/env.json').backend.ip
const BE_PORT = require('../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/`;

class UserService {
  async getPublicContent() {
    return await axios.get(API_URL + 'all');
  }

  async getUserBoard() {
    return await axios.get(API_URL + 'user', { headers: authHeader() });
  }

  async getModeratorBoard() {
    return await axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  async getAdminBoard() {
    return await axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();
