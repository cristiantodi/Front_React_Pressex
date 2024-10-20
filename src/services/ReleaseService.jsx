import axios from "axios";

class ReleaseService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createRelease(data) {
    const response = await axios.post(`${this.BASE_URL}releaseOrder/`, data);
    return response;
  }

  async updateRelease(id, data) {
    const response = await axios.put(`${this.BASE_URL}releaseOrder/${id}/`, data);
    return response;
  }

  async getReleases(url = null){
    const apiUrl = url || `${this.BASE_URL}releaseOrder/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getReleaseById(id){
    const response = await axios.get(`${this.BASE_URL}releaseOrder/${id}`);
    return response;
  }

  async deleteRelease(id) {
      const response = await axios.delete(`${this.BASE_URL}releaseOrder/${id}/`);
      return response;
  }

  async createConsignee(data){
    const response = await axios.post(`${this.BASE_URL}consignee/`, data);
    return response;
  }

  async createDeliveryLocation(data){
    const response = await axios.post(`${this.BASE_URL}deliveryLocation/`, data);
    return response;
  }

  async createPickUpLocation(data){
    const response = await axios.post(`${this.BASE_URL}pickUpLocation/`, data);
    return response;
  }

  async createShipper(data){
    const response = await axios.post(`${this.BASE_URL}shipper/`, data);
    return response;
  }

  async createClientToBill(data){
    const response = await axios.post(`${this.BASE_URL}clientToBill/`, data);
    return response;
  }

  async createReleasedTo(data){
    const response = await axios.post(`${this.BASE_URL}releasedTo/`, data);
    return response
  }
}

export default new ReleaseService();