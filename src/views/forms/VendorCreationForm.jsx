import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CountriesService from "../../services/CountriesService"; // Adjust the path as needed
import Input from "../shared/components/Input";
import VendorService from "../../services/VendorService";
const VendorsCreationForm = ({
  vendor,
  closeModal,
  creating,
  onvendorDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("general");

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
    website: "",
    reference_number: "",
    contact_first_name: "",
    contact_last_name: "",
    street_and_number: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
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
    if (!creating && vendor) {
      setFormData({
        name: vendor.name || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        fax: vendor.fax || "",
        website: vendor.website || "",
        contact_first_name: vendor.contact_first_name || "",
        contact_last_name: vendor.contact_last_name || "",
        street_and_number: vendor.street_and_number || "",
        city: vendor.city || "",
        state: vendor.state || "",
        country: vendor.country || "",
        zip_code: vendor.zip_code || "",
        reference_number: vendor.reference_number || "",
      });
    }
  }, [creating, vendor]);

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
      website: formData.website,
      reference_number: formData.reference_number,
      contact_first_name: formData.contact_first_name,
      contact_last_name: formData.contact_last_name,
      street_and_number: formData.street_and_number,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zip_code: formData.zip_code,
    };

    const response = await (creating
      ? VendorService.createVendor(rawData)
      : VendorService.updateVendor(vendor.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onvendorDataChange();
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
    <div className="company-form vendor">
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
                    inputName="contact_first_name"
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
                    type="email"
                    inputName="email"
                    placeholder="Email"
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
                    inputName="reference_number"
                    placeholder="Reference Number"
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

      <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {/* Conditionally render the success alert */}
      {showSuccessAlert && (
        <Alert
          severity="success"
          onClose={() => setShowSuccessAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Success</AlertTitle>
          <strong>
            Vendor {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Vendor. Please try again
          </strong>
        </Alert>
      )}
    </div>
  </div>

  );
};

VendorsCreationForm.propTypes = {
  vendor: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onvendorDataChange: propTypes.func,
};

VendorsCreationForm.defaultProps = {
  vendor: {},
  closeModal: null,
  creating: false,
  onvendorDataChange: null,
};

export default VendorsCreationForm;
