import axios from "axios";

class CurrenciesService{
    constructor() {
        this.BASE_URL = import.meta.env.VITE_CURRENCIES_URL;
    }

    async getCurrencies(){
        const response= await  axios.get(`${this.BASE_URL}`);
        return response;
    }
}

export default new CurrenciesService();