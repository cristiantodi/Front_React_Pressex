import axios from "axios";

class ReceiptService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createReceipt(data) {
    const response = await axios.post(`${this.BASE_URL}receptionOrder/`, data);
    return response;
  }

  async updateReceipt(id, data) {
    const response = await axios.put(`${this.BASE_URL}receptionOrder/${id}/`, data);
    return response;
  }

  async getReceipts(url = null){
    const apiUrl = url || `${this.BASE_URL}receptionOrder/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getReceiptById(id){
    const response = await axios.get(`${this.BASE_URL}receptionOrder/${id}`);
    return response;
  }

  async deleteReceipt(id) {
      const response = await axios.delete(`${this.BASE_URL}receptionOrder/${id}/`);
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

  async createSupplier(data){
    const response = await axios.post(`${this.BASE_URL}supplier/`, data);
    return response;
  }

  async createClientToBill(data){
    const response = await axios.post(`${this.BASE_URL}clientToBill/`, data);
    return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}receptionOrder/?search=${query}`);
    return response;
  }
}

export default new ReceiptService();