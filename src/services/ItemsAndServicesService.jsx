import axios from "axios";

class ItemsAndServicesService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createItemAndService(data) {
    const response = await axios.post(`${this.BASE_URL}ItemServices/`, data);
    return response;
  }
  
  async updateItemsAndServices(id, data) {
    const response = await axios.put(`${this.BASE_URL}ItemServices/${id}/`, data);
    return response;
  }

  async getItemsAndServices(url = null) {
    const apiUrl = url || `${this.BASE_URL}ItemServices/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getItemAndServiceById(id){
    const response = await axios.get(`${this.BASE_URL}ItemServices/${id}`);
    return response;
  }

  async deleteItemAndService(id) {
      const response = await axios.delete(`${this.BASE_URL}ItemServices/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}ItemServices/?search=${query}`);
    return response;
  }
}
export default new ItemsAndServicesService();