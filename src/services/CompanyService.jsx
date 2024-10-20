import axios from "axios";

class CompanyService {
  constructor() {
    this.BASE_URL = import.meta.env.VITE_BASE_API_URL;
  }

  async getCompanyType() {
    const response = await axios.get(`${this.BASE_URL}companyType/`);
    return response;
  }

  async createCompanyType(data) {
    const response = await axios.post(`${this.BASE_URL}companyType/`, data);
    return response;
  }

  async updateCompanyType(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}companyType/${id}/`,
      data
    );
    return response;
  }

  async deleteCompanyType() {
    const response = await axios.delete(`${this.BASE_URL}companyType/1/`);
    return response;
  }

  async createCompanyInfo(data) {
    const response = await axios.post(`${this.BASE_URL}companyInfo/`, data);
    return response;
  }

  async getCompanyInfo() {
    const response = await axios.get(`${this.BASE_URL}companyInfo/`);
    return response;
  }

  async updateCompanyInfo(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}companyInfo/${id}/`,
      data
    );
    return response;
  }

  async deleteCompanyInfo() {
    const response = await axios.delete(`${this.BASE_URL}companyInfo/1/`);
    return response;
  }

  async getAddress() {
    const response = await axios.get(`${this.BASE_URL}addressInfo/`);
    return response;
  }

  async createAddress(data) {
    const response = await axios.post(`${this.BASE_URL}addressInfo/`, data);
    return response;
  }

  async updateCompanyAddress(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}addressInfo/${id}/`,
      data
    );
    return response;
  }

  async deleteAddress() {
    const response = await axios.delete(`${this.BASE_URL}addressInfo/1/`);
    return response;
  }

  async createCompanyLogo(data) {
    const response = await axios.post(`${this.BASE_URL}companyLogo/`, data);
    return response;
  }

  async updateCompanyLogo(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}companyLogo/${id}/`,
      data
    );
    return response;
  }

  async getCompanyLogo() {
    const response = await axios.get(`${this.BASE_URL}companyLogo/`);
    return response;
  }

  async deleteCompanyLogo() {
    const response = await axios.delete(`${this.BASE_URL}companyLogo/1/`);
    return response;
  }

  async createCompanyRegistrationCodes(data) {
    const response = await axios.post(
      `${this.BASE_URL}companyRegisCode/1/`,
      data
    );
    return response;
  }

  async getCompanyRegistrationCodes() {
    const response = await axios.get(`${this.BASE_URL}companyRegisCode/`);
    return response;
  }

  async updateCompanyRegistrationCodes(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}companyRegisCode/${id}/`,
      data
    );
    return response;
  }

  async deleteCompanyRegistrationCodes() {
    const response = await axios.delete(`${this.BASE_URL}companyRegisCode/1/`);
    return response;
  }

  async getCompanySystemCurrency() {
    const response = await axios.get(`${this.BASE_URL}systCurren/`);
    return response;
  }

  async createCompanySystemCurrency(data) {
    const response = await axios.post(`${this.BASE_URL}systCurren/`, data);
    return response;
  }

  async updateCompanySystemCurrency(id, data) {
    const response = await axios.put(`${this.BASE_URL}systCurren/${id}/`, data);
    return response;
  }

  async deleteCompanySystemCurrency() {
    const response = await axios.delete(`${this.BASE_URL}systCurren/1/`);
    return response;
  }

  async getCompanyImportSchedule() {
    const response = await axios.get(`${this.BASE_URL}importSchedule/`);
    return response;
  }

  async createCompanyImportSchedule(data) {
    const response = await axios.post(`${this.BASE_URL}importSchedule/`, data);
    return response;
  }

  async updateCompanyImportSchedule(id, data) {
    const response = await axios.put(
      `${this.BASE_URL}importSchedule/${id}/`,
      data
    );
    return response;
  }

  async deleteCompanyImportSchedule() {
    const response = await axios.delete(`${this.BASE_URL}importSchedule/1/`);
    return response;
  }

  async massUpdate(
    id,
    companyType,
    companyInfo,
    companyAddress,
    companyLogo,
    companyRegisCode,
    companySystemCurrency,
    companyImportSchedule
  ) {
    const requests = [
      axios.put(`${this.BASE_URL}companyType/${id}`, companyType),
      // axios.put(`${this.BASE_URL}companyInfo/${id}`, companyInfo),
      axios.put(`${this.BASE_URL}addressInfo/${id}`, companyAddress),
      axios.put(`${this.BASE_URL}companyLogo/${id}`, companyLogo),
      axios.put(`${this.BASE_URL}companyRegisCode/${id}`, companyRegisCode),
      axios.put(`${this.BASE_URL}systCurren/${id}`, companySystemCurrency),
      axios.put(`${this.BASE_URL}importSchedule/${id}`, companyImportSchedule),
    ];

    let succesfullRequests = [];
    Promise.allSettled(requests)
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const response = result.value;
            
            succesfullRequests.push(response);
          } else {
            
          }
        });

        if (succesfullRequests.length === requests.length) {
          return { status: 1 };
        } else {
          
          return { status: 0 };
        }
      })
      .catch((error) => {
        return { status: 0, error: error };
      });
  }

  async massCreate(
    companyType,
    companyInfo,
    companyAddress,
    companyLogo,
    companyRegisCode,
    companySystemCurrency,
    companyImportSchedule
  ) {
    const requests = [
      axios.post(`${this.BASE_URL}companyType/`, companyType),
      // axios.post(`${this.BASE_URL}companyInfo/`, companyInfo),
      axios.post(`${this.BASE_URL}addressInfo/`, companyAddress),
      axios.post(`${this.BASE_URL}companyLogo/`, companyLogo),
      axios.post(`${this.BASE_URL}companyRegisCode/`, companyRegisCode),
      axios.post(`${this.BASE_URL}systCurren/`, companySystemCurrency),
      axios.post(`${this.BASE_URL}importSchedule/`, companyImportSchedule),
    ];

    let succesfullRequests = [];
    Promise.allSettled(requests)
      .then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const response = result.value;
            
            succesfullRequests.push(response);
          } else {
            
          }
        });

        if (succesfullRequests.length === requests.length) {
          return { status: 1 };
        } else {
          
          return { status: 0 };
        }
      })
      .catch((error) => {
        return { status: 0, error: error };
      });
  }

}

export default new CompanyService();
