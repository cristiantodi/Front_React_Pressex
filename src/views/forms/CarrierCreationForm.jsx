import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import CarrierService from "../../services/CarrierService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
const CarrierCreationForm = ({
  carrier,
  closeModal,
  creating,
  onCarrierDataChange,
  fromPickupOrder,
  onProcessComplete,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [carrierType, setcarrierType] = useState("Land");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
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
    street_and_number: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    carrierType: "Land",
    methodCode: "Land",
    carrier_code: "",
    identification_number: "",
    typeIdentificacion: "",

    iata_code: "",
    airline_code: "",
    airline_prefix: "",
    airway_bill_number: "",
    passengersOnlyAirline: false,

    scac_number: "",

    fmcNumber: "",
  };
  const [formData, setFormData] = useState(formFormat);

  const handleCountryChange = (event) => {
    setFormData({ ...formData, country: event.target.value });
    setSelectedCountry(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({
      ...formData,
      country: event.target.value,
      state: "",
      city: "",
    });
  };

  const handleStateChange = (event) => {
    setFormData({ ...formData, state: event.target.value });
    setSelectedState(
      event.target.options[event.target.selectedIndex].getAttribute("data-key")
    );
    setFormData({ ...formData, state: event.target.value, city: "" });
  };

  useEffect(() => {
    if (!creating && carrier) {
      let updatedFormData = {
        name: carrier.name || "",
        phone: carrier.phone || "",
        mobile_phone: carrier.mobile_phone || "",
        email: carrier.email || "",
        fax: carrier.fax || "",
        website: carrier.website || "",
        reference_number: carrier.reference_number || "",
        contact_first_name: carrier.contact_first_name || "",
        contact_last_name: carrier.contact_last_name || "",
        street_and_number: carrier.street_and_number || "",
        city: carrier.city || "",
        state: carrier.state || "",
        country: carrier.country || "",
        zip_code: carrier.zip_code || "",
        carrierType: carrier.carrierType || "",
        methodCode: carrier.methodCode || "",
        carrier_code: carrier.carrier_code || "",
        identification_number: carrier.identification_number || "",
        typeIdentificacion: carrier.typeIdentificacion || "",
      }; // Create a copy of the existing formData

      if (carrier.carrierType === "Land") {
        updatedFormData.scac_number = carrier.scac_number;
      }
      if (carrier.carrierType === "Air") {
        updatedFormData.iata_code = carrier.iata_code || "";
        updatedFormData.airline_code = carrier.airline_code || "";
        updatedFormData.airline_prefix = carrier.airline_prefix || "";
        updatedFormData.airway_bill_number = carrier.airway_bill_number || "";
        updatedFormData.passengersOnlyAirline =
          carrier.passengersOnlyAirline || "";
      }
      if (carrier.carrierType === "Ocean") {
        updatedFormData.scac_number = carrier.scac_number || "";
        updatedFormData.fmcNumber = carrier.fmcNumber || "";
      }
      for (let property in updatedFormData) {
        if (updatedFormData[property] === null) {
          updatedFormData[property] = "";
        }
      }
      setFormData(updatedFormData); // Update formData once with all the changes
    }
  }, [creating, carrier]);

  useEffect(() => {
    const fetchData = async () => {
      const countriesData = await CountriesService.fetchCountries();
      setCountries(countriesData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const fetchData = async () => {
        const statesData = await CountriesService.fetchStates(selectedCountry);
        setStates(statesData.data);
      };
      fetchData();
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const fetchData = async () => {
        const citiesData = await CountriesService.fetchCities(
          selectedCountry,
          selectedState
        );
        setCities(citiesData.data);
      };
      fetchData();
    }
  }, [selectedCountry, selectedState]);

  const sendData = async () => {
    let rawData = {
      name: formData.name,
      phone: formData.mobile_phone,
      mobile_phone: formData.mobile_phone,
      email: formData.email,
      fax: formData.fax,
      website: formData.website,
      reference_number: formData.reference_number,
      contact_first_name: formData.contact_first_name,
      contact_last_name: formData.contact_last_name,
      identification_number: formData.identification_number,
      typeIdentificacion: formData.typeIdentificacion,
      sistenID: "",
      street_and_number: formData.street_and_number,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zip_code,
      parentAccount: "",
      carrierType: formData.carrierType,
      methodCode: formData.carrierType,
      carrier_code: formData.carrier_code,
      scac_number: formData.scac_number,
      iata_code: formData.iata_code,
      airline_code: formData.airline_code,
      airline_prefix: formData.airline_prefix,
      airway_bill_number: formData.airway_bill_number,
      passengersOnlyAirline: formData.passengersOnlyAirline,
    };

    const response = await (creating
      ? CarrierService.createCarrier(rawData)
      : CarrierService.updateCarrier(carrier.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        //  después de 2 segundos.
        if (fromPickupOrder == false) {
          onCarrierDataChange();
        }
    
        // Llamar a la función de callback para notificar a PickOrderCreationForm
        // Pase el ID del transportista creado al crear un nuevo carrier
        onProcessComplete(creating ? response.data.id : undefined);
        setFormData(formFormat);
        // window.location.reload();
      }, 2000); // Espera de 2 segundos
    } else {
      setShowErrorAlert(true);
    }
  };

  const handleTypeChange = (e) => {
    const selectedCarrierType = e.target.value;
    setcarrierType(selectedCarrierType);
    setFormData({
      ...formData,
      carrierType: selectedCarrierType,
      methodCode: selectedCarrierType,
    });
  };

  const handleCancel = () => {
    if (fromPickupOrder== true){
      closeModal();
      return;
    }
    window.location.reload();
  };

  return (
    <div
      // style={{
      //   maxWidth: "100%",
      //   maxHeight: "100%",
      //   overflowX: "auto",
      //   overflowY: "auto",
      // }}
    >
      <div className="form-container_carrier">
        <div className="company-form carrier">
          <div className="row w-100">
            <div className="col-3">
              <div className="creation creation-form_general w-100">
                <div className="form-label_name">
                  <h2>General</h2>
                  <span></span>
                </div>
                <div className="row w-100">
                  <div className="col-6">
                    <div className="company-form__section">
                      <label htmlFor="carrierType" className="form-label">
                        Carrier Type:
                      </label>
                      <select
                        id="carrierType"
                        className="form-input"
                        value={formData.carrierType}
                        onChange={(e) => handleTypeChange(e)}
                      >
                        <option value="Land">Land</option>
                        <option value="Air">Air</option>
                        <option value="Ocean">Ocean</option>
                      </select>
                    </div>

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
                        inputName="ccode"
                        placeholder="Carrier Code"
                        value={formData.carrier_code}
                        changeHandler={(e) =>
                          setFormData({
                            ...formData,
                            carrier_code: e.target.value,
                          })
                        }
                        label="Carrier Code"
                      />
                    </div>
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
                        inputName="mphone"
                        placeholder="Mobile Phone"
                        value={formData.mobile_phone}
                        changeHandler={(e) =>
                          setFormData({
                            ...formData,
                            mobile_phone: e.target.value,
                          })
                        }
                        label="Mobile Phone"
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
                      <p className="form-label">Tipo de documento</p>
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

                  <div className="col-6">
                    <div className="company-form__section" style={{width: "11vw"}}>
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

                    <div className="company-form__section" style={{width: "11vw"}}>
                      <Input
                        type="text"
                        inputName="website"
                        placeholder="website"
                        value={formData.website}
                        changeHandler={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        label="Web Site"
                      />
                    </div>
                    <div className="company-form__section" style={{width: "11vw"}}>
                      <Input
                        type="text"
                        inputName="reference_number"
                        placeholder="Referent Number"
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
                    <div className="company-form__section" style={{width: "11vw"}}>
                      <Input
                        type="text"
                        inputName="contactFN"
                        placeholder="Contact First Name"
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
                    <div className="company-form__section" style={{width: "11vw"}}>
                      <Input
                        type="text"
                        inputName="contact_last_name"
                        placeholder="Contact Last Name"
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
                    <div className="company-form__section" style={{width: "11vw"}}>
                      <Input
                        type="text"
                        inputName="identification_number"
                        placeholder="ID Number"
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
                  {/* ----------------------------END TWO---------------------------------- */}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="creation creation-form w-100">
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
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="zip_code"
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
            <div className="col-3">
              <div className="creation creation-form w-100">
                <div className="form-label_name">
                  <h2>Land</h2>
                  <span></span>
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="iata_code"
                    placeholder="IATA code..."
                    value={formData.iata_code}
                    changeHandler={(e) =>
                      setFormData({ ...formData, iata_code: e.target.value })
                    }
                    label="IATA account number"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="airline_code"
                    placeholder="Airline code..."
                    value={formData.airline_code}
                    changeHandler={(e) =>
                      setFormData({ ...formData, airline_code: e.target.value })
                    }
                    label="Airline Code"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="airline_prefix"
                    placeholder="Airline Prefix..."
                    value={formData.airline_prefix}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        airline_prefix: e.target.value,
                      })
                    }
                    label="Airline Prefix"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="textarea"
                    inputName="airway_bill_number"
                    placeholder="Airline Bill Numbers..."
                    value={formData.airway_bill_number}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        airway_bill_number: e.target.value,
                      })
                    }
                    label="IATA account number"
                  />
                </div>
                <hr />
                <div className="company-form__section">
                  <Input
                    type="checkbox"
                    inputName="passengerOnly"
                    value={formData.passengersOnlyAirline}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        passengersOnlyAirline: e.target.value.checked,
                      })
                    }
                    label="This is a passengers only airline"
                  />
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="creation creation-carrier w-100">
                <div className="form-label_name">
                  <h2>Airline</h2>
                  <span></span>
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="scac_number"
                    value={formData.scac_number}
                    placeholder="SCAC Number..."
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        scac_number: e.target.value.checked,
                      })
                    }
                    label="SCAC Number"
                  />
                </div>
              </div>

              {/* <div className="col-4"> */}
              <div className="creation creation-carrier w-100">
                <div className="form-label_name">
                  <h2>Ocean</h2>
                  <span></span>
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="fmcnumber"
                    placeholder="FMC Number..."
                    value={formData.fmcNumber}
                    changeHandler={(e) =>
                      setFormData({ ...formData, fmcNumber: e.target.value })
                    }
                    label="FMC number"
                  />
                </div>
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="scac_number"
                    placeholder="SCAC Number..."
                    value={formData.scac_number}
                    changeHandler={(e) =>
                      setFormData({ ...formData, scac_number: e.target.value })
                    }
                    label="SCAC number"
                  />
                </div>
              {/* </div> */}
            </div>

            </div>
          </div>
        </div>
      </div>

      <div className="company-form__options-carrier" style={{marginLeft:"27vw", marginTop: "-1vw"}}>
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
                )}
      </div>
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
          style={{ marginLeft: "30vw" }}
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Carrier {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Carrier. Please try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

CarrierCreationForm.propTypes = {
  carrier: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onCarrierDataChange: propTypes.func,
  onProcessComplete: propTypes.func,
};

CarrierCreationForm.defaultProps = {
  carrier: {},
  closeModal: null,
  creating: false,
  onCarrierDataChange: null,
  onProcessComplete: () => {},
};

export default CarrierCreationForm;