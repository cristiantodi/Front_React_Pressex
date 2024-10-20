import axios from "axios";

class LocationService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createLocation(data) {
    const response = await axios.post(`${this.BASE_URL}location/`, data);
    return response;
  }

  async updateLocation(id, data) {
    const response = await axios.put(`${this.BASE_URL}location/${id}/`, data);
    return response;
  }

  async getLocations(url = null){
    const apiUrl = url || `${this.BASE_URL}location/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getLocationById(id){
    const response = await axios.get(`${this.BASE_URL}location/${id}`);
    return response;
  }

  async deleteLocation(id) {
      const response = await axios.delete(`${this.BASE_URL}location/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}location/?search=${query}`);
    return response;
  }
}

export default new LocationService();