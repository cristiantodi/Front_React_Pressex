import axios from "axios";

class LocationService{
    constructor(){
        this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
    }

    async getHazardousMaterialsTypes(url = null){
        const apiUrl = url || `${this.BASE_URL}hazardousMaterials/`;
        const response = await axios.get(apiUrl);
        return response;
    }

    async getHazardousMaterialTypeById(id){
        const response = await axios.get(`${this.BASE_URL}hazardousMaterials/${id}`);
        return response;
    }

    async search(query) {
        const response = await axios.get(`${this.BASE_URL}hazardousMaterials/?search=${query}`);
        return response;
    }
}

export default new LocationService();