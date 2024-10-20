import { useState, useEffect, useRef } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CommoditiesService from "../../services/CommoditiesService";
import PackageTypeService from "../../services/PackageTypeService";
import LocationService from "../../services/LocationService";
import HazardousMaterialsService from "../../services/HazardousMaterialsService";
const CommodityCreationForm = ({
  onCancel,
  commodities,
  setCommodities,
  setShowCommoditiesCreationForm,
  editing,
  commodity,
  locationEnabled,
  setEditingComodity,
  hideLocation,
}) => {
  const formFormat = {
    id: "",
    length: "",
    height: "",
    width: "",
    weight: "",
    package_type_id: "",
    package_type_description: "",
    volumetricWeight: "",
    chargedWeight: "",
    description: "",
    internalCommodities: [],
    containsCommodities: false,
    locationId: "",
    locationCode: "",
    hazardous_type: "",
    hazardous: false,
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [locations, setlocations] = useState([]);
  const [hazardousMaterialsTypes, setHazardousMaterialsTypes] = useState([]);
  const [internalID, setinternalID] = useState(0);

  const [packTypes, setpackTypes] = useState([]);

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);

  //added validation of commodities for change border color in inputs
  const ValidationCommodities = !commodities || commodities.length === 0;

  const addCommodity = () => {
    // Check if any of the required fields are empty or null
    if (
      !formData.length ||
      !formData.height ||
      !formData.package_type_id ||
      !formData.package_type_description ||
      !formData.width ||
      !formData.weight ||
      !formData.description
      // ||
      // (!formData.locationId && !(editing && commodity.containsCommodities))
    ) {
      // Show an alert or handle the validation error as needed
      alert("Please fill in all required fields.");
      return;
    }
    // Find the maximum internalID in the existing commodities and also in the internalCommodities
    const maxInternalID = Math.max(
      ...commodities.map((c) => {
        return c.internalCommodities && c.internalCommodities.length > 0
          ? Math.max(...c.internalCommodities.map((obj) => obj.id), 0)
          : c.id;
      }),
      0
    );

    const body = {
      id: maxInternalID + 1,
      length: formData.length,
      height: formData.height,
      width: formData.width,
      weight: formData.weight,
      package_type_id: formData.package_type_id,
      package_type_description: formData.package_type_description,
      volumen: formData.volumen,
      volumetricWeight: formData.volumetricWeight,
      chargedWeight: formData.volumetricWeight,
      description: formData.description,
      internalCommodities: [],
      containsCommodities: false,
      locationId: formData.locationId,
      locationCode: formData.locationCode,
      hazardous: formData.hazardous,
      hazardous_type: formData.hazardous_type
    };
    if (editing) {
      // Update the specific commodity being edited
      setCommodities((prevCommodities) => {
        return prevCommodities.map((prevCommodity) => {
          if (prevCommodity.id === commodity.id) {
            // Si el artículo no es un repaque, mantén el mismo id
            if (!prevCommodity.containsCommodities) {
              return {
                ...prevCommodity,
                ...body,
                id: prevCommodity.id, // Mantener el mismo id
              };
            } else {
              // Si es un repaque ,se actualiza
              return {
                ...prevCommodity,
                description: formData.description,
                length: formData.length,
                height: formData.height,
                width: formData.width,
                weight: formData.weight,
                package_type_id: formData.package_type_id,
                package_type_description: formData.package_type_description,
                volumen: formData.volumen,
                volumetricWeight: formData.volumetricWeight,
                internalCommodities: prevCommodity.internalCommodities,
                chargedWeight: prevCommodity.chargedWeight,
                containsCommodities: true,
                locationId: formData.locationId,
                locationCode: formData.locationCode,
                hazardous: formData.hazardous,
                hazardous_type: formData.hazardous_type
              };
            }
          } else {
            return prevCommodity;
          }
        });
      });
      setEditingComodity(false);
    } else {
      setShowCommoditiesCreationForm(true);
      setCommodities([...commodities, body]);
      //deleted this ->setinternalID(internalID + 1);
    }
    setformData(formFormat);
    // Reset the select element to its initial state
    document.getElementById("location").selectedIndex = 0;
  };

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (formData.height && formData.width && formData.length) {
      const volu = (
        (formData.height * formData.width * formData.length) /
        1728
      ).toFixed(2);
      const volWeight = (
        (formData.height * formData.width * formData.length) /
        166
      ).toFixed(2);

      setformData((prevFormData) => ({
        ...prevFormData,
        volumen: volu,
        volumetricWeight: volWeight,
        chargedWeight: Math.max(volWeight, prevFormData.weight),
      }));
    }
  }, [formData.height, formData.length, formData.width, formData.weight]);

  /* added comidity y editing */
  useEffect(() => {
    if (editing) {
      const formFormat = {
        id: commodity.id,
        weight: commodity.weight,
        length: commodity.length,
        width: commodity.width,
        height: commodity.height,
        volumen: commodity.volumen,
        volumetricWeight: commodity.volumetricWeight,
        chargedWeight: commodity.chargedWeight,
        description: commodity.description,
        package_type_description: commodity.package_type_description,
        package_type_id: commodity.package_type_id,
        locationId: commodity.locationId,
        locationCode: commodity.locationCode,
        hazardous: commodity.hazardous,
        hazardous_type: commodity.hazardous_type
      };
      setformData(formFormat);
    }
  }, [commodity, editing]);

  useEffect(() => {
    LocationService.getLocations().then((response) => {
      setlocations(response.data.results);
    });
    HazardousMaterialsService.getHazardousMaterialsTypes().then((response) => {
      setHazardousMaterialsTypes(response.data.results);
    })
  }, []);

  useEffect(() => {}, [formData.weight]);

  //------------------------------------------------------------------
  // Obtener la URL actual
  const currentUrl = window.location.href;

  useEffect(() => {
    PackageTypeService.getPackageTypes()
      .then((response) => {
        setpackTypes(response.data.results);
      })
      .catch((error) => {});
  }, []);

  const sortedPackTypes = packTypes.sort((a, b) => {
    if (a.description < b.description) return -1;
    if (a.description > b.description) return 1;
    return 0;
  });

  return (
    <div className="income-charge-form">
      {/* <h3>Commodity Creation Form</h3> */}
      <div className="row w-100 mb">
        <div className="col-3">
          <label className="text-comm">Length:</label>
          <div className="input-group ">
            <input
                type="number"
                className="form-comm"
                aria-label=""
                ref={input1Ref}
                value={formData.length}
                onKeyDown={(e) => handleKeyDown(e, input2Ref)}
                onChange={(e) =>
                    setformData({...formData, length: e.target.value})
                }
                /* added style for validation commodities */
                style={{
                  borderColor: ValidationCommodities ? "green" : "",
                  boxShadow: ValidationCommodities ? "0 0 1px 0.2px blue" : "",
                }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Width:</label>
          <div className="input-group ">
            <input
                type="number"
                className="form-comm"
                ref={input3Ref}
                aria-label=""
                value={formData.width}
                onKeyDown={(e) => handleKeyDown(e, input4Ref)}
                onChange={(e) =>
                    setformData({...formData, width: e.target.value})
                }
                /* added style for validation commodities */
                style={{
                  borderColor: ValidationCommodities ? "green" : "",
                  boxShadow: ValidationCommodities ? "0 0 1px 0.2px blue" : "",
                }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Height:</label>
          <div className="input-group ">
            <input
                type="number"
                className="form-comm"
                aria-label=""
                ref={input2Ref}
                onKeyDown={(e) => handleKeyDown(e, input3Ref)}
                value={formData.height}
                onChange={(e) =>
                    setformData({...formData, height: e.target.value})
                }
                /* added style for validation commodities */
                style={{
                  borderColor: ValidationCommodities ? "green" : "",
                  boxShadow: ValidationCommodities ? "0 0 1px 0.2px blue" : "",
                }}
            />
            <span className="input-group-text num-com">in</span>
          </div>
        </div>

        <div className="col-3">
          <label className="text-comm">Weigth:</label>
          <div className="input-group ">
            <input
                type="number"
                className="form-comm"
                aria-label=""
                value={formData.weight}
                ref={input4Ref}
                onKeyDown={(e) => handleKeyDown(e, input5Ref)}
                onChange={(e) =>
                    setformData({...formData, weight: e.target.value})
                }
                /* added style for validation commodities */
                style={{
                  borderColor: ValidationCommodities ? "green" : "",
                  boxShadow: ValidationCommodities ? "0 0 1px 0.2px blue" : "",
                }}
            />
            <span className="input-group-text num-com">lb</span>
          </div>
        </div>

        <div className="col-6">
          <label htmlFor="description" className="text-comm description-form">
            Description:
          </label>
          <input
              name="description"
              type="text"
              className="form-input"
              ref={input7Ref}
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                  setformData({...formData, description: e.target.value})
              }
          />
        </div>

        <div className="col-6">
          <label htmlFor="containerType" className="text-comm description-form">
            Container Type:
          </label>{" "}
          <select
              name="containerType"
              className="container-type"
              id="containerType"
              value={formData.package_type_id}
              onChange={(e) => {
                setformData({
                  ...formData,
                  package_type_id: e.target.value,
                  package_type_description:
                  e.target.options[e.target.selectedIndex].text,
                });
              }}
              style={{fontSize: "14px", color: "gray", padding: "3px"}}
          >
            <option value="">Select an option</option>
            {sortedPackTypes.map((type) => {
              return (
                  <option value={type.id} key={type.id}>
                    {type.description}
                  </option>
              );
            })}
          </select>
        </div>
        {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
        <div>
          {!hideLocation && (
              <>
                <label htmlFor="location" className="text-comm">
                  Location:
                </label>

                <select
                    name="location"
                    className="container-type"
                    id="location"
                    value={formData.locationId}
                    onChange={(e) => {
                      setformData({
                        ...formData,
                        locationId: e.target.value,
                        locationCode:
                            e.target.options[e.target.selectedIndex].getAttribute(
                                "data-key"
                            ),
                      });
                    }}
                    //disabled={editing && commodity.containsCommodities} // Deshabilita si es edición y es un repaque
                    style={{fontSize: "14px", color: "gray", padding: "3px"}}
                >
                  <option value="">Select an option</option>
                  {locations.map((location) => {
                    return (
                        <option
                            key={location.id}
                            value={location.id}
                            data-key={location.code}
                        >
                          {location.code}
                        </option>
                    );
                  })}
                </select>
              </>
          )}
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "10px", marginTop: '20px'}}>
          <label htmlFor="hazardous" className="text-comm" style={{display: "flex", alignItems: "center"}}>
            Hazardous material?
            <input
                type="checkbox"
                id="hazardous"
                onChange={(e) => {
                  setformData({
                    ...formData,
                    hazardous: e.target.checked,
                  });
                }}
                checked={formData.hazardous}
                style={{marginLeft: "5px"}}
            />
          </label>

          {formData.hazardous && (
              <select
                  name="hazardous_type"
                  className="container-type"
                  id="hazardous_type"
                  value={formData.hazardous_type}
                  onChange={(e) => {
                    setformData({
                      ...formData,
                      hazardous_type: e.target.value,
                    });
                  }}
                  style={{fontSize: "14px", color: "gray", padding: "3px"}}
              >
                <option value="">Type of hazardous material</option>
                {hazardousMaterialsTypes.map((hazMaterial) => (
                    <option key={hazMaterial.id} value={hazMaterial.material_name}>{hazMaterial.class_name}  {hazMaterial.material_name} 
                      
                    </option>
                ))}
              </select>
          )}
        </div>

        {/* </div> */}

        <div className="table-hover charge-buttons">
          <button
              className="button-save pick "
              style={{marginRight: "10px"}}
              type="button"
              onClick={addCommodity}
          >
            <i className="fas fa-check-circle"></i>
          </button>

          <button
              className="button-cancel pick "
              type="button"
              onClick={() => onCancel(false)}
              style={{display: "none"}}
          >
            <i className="fas fa-times-circle"></i>
          </button>
        </div>
      </div>
      {showSuccessAlert && (
          <Alert
              severity="success"
              onClose={() => setShowSuccessAlert(false)}
              className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Commodity created successfully!</strong>
          </Alert>
      )}
      {showErrorAlert && (
          <Alert
              severity="error"
              onClose={() => setShowErrorAlert(false)}
              className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error creating Commodity. Please try again</strong>
          </Alert>
      )}
    </div>
  );
};

/* added prop editing */
CommodityCreationForm.propTypes = {
  onCancel: propTypes.func,
  commodities: propTypes.array,
  editing: propTypes.bool,
};

CommodityCreationForm.defaultProps = {
  onCancel: null,
  commodities: [],
  editing: false,
};

export default CommodityCreationForm;
