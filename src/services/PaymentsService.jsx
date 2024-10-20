import axios from "axios";

class PaymentsService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPayment(data) {
    const response = await axios.post(`${this.BASE_URL}Payments/`, data);
    return response;
  }

  async updatePayment(id, data) {
    const response = await axios.put( `${this.BASE_URL}Payments/${id}/`, data);
    return response;
  }

  async getPayments(url = null) {
    const apiUrl = url || `${this.BASE_URL}Payments/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPaymentById(id) {
    const response = await axios.get(`${this.BASE_URL}Payments/${id}`);
    return response;
  }

  async deletePayment(id) {
    const response = await axios.delete(`${this.BASE_URL}Payments/${id}/`);
    return response;
  }
}

export default new PaymentsService();
