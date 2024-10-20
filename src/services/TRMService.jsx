import axios from "axios";

class TRMService{
  constructor(){
    this.BASE_URL = import.meta.env.VITE_TRM_URL;
  }

  async getTRMToday() {
    const response = await axios.get(`${this.BASE_URL}32sa-8pi3.json?$query=select *, :id order by 'vigenciadesde' desc limit 1`);
    return response;
  }
}

export default new TRMService();