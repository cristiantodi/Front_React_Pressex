import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CompanyServirce from "../../services/CompanyService";
import LocationService from "../../services/LocationService";
import Input from "../shared/components/Input";
const LocationsCreationForm = ({
  location,
  closeModal,
  creating,
  onlocationDataChange,
}) => {

  const [activeTab, setActiveTab] = useState("identification");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [companyAddress, setcompanyAddress] = useState("");

  const [formData, setFormData] = useState({
    status: "",
    code: "",
    description: "",
    empty: true,
    type: "",
    zone: "",
    length: "",
    width: "",
    height: "",
    disable: false
  });

  useEffect(() => {
    if (!creating && location) {
      setFormData({
        status: location.status || "",
        code: location.code || "",
        description: location.description || "",
        empty: location.empty || true,
        type: location.type || "",
        zone: location.zone || "",
        length: location.length || "",
        width: location.width || "",
        height: location.height || "",
        disable: location.disable || false,
      });
    }
  }, [creating, location]);

  useEffect(() => {
    const fetchData = async () => {
      const addresData = await CompanyServirce.getAddress();
      setcompanyAddress(addresData.data);
    };

    fetchData();
  }, []);
  const sendData = async () => {
    let rawData = {
      status: formData.status,
      code: formData.code,
      description: formData.description,
      empty: formData.empty,
      type: formData.type,
      zone: formData.zone,
      length: formData.length,
      width: formData.width,
      height: parseInt(formData.height),
      disable: formData.disable
    };

    const response = await (creating
      ? LocationService.createLocation(rawData)
      : LocationService.updateLocation(location.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onlocationDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  }

  return (
    <div className="form-container">
    <div className="company-form">


      {/* <div className="col-12"> */}
        <div className="creation creation-container w-100">
        <div className="form-label_name"><h2>General</h2><span></span></div>
        <div className="row w-100">

          <div className="col-6 text-start">

          
            <div className="company-form__section">
              <Input
                type="text"
                inputName="code"
                placeholder="Code"
                value={formData.code}
                changeHandler={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                label="Code"
              />
            </div>
            <div className="company-form__section">
              <Input
                type="text"
                inputName="description"
                placeholder="Description"
                value={formData.description}
                changeHandler={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                label="Description"
              />
            </div>


            <div className="company-form__section">
              <label htmlFor="wp-fax" className="form-label">
                Type
              </label>
              <select name="wp-fax"
                id="wp-fax"
                className="form-input"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                value={formData.type}>
                <option value="">Select a type</option>
                <option value="Receiving">Receiving</option>
                <option value="Storage">Storage</option>
                <option value="Replenishment">Replenishment</option>
                <option value="Picking">Picking</option>
                <option value="Quality Control">Quality Control</option>
                <option value="Shipping">Shipping</option>
                <option value="Mobile">Mobile</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="company-form__section">
              <label htmlFor="wp-fax" className="form-label">
                Zone
              </label>
              <select name="wp-fax"
                id="wp-fax"
                className="form-input"
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                value={formData.zone}>
                <option value="">Select a zone</option>
                <option value="Default Zone">Default Zone</option>
                {companyAddress && <option value={companyAddress}>{companyAddress}</option>}
              </select>
            </div>
          </div>

          <div className="col-6 text-start">
            <div className="company-form__section margin-zero">
              <Input
                type="number"
                inputName="length"
                placeholder="Length"
                value={formData.length}
                changeHandler={(e) =>
                  setFormData({ ...formData, length: e.target.value })
                }
                label="Lengtht"
              />
              <label htmlFor="" className="form-label font-right">in</label>
            </div>
            <div className="company-form__section margin-zero">
              <Input
                type="number"
                inputName="width"
                placeholder="width"
                value={formData.width}
                changeHandler={(e) =>
                  setFormData({ ...formData, width: e.target.value })
                }
                label="Width"
              />
              <label htmlFor="" className="form-label font-right">in</label>

            </div>
            <div className="company-form__section ">
              <Input
                type="number"
                inputName="height"
                placeholder="height"
                value={formData.height}
                changeHandler={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                label="Height"
              />
              <label htmlFor="" className="form-label font-right">in</label>

            </div>
            <div className="company-form__section with-si">
              <Input
                type="checkbox"
                inputName="isempty"
                value={formData.empty}
                changeHandler={(e) =>
                  setFormData({ ...formData, empty: e.target.checked })
                }
                label="Is checked"
              />
            </div>
          </div>
        </div>

      {/* </div> */}
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
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
          <AlertTitle>Success</AlertTitle>
          <strong>
            Location {creating ? "created" : "updated"} successfully!
          </strong>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Location. Please try again
          </strong>
        </Alert>
      )}
    </div>
    </div>
  );
};

LocationsCreationForm.propTypes = {
  location: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onlocationDataChange: propTypes.func,
};

LocationsCreationForm.defaultProps = {
  location: {},
  closeModal: null,
  creating: false,
  onlocationDataChange: null,
};

export default LocationsCreationForm;
