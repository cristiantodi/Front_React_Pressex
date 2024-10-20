import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LocationService from "../../services/LocationService";

import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import React, { createContext, useContext } from "react";

const BillsChargeForm = ({ onCancel, bills, setBills, editing, bill }) => {
  const formFormat = {
    status: 14,
    description: "",
    locationId: "",
    locationCode: "",
    typeByCode: "",
    totalAmount: "",
    amount: "",
    quantity: "",
    note: "",
    resultado: "",
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [locations, setlocations] = useState([]);
  const [internalID, setinternalID] = useState(0);


  const [typeByCode, setTypeServiceTems] = useState([]);
  const [typeByOptions, setptypeByOptions] = useState([]);
  const [types, settype] = useState([]);

  const total = createContext();
  const [resultado, setResultado] = useState(0);
  const [charges, setcharges] = useState([]);

  let totalp;
  let tota;

  const handleChargeRateChange = (e) => {
    let unit = 0;
    const rate = e.target.value;
    unit = formData.quantity;
    const total = unit * rate;

    tota = resultado + total;
    
    

    setformData({
      ...formData,
      totalAmount: rate,
      amount: total,
      account: tota,
    });
  }; //------------------------------------------------------------------------------------

  const addCommodity = () => {
    const suma = parseInt(formData.amount) + parseInt(resultado);
    setResultado(suma);
    setformData({ ...formData, suma: formData.suma });
    

    const body = {
      id: internalID,
      description: formData.description,
      typeByCode: formData.typeByCode,
      totalAmount: formData.totalAmount,
      amount: formData.amount,
      quantity: formData.quantity,
      note: formData.note,
      status: formData.status || 14,

    };
    if (editing) {
      const indexToEdit = bills.findIndex((comm) => comm.id == bill.id);
      const copy = [...bills];
      copy[indexToEdit] = body;
      setBills(copy);
    } else {
      setBills([...bills, body]);
      setinternalID(internalID + 1);
    }
    
  };

  useEffect(() => {
    if (formData.totalAmount && formData.quantity) {
      setformData({
        ...formData,
        amount: formData.totalAmount * formData.quantity,
      });
      
    }
  }, [formData.totalAmount, formData.quantity]);

  useEffect(() => {
    
    if (formData.height && formData.width && formData.length) {
      const volWeight = (
        (formData.height * formData.width * formData.length) /
        166
      ).toFixed(0);
      const ratedWeight =
        formData.volumetricWeight >= formData.weight
          ? formData.volumetricWeight
          : formData.weight;
      setformData({
        ...formData,
        volumetricWeight: volWeight,
        chargedWeight: ratedWeight,
      });
    }
  }, [formData.height, formData.length, formData.width]);

  useEffect(() => {
    if (editing) {
      const formFormat = {
        id: bill.id,
        weight: bill.weight,
        description: bill.description,
        locationId: bill.locationId,
        locationCode: bill.locationCode,
        typeByCode: bill.typeByCode,
        totalAmount: bill.totalAmount,
        amount: bill.amount,
        quantity: bill.quantity,
        note: bill.note,
        status: bill.status || 14,
        resultado: bill.resultado,

      };
      setformData(formFormat);
    }
  }, []);

  useEffect(() => {
    LocationService.getLocations().then((response) => {
      setlocations(response.data.results);
    });
  }, []);

  const sendDataType = async () => {
    let rawData = {
      typeByCode: formData.typeByCode,
    };
    const response = await (creating
      ? ChartOfAccountsService.createChartOfAccounts(rawData)
      : ChartOfAccountsService.updateChartOfAccounts(invoice.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onInvoicesDataChange();
        setShowSuccessAlert(false);

      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };

  const fetchFormData = async () => {
    const type = (await ItemsAndServicesService.getItemsAndServices()).data
      .results;

    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));


    const typeWithType = addTypeToObjects(type, "type");


    const typeByOptions = [...typeWithType];

    setptypeByOptions(typeByOptions);
  };

  useEffect(() => {
    fetchFormData();
  }, []);


  const handleTypeServiceBySelection = async (event) => {
    const id = event.id;
    const code = event.code;
    const result = await ItemsAndServicesService.getItemAndServiceById(id);
    settype(result.data);
    setformData({
      ...formData,
      typeById: id,
      typeByCode: code,
    });
  };
  return (
    <div className="company-form row income-charge-form">
      <h3>Invoices Creation Form</h3>
      <div className="row w-100">
        <div className="col-6">
          <div className="company-form__section">
            <label htmlFor="typeByCode" className="form-label">
              Type:
            </label>
            <AsyncSelect
              id="typeByCode"
              value={typeByCode.find(
                (option) => option.id === formData.typeByCode
              )}
              onChange={(e) => {
                handleTypeServiceBySelection(e);
              }}
              isClearable={true}
              placeholder="Search and select..."
              defaultOptions={typeByOptions}
              getOptionLabel={(option) => option.code}
              getOptionValue={(option) => option.id}
            />
          </div>
          <div>
            <label htmlFor="description" className="text-comm">
              Description:
            </label>
            <input
              name="description"
              type="text"
              className="form-input"
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                setformData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="company-form__section">
            <Input
              type="text"
              inputName="note"
              placeholder="Note"
              value={formData.note}
              changeHandler={(e) =>
                setformData({ ...formData, note: e.target.value })
              }
              label="Note"
            />
          </div>
        </div>
        <div className="col-6">
          <div className="company-form__section">
            <Input
              type="number"
              inputName="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              changeHandler={(e) =>
                setformData({ ...formData, quantity: e.target.value })
              }
              label="Quantity"
            />
          </div>
          <div className="form-column">
            <label htmlFor="totalAmount" className="text-comm">
              Price
            </label>
            <input
              className="form-input"
              type="number"
              id="totalAmount"
              value={formData.totalAmount}
              onChange={(e) => handleChargeRateChange(e)}
            />
          </div>
          <div className="form-column">
            <label htmlFor="amount" className="text-comm">
              Amount
            </label>
            <input
              className="form-input"
              type="number"
              id="amount"
              readOnly
              value={formData.amount}
              onChange={(e) =>
                setformData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="table-hover charge-buttons">
          <button
            className="button-save pick "
            style={{ marginRight: "10px" }}
            type="button"
            onClick={addCommodity}
          >
            <i className="fas fa-check-circle"></i>
          </button>
          <button
            className="button-cancel pick "
            type="button"
            onClick={() => onCancel(false)}
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

BillsChargeForm.propTypes = {
  onCancel: propTypes.func,
  bills: propTypes.array,
};

BillsChargeForm.defaultProps = {
  onCancel: null,
  bills: [],
};

export default BillsChargeForm;
