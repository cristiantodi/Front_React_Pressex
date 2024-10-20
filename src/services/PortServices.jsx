import axios from "axios";

class PortService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPort(data) {
    const response = await axios.post(`${this.BASE_URL}port/`, data);
    return response;
  }

  async updatePort(id, data) {
    const response = await axios.put(`${this.BASE_URL}port/${id}/`, data);
    return response;
  }

  async getPorts(url = null){
    const apiUrl = url || `${this.BASE_URL}port/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPortById(id){
    const response = await axios.get(`${this.BASE_URL}port/${id}`);
    return response;
  }

  async deletePort(id) {
      const response = await axios.delete(`${this.BASE_URL}port/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}port/?search=${query}`);
    return response;
  }
}

export default new PortService();