import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import PackageTypeService from "../../services/PackageTypeService";
const PackageTypesCreationForm = ({
  packageType,
  closeModal,
  creating,
  onpackageTypeDataChange,
}) => {

  const [activeTab, setActiveTab] = useState("description");
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    containerCode: "",
    containerEquipType: "",
    air: false,
    ocean: false,
    ground: false,
    length: "",
    width: "",
    height: "",
    volume: "",
    weight: "",
    maxWeight: "",
  });
  const [containerCodes, setContainerCodes] = useState([]);
  const [containerTypes, setContainerTypes] = useState([]);
  const [containerEquipTypes, setContainerEquipTypes] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);


  const fetchContainerCodes = async () => {
    const containerCodes = await PackageTypeService.getContainerCodes();
    setContainerCodes(containerCodes.data);
  };


  const fetchContainerTypes = async () => {
    const containerTypes = await PackageTypeService.getContainerTypes();
    setContainerTypes(containerTypes.data);
  };


  const fetchContainerEquipTypes = async () => {
    const containerEquipTypes = await PackageTypeService.getContainerEquipTypes();
    setContainerEquipTypes(containerEquipTypes.data);
  };

  useEffect(() => {

    fetchContainerCodes();
    fetchContainerTypes();
    fetchContainerEquipTypes();
  }, []);

  useEffect(() => {
    
    if (!creating && packageType) {
      setFormData({
        type: packageType.type || "",
        description: packageType.description || "",
        containerCode: packageType.containerCode || "",
        containerEquipType: packageType.containerEquipType || "",
        air: packageType.air || false,
        ocean: packageType.ocean || false,
        ground: packageType.ground || false,
        length: packageType.length || 0,
        width: packageType.width || 0,
        height: packageType.height || 0,
        volume: packageType.volume || 0,
        weight: packageType.weight || 0,
        maxWeight: packageType.maxWeight || 0,
      });
    }
  }, [creating, packageType]);

  const sendData = async () => {
    let rawData = {
      type: formData.type,
      description: formData.description,
      containerCode: formData.containerCode,
      typeCode: formData.containerCode,
      containerType: formData.containerEquipType,
      air: formData.air,
      ocean: formData.ocean,
      ground: formData.ground,
      length: parseInt(formData.length),
      width: parseInt(formData.width),
      height: parseInt(formData.height),
      volume: parseInt(formData.volume),
      weight: parseInt(formData.weight),
      maxWeight: parseInt(formData.maxWeight),
    };

    const response = await (creating
      ? PackageTypeService.createPackageType(rawData)
      : PackageTypeService.updatePackageType(packageType.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onpackageTypeDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1500);
    } else {
      
      setShowErrorAlert(true);
    }
  };

  const handleMethodSelection = (option) => {
    const updatedFormData = { ...formData };
    updatedFormData[option] = true;
    setFormData(updatedFormData);
  };

  const handleCancel = () => {
    window.location.reload();
  }

  return (
    <div className="form-container">
    <div className="company-form">
      <div className="row w-100">
        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>General</h2><span></span></div>
            <div>
              <div className="company-form__section">
                <label htmlFor="wp-name" className="form-label">
                  Type:
                </label>
                <select
                  name="package-type"
                  className="form-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="">Select a type</option>
                  {containerTypes.map((code) => (
                    <option key={code.id} value={code.containerCode}>
                      {code.containerCode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="company-form__section">
                <Input
                  type="textarea"
                  inputName="description"
                  placeholder="description"
                  value={formData.description}
                  changeHandler={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  label="Description"
                />
              </div>

              <div className="row mb-3">
              <div className="col-6 text-start">
              <div className="company-form__section">
                <label htmlFor="wp-mobilePhone" className="form-label">
                  Container Code:
                </label>
                <select
                  name="container-code"
                  className="form-input"
                  value={formData.containerCode}
                  onChange={(e) => setFormData({ ...formData, containerCode: e.target.value })}
                  disabled={formData.type !== 'Container'}
                >
                  <option value="">Select a container code</option>
                  {containerCodes.map((code) => (
                    <option key={code.id} value={code.code}>
                      {code.code}
                    </option>
                  ))}
                </select>
              </div>
              </div>

              <div className="col-6 text-start">
              <div className="company-form__section">
                <label htmlFor="wp-equip" className="form-label">
                  Container Equip. Type:
                </label>
                <select
                  name="wp-equip"
                  className="form-input"
                  value={formData.containerEquipType}
                  onChange={(e) => setFormData({ ...formData, containerEquipType: e.target.value })}
                  disabled={formData.type !== 'Container'}
                >
                  <option value="">Select a container code</option>
                  {containerEquipTypes.map((code) => (
                    <option key={code.id} value={code.code}>
                      {code.code}
                    </option>
                  ))}
                </select>
              </div>
              </div>
              </div>
              {formData.type === 'Container' && (
                <div className="startup-wizard-form__section">
                  <label htmlFor="wp-equip" className="form-label">
                    Method:
                  </label>
                  <hr />
                  <div className="checkbox_container">
                    <label htmlFor="air" className="startup-wizard-form__label-short">
                      <input
                        type="checkbox"
                        name="air"
                        id="air"
                        className="startup-wizard-form__input-checkbox"
                        onChange={() => handleMethodSelection("air")}
                        checked={formData.air}
                      />
                      Air
                    </label>
                    <label htmlFor="ocean" className="startup-wizard-form__label-short ">
                      <input
                        type="checkbox"
                        name="ocean"
                        id="ocean"
                        className="startup-wizard-form__input-checkbox"
                        onChange={() => handleMethodSelection("ocean")}
                        checked={formData.ocean}
                      />
                      Ocean
                    </label>
                    <label htmlFor="ground" className="startup-wizard-form__label-short ">
                      <input
                        type="checkbox"
                        name="ground"
                        id="ground"
                        className="startup-wizard-form__input-checkbox"
                        onChange={() => handleMethodSelection("ground")}
                        checked={formData.ground}
                      />
                      Ground
                    </label>
                  </div>
                  

                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-6 text-start">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>Address</h2><span></span></div>
            <div>
              <div className="containerr">
                <div className="cont-one">
                <div className="row mb-3">
                <div className="col-4 text-start">
                  <div className="company-form__section">
                    <Input
                      type="number"
                      inputName="length"
                      placeholder="Length"
                      value={formData.length}
                      changeHandler={(e) =>
                        setFormData({ ...formData, length: e.target.value })
                      }
                      label="Length"
                    />
                    <label htmlFor="length" className="form-label font-right">
                      in
                    </label>
                  </div>
                  </div>
                  <div className="col-4 text-start">
                  <div className="company-form__section">
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
                    <label htmlFor="height" className="form-label font-right">
                      in
                    </label>
                  </div>
                  </div>
                  <div className="col-4 text-start">
                  <div className="company-form__section">
                    <Input
                      type="number"
                      inputName="weight"
                      placeholder="Weight"
                      value={formData.weight}
                      changeHandler={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      label="Weight"
                    />
                    <label htmlFor="weight" className="form-label font-right">
                      lb
                    </label>
                  </div>
                  </div>
                </div>
                </div>

             
                <div className="cont-two">
                <div className="row mb-3">

                <div className="col-4 text-start">
                  <div className="company-form__section">
                    <Input
                      type="number"
                      inputName="width"
                      placeholder="Width"
                      value={formData.width}
                      changeHandler={(e) =>
                        setFormData({ ...formData, width: e.target.value })
                      }
                      label="Width"
                    />
                    <label htmlFor="width" className="form-label font-right">
                      in
                    </label>
                  </div>
                  </div>
                  <div className="col-4 text-start">
                  <div className="company-form__section">
                    <Input
                      type="number"
                      inputName="volume"
                      placeholder="Volume"
                      value={formData.volume}
                      changeHandler={(e) =>
                        setFormData({ ...formData, volume: e.target.value })
                      }
                      label="Volume"
                    />
                    <label htmlFor="volume" className="form-label font-right">
                      ft<sup>3</sup>
                    </label>
                  </div>
                  </div>
                  <div className="col-4 text-start">
                  <div className="company-form__section">
                    <Input
                      type="number"
                      inputName="maxweight"
                      placeholder="Max. Weight"
                      value={formData.maxWeight}
                      changeHandler={(e) =>
                        setFormData({ ...formData, maxWeight: e.target.value })
                      }
                      label="Max. Weight"
                    />
                    <label htmlFor="max-weight" className="form-label font-right">
                      lb
                    </label>
                  </div>
                  </div>
                </div>
                </div>{/* ----------------------------END TWO---------------------------------- */}
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
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)} className="alert-notification">
           {/* <AlertTitle>Success</AlertTitle> */}
          <p className="succes"> Success </p>
          <p className=" created"> Package Type {creating ? "created" : "updated"} successfully! </p>
        </Alert>
      )}
      {showErrorAlert && (
        <Alert severity="error" onClose={() => setShowErrorAlert(false)} className="alert-notification">
          <AlertTitle>Error</AlertTitle>
          <strong>
            Error {creating ? "creating" : "updating"} Package Type. Please try again
          </strong>
        </Alert>
      )}
    </div>
  </div>
  );
};

PackageTypesCreationForm.propTypes = {
  packageType: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onpackageTypeDataChange: propTypes.func,
};

PackageTypesCreationForm.defaultProps = {
  packageType: {},
  closeModal: null,
  creating: false,
  onpackageTypeDataChange: null,
};

export default PackageTypesCreationForm;
