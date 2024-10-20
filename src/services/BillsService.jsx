import axios from "axios";

class BillsService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createBill(data) {
    const response = await axios.post(`${this.BASE_URL}Bills/`, data);
    return response;
  }

  async updateBill(id, data) {
    const response = await axios.put(`${this.BASE_URL}Bills/${id}/`, data);
    return response;
  }

  async getBills(url = null) {
    const apiUrl = url || `${this.BASE_URL}Bills/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getBillById(id) {
    const response = await axios.get(`${this.BASE_URL}Bills/${id}`);
    return response;
  }

  async deleteBill(id) {
    const response = await axios.delete(`${this.BASE_URL}Bills/${id}/`);
    return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}Bills/?search=${query}`);
    return response;
  }
}

export default new BillsService();
