import axios from "axios";

class ConsigneeService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createConsignee(data) {
    const response = await axios.post(`${this.BASE_URL}consignee/`, data);
    return response;
  }

  async updateConsignee(id, data) {
    const response = await axios.put(`${this.BASE_URL}consignee/${id}/`, data);
    return response;
  }

  async getConsignees(url = null){
    const apiUrl = url || `${this.BASE_URL}consignee/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getConsigneeById(id){
    const response = await axios.get(`${this.BASE_URL}consignee/${id}`);
    return response;
  }

  async deleteConsignee(id) {
      const response = await axios.delete(`${this.BASE_URL}consignee/${id}/`);
      return response;
  }
}

export default new ConsigneeService();