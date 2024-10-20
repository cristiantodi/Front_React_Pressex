import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import ForwardingAgentService from "../../services/ForwardingAgentService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
const ForwardingAgentsCreationForm = ({
  forwardingAgent,
  closeModal,
  creating,
  onForwardingAgentDataChange,
  fromPickupOrder,
  onProcessComplete,
}) => {

  const [activeTab, setActiveTab] = useState("general");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [countries, setCountries] = useState([]);
  const [selectedcountry, setSelectedcountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  // const [formData, setFormData] = useState({
  
  const formFormat = {
    name: "",
    phone: "",
    mobile_phone: "",
    email: "",
    fax: "",
    website: "",
    reference_number: "",
    contact_first_name: "",
    contact_last_name: "",
    identification_number: "",
    typeIdentificacion: "",
    street_and_number: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
  };
  const [formData, setFormData] = useState(formFormat);
  const handlecountryChange = (event) => {
    setFormData({ ...formData, country: event.target.value });
    setSelectedcountry(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({
      ...formData,
      country: event.target.value,
      state: "",
      city: "",
    });
  };

  const idTypes = ["CC", "CE", "NIT"];

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
    setSelectedState(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({ 
      ...formData, 
      country: "",
      state: event.target.value, 
      city: "" });
  };

  useEffect(() => {
    if (!creating && forwardingAgent) {
      setFormData({
        name: forwardingAgent.name || "",
        phone: forwardingAgent.phone || "",
        mobile_phone: forwardingAgent.mobile_phone || "",
        email: forwardingAgent.email || "",
        fax: forwardingAgent.fax || "",
        website: forwardingAgent.website || "",
        contact_first_name: forwardingAgent.contact_first_name || "",
        contact_last_name: forwardingAgent.contact_last_name || "",
        identification_number: forwardingAgent.identification_number || "",
        typeIdentificacion: forwardingAgent.typeIdentificacion || "",
        street_and_number: forwardingAgent.street_and_number || "",
        city: forwardingAgent.city || "",
        state: forwardingAgent.state || "",
        country: forwardingAgent.country || "",
        zip_code: forwardingAgent.zip_code || "",
        reference_number: forwardingAgent.reference_number || "",
      });
    }
  }, [creating, forwardingAgent]);

  useEffect(() => {
    const fetchData = async () => {
      const countriesData = await CountriesService.fetchCountries();
      setCountries(countriesData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedcountry) {
      const fetchData = async () => {
        const statesData = await CountriesService.fetchStates(selectedcountry);
        setStates(statesData.data);
      };
      fetchData();
    }
  }, [selectedcountry]);

  useEffect(() => {
    if (selectedcountry && selectedState) {
      const fetchData = async () => {
        const citiesData = await CountriesService.fetchCities(
          selectedcountry,
          selectedState
        );
        setCities(citiesData.data);
      };
      fetchData();
    }
  }, [selectedcountry, selectedState]);

  const sendData = async () => {
    let rawData = {
      name: formData.name,
      phone: parseInt(formData.phone),
      movelPhone: parseInt(formData.mobile_phone),
      email: formData.email,
      fax: parseInt(formData.fax),
      website: formData.website,
      reference_number: parseInt(formData.reference_number),
      contact_first_name: formData.contact_first_name,
      contact_last_name: formData.contact_last_name,
      identification_number: formData.identification_number,
      typeIdentificacion: formData.typeIdentificacion || "CC",
      street_and_number: formData.street_and_number,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: parseInt(formData.zip_code),
    };

    const response = await (creating
      ? ForwardingAgentService.createForwardingAgent(rawData)
      : ForwardingAgentService.updateForwardingAgent(
          forwardingAgent.id,
          rawData
        ));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        //  después de 2 segundos.
        if (fromPickupOrder == false) {
          onForwardingAgentDataChange();
        }
        // Llamar a la función de callback para notificar a ForwardingAgentsCreationForm
        // Pase el ID del transportista creado al crear un nuevo Agent
        onProcessComplete(creating ? response.data.id : undefined);
        setFormData(formFormat);
        // window.location.reload();
      }, 2000); // Espera de 2 segundos
    } else {
      setShowErrorAlert(true);
    }
  };

  const handleCancel = () => {
    // window.location.reload();
    if (fromPickupOrder== true){
      closeModal();
      return;
    }
    window.location.reload();
  };

  return (
    <div className="form-container">
    <div className="company-form">
      <div className="row w-100">
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h2>General</h2>
              <span></span>
            </div>
            <div className="row w-100">
              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="name"
                    placeholder="Name"
                    value={formData.name}
                    changeHandler={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    label="Name"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="mphone"
                    placeholder="Mobile Phone"
                    value={formData.mobile_phone}
                    changeHandler={(e) =>
                      setFormData({ ...formData, mobile_phone: e.target.value })
                    }
                    label="Mobile Phone"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="email"
                    inputName="email"
                    placeholder="email"
                    value={formData.email}
                    changeHandler={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    label="Email"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="rnumber"
                    placeholder="rnumber"
                    value={formData.reference_number}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        reference_number: e.target.value,
                      })
                    }
                    label="Reference Number"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="contactLN"
                    placeholder="contactLN"
                    value={formData.contact_last_name}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        contact_last_name: e.target.value,
                      })
                    }
                    label="Contact Last Name"
                  />
                </div>
                <div className="company-form__section">
                  <p className="form-label">Tipo de documento:</p>
                  <select
                    name="identificacionNumber"
                    id="identificacionNumber"
                    className="form-input"
                  >
                    <option value="CC">CC</option>
                    <option value="CE">CE</option>
                    <option value="NIT">NIT</option>
                  </select>
                </div>
              </div>

              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    changeHandler={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    label="Phone"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="fax"
                    placeholder="fax"
                    value={formData.fax}
                    changeHandler={(e) =>
                      setFormData({ ...formData, fax: e.target.value })
                    }
                    label="Fax"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="website"
                    placeholder="website"
                    value={formData.website}
                    changeHandler={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    label="Website"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="contactFN"
                    placeholder="contactFN"
                    value={formData.contact_first_name}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        contact_first_name: e.target.value,
                      })
                    }
                    label="Contact First Name"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="idNumber"
                    placeholder="idNumber"
                    value={formData.identification_number}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        identification_number: e.target.value,
                      })
                    }
                    label="Identification Number"
                  />
                </div>
             
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h2>Address</h2>
              <span></span>
            </div>
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="street"
                placeholder="Street & Address..."
                value={formData.street_and_number}
                changeHandler={(e) =>
                  setFormData({
                    ...formData,
                    street_and_number: e.target.value,
                  })
                }
                label="Street & Address"
              />
            </div>
            {/* ------------------------------------------------------- */}

            <div className="company-form__section">
              <Input
                type="text"
                inputName="country"
                placeholder="Country"
                value={formData.country}
                changeHandler={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                label="Country"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="state"
                placeholder="State"
                value={formData.state}
                changeHandler={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                label="State"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="city"
                placeholder="City"
                value={formData.city}
                changeHandler={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                label="City"
              />
            </div>
            

            {/* <div className="company-form__section">
              <label htmlFor="country" className="form-label">
                Country:
              </label>
              <select
                name="country"
                id="country"
                className="form-input"
                value={formData.country}
                onChange={(e) => handlecountryChange(e)}
              >
                <option value="">Select a country</option>
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
            </div> */}
            {/* <div className="company-form__section">
              <label htmlFor="state" className="form-label">
                State:
              </label>
              <select
                name="state"
                id="state"
                className="form-input"
                value="{formData.state}"
                onChange={(e) => handleStateChange(e)}
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state.iso2} value={state.name} data-key={state.iso2}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div> */}
            {/* <div className="company-form__section">
              <label htmlFor="city" className="form-label">
                City:
              </label>
              <select
                name="city"
                id="carrier-info-city"
                className="form-input"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="company-form__section">
              <Input
                type="text"
                inputName="zipcode"
                placeholder="Zip Code..."
                value={formData.zip_code}
                changeHandler={(e) =>
                  setFormData({ ...formData, zip_code: e.target.value })
                }
                label="Zip Code"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="company-form__options-carrier" style={{marginTop: "-1vw"}}>
        {fromPickupOrder ? (
          <>
            <label className="button-charge" onClick={sendData}>Save</label>
            <label className="button-charge" onClick={handleCancel}>Cancel</label>
          </>
          ) : (
            <>
              <button className="button-save" onClick={sendData}>
                Save
              </button>
              <button className="button-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )
        }
      </div>



      {/* <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div> */}
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle >Succes</AlertTitle>
          <strong>
            Forwarding Agent {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert
          severity="error"
          onClose={() => setShowErrorAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Forwarding Agent. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  </div>
  );
};

ForwardingAgentsCreationForm.propTypes = {
  forwardingAgent: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onForwardingAgentDataChange: propTypes.func,
  onProcessComplete: propTypes.func,
};

ForwardingAgentsCreationForm.defaultProps = {
  forwardingAgent: {},
  closeModal: null,
  creating: false,
  onForwardingAgentDataChange: null,
  onProcessComplete: () => {},
};

export default ForwardingAgentsCreationForm;