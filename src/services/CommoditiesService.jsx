import axios from "axios";

class CommoditiesService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createCommodity(data) {
    const response = await axios.post(`${this.BASE_URL}pieces/`, data);
    return response;
  }

  async updateCommodity(id, data) {
    const response = await axios.put(`${this.BASE_URL}pieces/${id}/`, data);
    return response;
  }

  async getCommodities(url = null){
    const apiUrl = url || `${this.BASE_URL}pieces/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getCommodityById(id){
    const response = await axios.get(`${this.BASE_URL}pieces/${id}`);
    return response;
  }

  async deleteCommodity(id) {
      const response = await axios.delete(`${this.BASE_URL}pieces/${id}/`);
      return response;
  }
}

export default new CommoditiesService();