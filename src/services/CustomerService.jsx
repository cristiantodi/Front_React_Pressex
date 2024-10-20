import axios from "axios";

class CustomerService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async getCustomers(url = null) {
        const apiUrl = url || `${this.BASE_URL}customer/`;
        const response = await axios.get(apiUrl);
        return response;
      }

    async getCustomerById(id){
        const response = await axios.get(`${this.BASE_URL}customer/${id}`)
        return response;
    }

    async createCustomer(data){
        const response = await axios.post(`${this.BASE_URL}customer/`, data);
    return response;
    }

    async updateCustomer(id,data){
        const response = await axios.put(`${this.BASE_URL}customer/${id}/`, data);
    return response;
    }

    async deleteCustomer(id){
        const response = await axios.delete(`${this.BASE_URL}customer/${id}/`);
      return response;
    }

    async search(query) {
        const response = await axios.get(`${this.BASE_URL}customer/?search=${query}`);
        return response;
      }
}

export default new CustomerService();