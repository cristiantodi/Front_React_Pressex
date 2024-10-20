import axios from "axios";

class CountriesService{
  constructor(){
    this.apiKey = import.meta.env.VITE_COUNTRIES_API_KEY;
    this.countriesUrl = import.meta.env.VITE_COUNTRIES_API_URL;
  }

  async fetchCountries(){
    const headers = {
      "X-CSCAPI-KEY": this.apiKey,
    };
    const response = await axios.get(this.countriesUrl, { headers });
    return response;
  }

  async fetchStates(selectedCountry){
    const headers = {
      "X-CSCAPI-KEY": this.apiKey,
    };
    const response = await axios.get(`${this.countriesUrl}${selectedCountry}/states`, { headers });
    return response;
  }

  async fetchCities(selectedCountry, selectedState){
    const headers = {
      "X-CSCAPI-KEY": this.apiKey,
    };
    const response = await axios.get(`${this.countriesUrl}${selectedCountry}/states/${selectedState}/cities`, { headers });
    return response;
  }

}


export default new CountriesService();
