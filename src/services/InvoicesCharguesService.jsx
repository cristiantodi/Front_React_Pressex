import axios from "axios";

class InvoicesCharguesService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createInvoiceCharge(data) {
    const response = await axios.post(`${this.BASE_URL}invoiceCharge/`, data);
    return respons
  }
 
  async updateInvoicesCharges(id, data) {
    const response = await axios.put(`${this.BASE_URL}invoiceCharge/${id}/`, data);
    return response;
  }

  async getInvoicesCharges(url = null) {
    const apiUrl = url || `${this.BASE_URL}invoiceCharge/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getInvoiceChargeById(id){
    const response = await axios.get(`${this.BASE_URL}invoiceCharge/${id}`);
    return response;
  }

  async deleteInvoiceCharge(id) {
      const response = await axios.delete(`${this.BASE_URL}invoiceCharge/${id}/`);
      return response;
  }
}

export default new InvoicesCharguesService();