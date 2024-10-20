import axios from "axios";

class AuthService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async login(username, password) {
    const response = await axios.post(`${this.BASE_URL}auth/login/`, {
      username,
      password,
    });
    return response;
  }
}

export default new AuthService();
