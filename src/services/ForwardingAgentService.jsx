import axios from "axios";

class ForwardingAgentService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async createForwardingAgent(data) {
        const response = await axios.post(`${this.BASE_URL}agent/`, data);
        return response;
      }
    
      async updateForwardingAgent(id, data) {
        const response = await axios.put(`${this.BASE_URL}agent/${id}/`, data);
        return response;
      }
    
      async getForwardingAgents(url = null){
        const apiUrl = url || `${this.BASE_URL}agent/`;
        const response = await axios.get(apiUrl);
        return response;
      }

      async getForwardingAgentById(id){
        const response = await axios.get(`${this.BASE_URL}agent/${id}`);
        return response;
      }
    
      async deleteForwardingAgent(id) {
          const response = await axios.delete(`${this.BASE_URL}agent/${id}/`);
          return response;
      }

      async search(query) {
        const response = await axios.get(`${this.BASE_URL}agent/?search=${query}`);
        return response;
      }
}
export default new ForwardingAgentService();