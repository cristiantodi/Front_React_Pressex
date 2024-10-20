import axios from "axios";

class PreAlertService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPreAlert(data) {
    const response = await axios.post(`${this.BASE_URL}prealert/`, data);
    return response;
  }

  async updatePreAlert(id, data) {
    const response = await axios.put(`${this.BASE_URL}prealert/${id}/`, data);
    return response;
  }

  async getPreAlerts(url = null){
    const apiUrl = url || `${this.BASE_URL}prealert/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPreAlertById(id){
    const response = await axios.get(`${this.BASE_URL}prealert/${id}`);
    return response;
  }

  async deletePreAlert(id) {
      const response = await axios.delete(`${this.BASE_URL}prealert/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}prealert/?search=${query}`);
    return response;
  }
}

export default new PreAlertService();