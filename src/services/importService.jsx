import axios from "axios";

class ImportService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async importData(data, object) {
    const response = await axios.post(`${this.BASE_URL}${object}/`, data);
    return response;
  }

}

export default new ImportService();