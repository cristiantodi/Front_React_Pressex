import axios from "axios";

class WarehouseProviderService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createWarehouseProvider(data) {
    const response = await axios.post(`${this.BASE_URL}wareHouseProviders/`, data);
    return response;
  }

  async updateWarehouseProvider(id, data) {
    const response = await axios.put(`${this.BASE_URL}wareHouseProviders/${id}/`, data);
    return response;
  }

  async getWarehouseProviders(url = null){
    const apiUrl = url || `${this.BASE_URL}wareHouseProviders/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getWarehouseProviderByID(id){
    const response = await axios.get(`${this.BASE_URL}wareHouseProviders/${id}`);
    return response;
  }

  async deleteWarehouseProvider(id) {
      const response = await axios.delete(`${this.BASE_URL}wareHouseProviders/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}wareHouseProviders/?search=${query}`);
    return response;
  }
}

export default new WarehouseProviderService();