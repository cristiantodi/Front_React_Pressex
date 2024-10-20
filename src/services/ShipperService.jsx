import axios from "axios";

class ShipperService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createShipper(data) {
    const response = await axios.post(`${this.BASE_URL}shipper/`, data);
    return response;
  }

  async updateShipper(id, data) {
    const response = await axios.put(`${this.BASE_URL}shipper/${id}/`, data);
    return response;
  }

  async getShippers(url = null){
    const apiUrl = url || `${this.BASE_URL}shipper/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getShipperById(id){
    const response = await axios.get(`${this.BASE_URL}shipper/${id}`);
    return response;
  }

  async deleteShipper(id) {
      const response = await axios.delete(`${this.BASE_URL}shipper/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}shipper/?search=${query}`);
    return response;
  }
}

export default new ShipperService();