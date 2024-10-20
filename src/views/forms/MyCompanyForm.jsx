import "../../styles/components/MyCompanyForm.css"
import axios from "axios";
import { useState, useEffect } from "react";
const MyCompanyForm = () => {
  const BASE_URL = import.meta.env.VITE_BASE_API_URL;
  const [activeTab, setActiveTab] = useState("general");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [companyData, setCompanyData] = useState({});
  const apiKey = import.meta.env.VITE_COUNTRIES_API_KEY;
  const countriesUrl = import.meta.env.VITE_COUNTRIES_API_URL;

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);


  const handleCountryChange = (event) => {
    setSelectedCountry(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
  };

  const handleStateChange = (event) => {
    setSelectedState(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
  };

  useEffect(() => {
    const headers = {
      "X-CSCAPI-KEY": apiKey,
    };

    axios
      .get(countriesUrl, { headers })
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {


      });
  }, [countriesUrl, apiKey]);

  useEffect(() => {
    if (selectedCountry) {
      const headers = {
        "X-CSCAPI-KEY": apiKey,
      };

      axios
        .get(countriesUrl + selectedCountry + "/states", { headers })
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => {

        });
    }
  }, [selectedCountry, countriesUrl, apiKey]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const headers = {
        "X-CSCAPI-KEY": apiKey,
      };

      axios
        .get(
          countriesUrl + selectedCountry + "/states/" + selectedState + "/cities",
          { headers }
        )
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {

        });
    }
  }, [selectedCountry, selectedState, countriesUrl, apiKey]);

  useEffect(() => {
    const fetchData = async () => {
      let data = {};

      try {
        // let response = await axios.get(`${BASE_URL}companyInfo`);
        // data = { ...data, companyData: response.data.pop() };

        // response = await axios.get(`${BASE_URL}addressInfo`);
        // data = { ...data, addressData: response.data.pop() };

        response = await axios.get(`${BASE_URL}agent`);
        data = { ...data, agentData: response.data.pop() };
        setCompanyData(data);

      } catch (error) {

      }
    };

    fetchData();
  }, [BASE_URL]);

  const addAddress = async () => {
    event.preventDefault();
    const addressData = {
      streetNumber: document.getElementById("street&number").value,
      city: document.getElementById("city").value,
      country: document.getElementById("country").value,
      state: document.getElementById("state").value,
      zipCode: parseInt(document.getElementById("zipCode").value),
      port: parseInt(document.getElementById("port").value),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}address/`,
        addressData,
        {
          withCredentials: true,
        }
      );


    } catch (error) {


    }
  };

  return (
    <div className="company-form">
      <div className="company-form__tabs-button-container">
        <button
          className={`company-form__tabs-button ${activeTab === "general" ? "active" : "unactive"
            }`}
          onClick={() => handleTabClick("general")}
        >
          General
        </button>
        <button
          className={`company-form__tabs-button ${activeTab === "address" ? "active" : ""
            }`}
          onClick={() => handleTabClick("address")}
        >
          Address
        </button>
        <button
          className={`company-form__tabs-button ${activeTab === "billing" ? "active" : ""
            }`}
          onClick={() => handleTabClick("billing")}
        >
          Billing Address
        </button>
        <button
          className={`company-form__tabs-button ${activeTab === "otherAddresses" ? "active" : ""
            }`}
          onClick={() => handleTabClick("otherAddresses")}
        >
          Other Addresses
        </button>
        <button
          className={`company-form__tabs-button ${activeTab === "agent" ? "active" : ""
            }`}
          onClick={() => handleTabClick("agent")}
        >
          Agent
        </button>
      </div>
      <form
        className={`company-form__general-form ${activeTab === "general" ? "active" : "hidden"
          }`}
      >
        <div className="company-form__section">
          <label htmlFor="name" className="company-form__label">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.nameCompany : ""}
          />
          <button className="company-form__button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="company-form__section">
          <label htmlFor="entityId" className="company-form__label">
            Entity ID:
          </label>
          <input
            type="text"
            name="entityId"
            id="entityId"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.id : ""}

          />
        </div>
        <div className="company-form__section">
          <label htmlFor="phone" className="company-form__label">
            Phone
          </label>
          <input
            type="number"
            name="phone"
            id="phone"
            className="company-form__input input-number"
            defaultValue={companyData.companyData ? companyData.companyData.phone : ""}
          />
          <input
            type="number"
            name="phone2"
            id="phone2"
            className="company-form__input input-number"
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="mobilePhone" className="company-form__label">
            Mobile Phone:
          </label>
          <input
            type="number"
            name="mobilePhone"
            id="mobilePhone"
            className="company-form__input input-number"
            defaultValue={companyData.companyData ? companyData.companyData.phone : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="fax" className="company-form__label">
            Fax:
          </label>
          <input
            type="number"
            name="fax"
            id="fax"
            className="company-form__input input-number"
            defaultValue={companyData.companyData ? companyData.companyData.fax : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="email" className="company-form__label">
            Email:
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.email : ""}
          />
          <button className="company-form__button">
            <i className="fas fa-pen"></i>
          </button>
        </div>
        <div className="company-form__section">
          <label htmlFor="website" className="company-form__label">
            Website:
          </label>
          <input
            type="text"
            name="website"
            id="website"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.email : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="accountNumber" className="company-form__label">
            Account Number:
          </label>
          <input
            type="number"
            name="accountNumber"
            id="accountNumber"
            className="company-form__input input-number"
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="contactFirstName" className="company-form__label">
            Contact First Name:
          </label>
          <input
            type="text"
            name="contactFirstName"
            id="contactFirstName"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.firstNameContac : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="contactLastName" className="company-form__label">
            Contact Last Name:
          </label>
          <input
            type="text"
            name="contactLastName"
            id="contactLastName"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.lasNameContac : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="identificacionNumber" className="company-form__label">
            Identification Number:
          </label>
          <input
            type="text"
            name="id"
            id="id"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.id : ""}
          />
          <select
            name="identificacionNumber"
            id="identificacionNumber"
            className="company-form__input"
          ></select>
        </div>
        <div className="company-form__section">
          <label htmlFor="division" className="company-form__label">
            Division:
          </label>
          <select
            name="division"
            id="division"
            className="company-form__input"
          ></select>
        </div>
        <div className="company-form__section">
          <label htmlFor="magayaNetworkID" className="company-form__label">
            Magaya Network ID:
          </label>
          <input
            type="text"
            name="magayaNetworkID"
            id="magayaNetworkID"
            className="company-form__input"
            defaultValue={companyData.companyData ? companyData.companyData.nameCompany : ""}
          />
        </div>
      </form>
      <form
        className={`company-form__address-form ${activeTab === "address" ? "active" : "hidden"
          }`}
      >
        <div className="company-form__section">
          <label htmlFor="street&number" className="company-form__label">
            Street & Number:
          </label>
          <textarea
            type="text"
            name="street&number"
            id="street&number"
            className="company-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.streetNumber : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="city" className="company-form__label">
            City:
          </label>
          <input
            type="text"
            name="city"
            id="city"
            className="company-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.city : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="country" className="company-form__label">
            Country
          </label>
          <select
            name="country"
            id="country"
            className="company-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.country : ""}
          >
            <option
              value={companyData.addressData ? companyData.addressData.country : ""}
            >
              {companyData.addressData ? companyData.addressData.country : ""}
            </option>
          </select>
        </div>
        <div className="company-form__section">
          <label htmlFor="state" className="company-form__label">
            State:
          </label>
          <select
            name="state"
            id="state"
            className="company-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.state : ""}
          >
            <option
              value={companyData.addressData ? companyData.addressData.state : ""}
            >
              {companyData.addressData ? companyData.addressData.state : ""}
            </option>
          </select>
        </div>
        <div className="company-form__section">
          <label htmlFor="zipCode" className="company-form__label">
            Zip Code:
          </label>
          <input
            type="text"
            name="zipCode"
            id="zipCode"
            className="company-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.zipCode : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="port" className="company-form__label">
            Port:
          </label>
          <select
            name="port"
            id="port"
            className="company-form__input"
          >
            <option
            >
            </option>
          </select>
        </div>
        <button onClick={addAddress}>Add</button>
      </form>
      <form
        className={`company-form__billing-address-form ${activeTab === "billing" ? "active" : "hidden"
          }`}
      >
        <div className="startup-wizard-form__section">
          <label htmlFor="street&number" className="startup-wizard-form__label">
            Street & Number:
          </label>
          <textarea
            type="text"
            name="address-info_street&number"
            id="address-info_street&number"
            className="startup-wizard-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.streetNumber : ""}
          />
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="country" className="startup-wizard-form__label">
            Country
          </label>
          <select
            name="address-info_country"
            id="address-info_country"
            className="startup-wizard-form__input"
            onChange={handleCountryChange}
            defaultValue={companyData.addressData ? companyData.addressData.country : ""}
          >
            {countries.map((country) => (
              <option
                key={country.iso2}
                value={country.name}
                data-key={country.iso2}
              >
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="state" className="startup-wizard-form__label">
            State:
          </label>
          <select
            name="address-info_state"
            id="address-info_state"
            className="startup-wizard-form__input"
            onChange={handleStateChange}
            defaultValue={companyData.addressData ? companyData.addressData.state : ""}
          >
            {states.map((state) => (
              <option key={state.iso2} value={state.name} data-key={state.iso2}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="city" className="startup-wizard-form__label">
            City:
          </label>
          <select
            name="city"
            id="city-select"
            className="startup-wizard-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.city : ""}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="startup-wizard-form__section">
          <label htmlFor="zipCode" className="startup-wizard-form__label">
            Zip Code:
          </label>
          <input
            type="text"
            name="address-info_zipCode"
            id="address-info_zipCode"
            className="startup-wizard-form__input"
            defaultValue={companyData.addressData ? companyData.addressData.zipCode : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="b-port" className="company-form__label">
            Port:
          </label>
          <select
            name="b-port"
            id="port"
            className="company-form__input"

          >
            <option

            >

            </option>
          </select>
        </div>
      </form>
      <form
        className={`company-form__other-addresses-form ${activeTab === "otherAddresses" ? "active" : "hidden"
          }`}
      >
        <table className="company-form__table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Contact Name</th>
              <th>Country</th>
              <th>Port</th>
              <th>City</th>
              <th>State</th>
              <th>Street & Number</th>
            </tr>
          </thead>
          <tbody>
            {companyData.addressData &&
              companyData.addressData.length > 0 &&
              companyData.addressData.map((address, index) => (
                <tr key={index}>
                  <td>{address.description || "Test desc"}</td>
                  <td>{address.contactName || "Admin"}</td>
                  <td>{address.country}</td>
                  <td>{address.port}</td>
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>{address.streetNumber}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="company-form__addresses-options">
          <button className="company-form__option">Add...</button>
          <button className="company-form__option">Edit...</button>
          <button className="company-form__option">Delete</button>
        </div>
      </form>
      <form
        className={`company-form__agent-form ${activeTab === "agent" ? "active" : "hidden"
          }`}
      >
        <div className="company-form__section">
          <label htmlFor="mobilePhone" className="company-form__label">
            IATA Code:
          </label>
          <input
            type="text"
            name="iataCode"
            id="iataCode"
            className="company-form__input input-number"
            defaultValue={companyData.agentData ? companyData.agentData.iataCode : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="fmc" className="company-form__label">
            FMC:
          </label>
          <input
            type="text"
            name="fmc"
            id="fmc"
            className="company-form__input input-number"
            defaultValue={companyData.agentData ? companyData.agentData.fmc : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="customsCode" className="company-form__label">
            SCAC Code or US Customs code:
          </label>
          <input
            type="text"
            name="customsCode"
            id="customsCode"
            className="company-form__input"
            defaultValue={companyData.agentData ? companyData.agentData.scacCodeUs : ""}
          />
        </div>
        <div className="company-form__section">
          <label htmlFor="tsaNumber" className="company-form__label">
            TSA Number:
          </label>
          <input
            type="text"
            name="tsaNumber"
            id="tsaNumber"
            className="company-form__input"
            defaultValue={companyData.agentData ? companyData.agentData.tsaNumber : ""}
          />
        </div>
      </form>
      <div className="company-form__options-container">
        <button className="company-form__option">OK</button>
        <button className="company-form__option">Cancel</button>
        <button className="company-form__option">Help</button>
      </div>
    </div>
  );
};

export default MyCompanyForm;