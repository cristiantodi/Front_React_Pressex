import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LocationService from "../../services/LocationService";

import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import React, { createContext, useContext } from 'react';

const InvoiceIncomeCreationForm = ({
  onCancel,
  commodities,
  setCommodities,
  editing,
  commodity,
}) => {
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
    resultado:"",
  };

  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [locations, setlocations] = useState([]);
  const [internalID, setinternalID] = useState(0);


  const [typeByCode, setTypeServiceTems] =useState([])
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

  tota = resultado+total;
  setformData(
    { ...formData, 
      totalAmount: rate, 
      amount: total, 
      account: tota }
    );
  
};//------------------------------------------------------------------------------------

  const addCommodity = () => {

    const suma =parseInt(formData.amount) + parseInt(resultado);
        setResultado(suma);
        setformData(
          { ...formData, suma: formData.suma, }
          );
    

    const body = {
      id: internalID,
      description: formData.description,
      typeByCode: formData.typeByCode,
      totalAmount : formData.totalAmount,
      amount: formData.amount,
      quantity: formData.quantity,
      note: formData.note,
      status: formData.status,


      
    };
    if (editing) {
      const indexToEdit = commodities.findIndex(
        (comm) => comm.id == commodity.id
      );
      const copy = [...commodities];
      copy[indexToEdit] = body;
      setCommodities(copy);
    } else {
      setCommodities([...commodities, body]);
      setinternalID(internalID + 1);
    }
    

  };

  
  useEffect(() => {
    
    if(formData.totalAmount && formData.quantity){
      setformData({...formData,amount: formData.totalAmount*formData.quantity})
      
      
    }
  }, [formData.totalAmount, formData.quantity]);



  useEffect(() => {
    if (editing) {
      const formFormat = {
        id: commodity.id,
        weight: commodity.weight,
        description: commodity.description,
        locationId: commodity.locationId,
        locationCode: commodity.locationCode,
        typeByCode: commodity.typeByCode,
        totalAmount: commodity.totalAmount,
        amount: commodity.amount,
        quantity: commodity.quantity,
        note: commodity.note,
        status: commodity.status,
        resultado: commodity.resultado,
      };
      setformData(formFormat);
    }
  }, []);

  useEffect(() => {
    LocationService.getLocations()
    .then(response => {
      setlocations(response.data.results);
    })
  }, []);

  const sendDataType = async () => {
    let rawData = {
      typeByCode: formData.typeByCode,
    };
    const response = await (creating
      ? ChartOfAccountsService.createChartOfAccounts(rawData)
      : ChartOfAccountsService.updateChartOfAccounts(
          invoice.id,
          rawData
      )
      );
      
    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onInvoicesDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };
  
  const fetchFormData = async () => {  
   const type = (await ItemsAndServicesService.getItemsAndServices()).data.results;

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
    settype(result.data)
    setformData({
      ...formData,
      typeById: id,
      typeByCode: code,
    });
  };
  return (
    <div className="income-charge-form">
      <div className="form-label_name"><h2>Invoices Creation Form</h2><span></span></div>
      <div className="creation creation-container w-100">


      {/* ------------------------------------------------------------------ */}
      <div className="form-row">
        {/* ------------------------- */}
        <div className="company-form__section">
          <label htmlFor="typeByCode" className="form-label">
          Items Service Code:
          </label>
          <AsyncSelect
            id="typeByCode"
            value={typeByCode.find((option) => option.id === formData.typeByCode)}
            onChange={(e) => {handleTypeServiceBySelection(e);}}
            isClearable={true}
            placeholder="Search and select..."
            defaultOptions={typeByOptions}
            getOptionLabel={(option) => option.code}
            getOptionValue={(option) => option.id}
            />
        </div>
         {/* --------------------------------------------- */}
         <div>
            <label htmlFor="description" className="text-comm">
              Description:
            </label>
            <input
              name="description"
              type="text"
              className="form-input"
              placeholder="Description..."
              value={formData.description} onChange={(e) =>
                setformData({ ...formData, description: e.target.value })
              }
            />
         </div>
         {/* ------------------------- */}
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
        {/* ------------------------- */}
        <div className="form-column">
          <label htmlFor="totalAmount" className="text-comm">
            Price
          </label>
          <input
            className="form-input"
            type="number"
            id="totalAmount"
            value={formData.totalAmount}
            onChange={(e) => setformData({ ...formData, totalAmount: e.target.value })}
          />
        </div>
        {/* ------------------------- */}
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
              {
                setformData({ ...formData, amount: e.target.value })}
            }
          />
        </div>
        {/* ------------------------ */}
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
        {/* -------------------------------------------------------------- */}
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
{/* -------------------------------------------------------------------------------------- */}
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

InvoiceIncomeCreationForm.propTypes = {
  onCancel: propTypes.func,
  commodities: propTypes.array,
};

InvoiceIncomeCreationForm.defaultProps = {
  onCancel: null,
  commodities: [],
};

export default InvoiceIncomeCreationForm;
