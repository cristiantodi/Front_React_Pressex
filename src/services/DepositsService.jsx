import axios from "axios";

class DepositsService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createDeposit(data) {
    const response = await axios.post(`${this.BASE_URL}Deposits/`, data);
    return response;
  }

  async updateDeposits(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}Deposits/${id}/`,
      data
    );
    return response;
  }

  async getDeposits(url = null) {
    const apiUrl = url || `${this.BASE_URL}Deposits/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getDepositById(id) {
    const response = await axios.get(`${this.BASE_URL}Deposits/${id}`);
    return response;
  }

  async deleteDeposit(id) {
    const response = await axios.delete(`${this.BASE_URL}Deposits/${id}/`);
    return response;
  }
}

export default new DepositsService();
