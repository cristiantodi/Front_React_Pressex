import axios from "axios";

class ChartOfAccountsService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createChartOfAccounts(data) {
    const response = await axios.post(`${this.BASE_URL}ChartAccounts/`, data);
    return response;
  }

  async updateChartOfAccounts(id, data) {
    const response = await axios.put(`${this.BASE_URL}ChartAccounts/${id}/`, data);
    return response;
  }

  async getChartOfAccounts(url = null) {
    const apiUrl = url || `${this.BASE_URL}ChartAccounts/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getChartOfAccountsId(id) {
    const response = await axios.get(`${this.BASE_URL}ChartAccounts/${id}`);
    return response;
  }

  async deleteChartOfAccounts(id) {
    const response = await axios.delete(`${this.BASE_URL}ChartAccounts/${id}/`);
    return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}ChartAccounts/?search=${query}`);
    return response;
  }
}
export default new ChartOfAccountsService();
