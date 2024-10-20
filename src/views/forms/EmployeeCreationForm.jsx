import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import EmployeeService from "../../services/EmployeeService";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";

const EmployeeCreationForm = ({
  employee,
  closeModal,
  creating,
  onEmployeeDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const idTypes = ["CC", "CE", "NIT"];
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    fax: "",
    street_and_number: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    identification_number: "",
    typeIdentificacion: "CC",
  });

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
    if (!creating && employee) {
      setFormData({
        name: employee.name || "",
        phone: employee.phone || "",
        email: employee.email || "",
        fax: employee.fax || "",
        street_and_number: employee.street_and_number || "",
        city: employee.city || "",
        state: employee.state || "",
        country: employee.country || "",
        zip_code: employee.zip_code || "",
        referentNumber: employee.referentNumber || "",
        identification_number: employee.identification_number || "",
        typeIdentificacion: employee.typeIdentificacion || "CC",
      });
    }
  }, [creating, employee]);

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
      phone: formData.phone,
      email: formData.email,
      fax: formData.fax,
      street_and_number: formData.street_and_number,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zip_code,
      identification_number: formData.identification_number,
      typeIdentificacion: formData.typeIdentificacion,
    };

    const response = await (creating
      ? EmployeeService.createEmployee(rawData)
      : EmployeeService.updateEmployee(employee.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onEmployeeDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      setShowErrorAlert(true);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div className="form-container">
    <div className="company-form">
      <div className="row w-100">
        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h2>General</h2>
              <span></span>
            </div>

            <div className="row mb-3">
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
              </div>

              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="number"
                    inputName="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    changeHandler={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    label="Phone"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="fax"
                    placeholder="Fax"
                    value={formData.fax}
                    changeHandler={(e) =>
                      setFormData({ ...formData, fax: e.target.value })
                    }
                    label="Fax"
                  />
                </div>
              </div>

              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="email"
                    placeholder="Email"
                    value={formData.email}
                    changeHandler={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    label="Email"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-6 text-start">
                <div className="company-form__section">
                  <Input
                    type="text"
                    inputName="identification"
                    placeholder="Identification"
                    value={formData.identification_number}
                    changeHandler={(e) =>
                      setFormData({
                        ...formData,
                        identification_number: e.target.value,
                      })
                    }
                    label="Identification"
                  />
                </div>
              </div>

              <div className="col-6 text-start">
            
                <label className="form-label">Tipo de Identificación:</label>
                  <select
                    name="contact-type-id"
                    id="identificacionNumber"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        typeIdentificacion: e.target.value,
                      })
                    }
                  >
                    {formData.typeIdentificacion && (
                      <option
                        key={formData.typeIdentificacion}
                        value={formData.typeIdentificacion}
                      >
                        {formData.typeIdentificacion}
                      </option>
                    )}
                    {idTypes.map((idType) => {
                      if (
                        formData.typeIdentificacion &&
                        idType === formData.typeIdentificacion
                      ) {
                        return null;
                      }
                      return (
                        <option key={idType} value={idType} data-key={idType}>
                          {idType}
                        </option>
                      );
                    })}
                  </select>
             
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
            <div>

            <div className="row mb-3">
            <div className="col-6 text-start">
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
              </div>

              <div className="col-6 text-start">
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
              </div>
              </div>

              <div className="row mb-3">
              <div className="col-6 text-start">
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
              </div>
             
              <div className="col-6 text-start">
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

              <div className="row mb-3">
              <div className="col-12 text-start">
              <div className="company-form__section">
                <Input
                  type="textarea"
                  inputName="street_and_number"
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
            </div>
            </div>
            </div>

          </div>
        </div>
      </div>

      <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Employee {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Employee. Please try
            again
          </strong>
        </Alert>
      )}
    </div>
  </div>
  );
};

EmployeeCreationForm.propTypes = {
  employee: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onEmployeeDataChange: propTypes.func,
};

EmployeeCreationForm.defaultProps = {
  employee: {},
  closeModal: null,
  creating: false,
  onEmployeeDataChange: null,
};

export default EmployeeCreationForm;
