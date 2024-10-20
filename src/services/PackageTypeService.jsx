import axios from "axios";

class PackageTypeService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async createPackageType(data) {
    const response = await axios.post(`${this.BASE_URL}packageType/`, data);
    return response;
  }

  async updatePackageType(id, data) {
    const response = await axios.put(`${this.BASE_URL}packageType/${id}/`, data);
    return response;
  }

  async getPackageTypes(url = null){
    const apiUrl = url || `${this.BASE_URL}packageType/`;
    const response = await axios.get(apiUrl);
    return response;
  }

  async getPackageTypeById(id){
    const response = await axios.get(`${this.BASE_URL}packageType/${id}`);
    return response;
  }

  async getContainerCodes(){
    const response = await axios.get(`${this.BASE_URL}containerCode/`);
    return response;
  }

  async getContainerTypes(){
    const response = await axios.get(`${this.BASE_URL}containerType/`);
    return response;
  }

  async getContainerEquipTypes(){
    const response = await axios.get(`${this.BASE_URL}containerEquipType/`);
    return response;
  }

  async deletePackageType(id) {
      const response = await axios.delete(`${this.BASE_URL}packType/${id}/`);
      return response;
  }

  async search(query) {
    const response = await axios.get(`${this.BASE_URL}packageType/?search=${query}`);
    return response;
  }
}

export default new PackageTypeService();