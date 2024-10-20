import axios from "axios";

class CarrierService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createCarrier(data) {
    const response = await axios.post(`${this.BASE_URL}carrier/`, data);
    return response;
  }

  async updateCarrier(id, data) {
    const response = await axios.put(`${this.BASE_URL}carrier/${id}/`, data);
    return response;
  }

  async getCarriers(url = null) {
    const apiUrl = url || `${this.BASE_URL}carrier/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getCarrierById(id){
    const response = await axios.get(`${this.BASE_URL}carrier/${id}`);
    return response;
  }

  async deleteCarrier(id) {
      const response = await axios.delete(`${this.BASE_URL}carrier/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}carrier/?search=${query}`);
    return response;
  }
}

export default new CarrierService();