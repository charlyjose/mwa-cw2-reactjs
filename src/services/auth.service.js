import axios from "axios";
const BE_IP = require('../config/env.json').backend.ip
const BE_PORT = require('../config/env.json').backend.port

const API_URL = `${BE_IP}:${BE_PORT}/auth/`;

class AuthService {
  async login(username, password) {
    return await axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          // set access token to cookie and specify maxAge
          document.cookie = `accessToken=${response.data.accessToken}; maxAge=${60 * 60 * 24 * 7}`;
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    // force remove cookie
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  async register(username, email, password, name, address, dob, sni) {
    return await axios.post(API_URL + "signup", {
      username,
      email,
      password,
      name,
      address,
      dob,
      sni
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
