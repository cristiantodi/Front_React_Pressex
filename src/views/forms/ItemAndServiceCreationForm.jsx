import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import CurrencyService from "../../services/CurrencyService";

import ChartOfAccountsService from "../../services/ChartOfAccountsService";

const ItemAndServiceCreationForm = ({
  ItemServices,
  closeModal,
  creating,
  onDataChange,
}) => {
  const [currencies, setcurrencies] = useState([]);
  const [itemsAndServices, setItemsAndServices] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [itemsAndServicestype, setItemsAndServicestype] = useState("");

  const formFormat = {
    code: "",
    description: "",
    accountName: "",
    type: "",
    amount: "",
    currency: "",
    iataCode: "",
    price: 0.0,
  };

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    
    
    
    
    if (!creating && ItemServices) {
      setFormData({
        code: ItemServices.code || "",
        description: ItemServices.description || "",
        accountName: ItemServices.accountName,
        type: ItemServices.type || "",
        amount: ItemServices.amount || "",
        currency: ItemServices.currency || "",
        iataCode: ItemServices.iataCode || "",
        price: ItemServices.amount,
      });
    }
  }, [creating, ItemServices]);

  useEffect(() => {
    const fetchData = async () => {
      const currenciesData = await CurrencyService.getCurrencies();
      setcurrencies(currenciesData.data);
    };

    fetchData();
  }, []);

  const sendData = async () => {
    let rawData = {
      code: formData.code || "",
      description: formData.description || "",
      accountName: formData.accountName || "",
      type: formData.type || "",
      amount: formData.price || "",
      currency: formData.currency || "",
      iataCode: formData.iataCode || "",
    };
    
    const response = await (creating
      ? ItemsAndServicesService.createItemAndService(rawData)
      : ItemsAndServicesService.updateItemsAndServices(
        ItemServices.id,
        rawData
      ));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();

        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const accountData = await ChartOfAccountsService.getChartOfAccounts();
      setaccounts(accountData.data.results);
    };

    fetchData();
  }, []);

  const handleType = (type) => {
    setItemsAndServicestype(type);
    setFormData({ ...formData, type: type });
  };



  const updateItemsAndServices = (url = null) => {
    ItemsAndServicesService.getItemsAndServices(url)
      .then((response) => {
        const newItemsAndServices= response.data.results.filter(
          (newItemsAndService) => {
            return !itemsAndServices.some(
              (existingPaymentTerm) =>
                existingPaymentTerm.id === newItemsAndService.id
            );
          }
        );

        setItemsAndServices(
          [...itemsAndServices, ...newItemsAndServices].reverse()
        );

        if (response.data.next) {

        }
      })
      .catch((error) => {
        console.error(error);
      });
    
  };

  useEffect(() => {
    updateItemsAndServices();
  }, []);

  const handleCancel = () => {
    window.location.reload();
  }
  
  return (
    <div className="company-form">
    
        <div className="row w-100">
          
        <div className="col-6 text-start">
        <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>Items & Services</h2><span></span></div>

         <div className="row w-100">
          <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="" className="form-label">
                Type:
              </label>
              <select
                className="form-input"
                id="type"
                value={formData.type}
                onChange={(e) => handleType(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="other">Other</option>
                <option value="freight">Freight</option>
                <option value="valuation">Valuation</option>
                <option value="tax">Tax</option>
                <option value="other freight">Other Freight</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
            </div>

          <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="description"
                placeholder="Description..."
                value={formData.description}
                changeHandler={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                label="Description"
              />
            </div>
          </div>
         </div>
        
            
         <div className="row w-100">
         <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="code"
                placeholder="code"
                value={formData.code}
                changeHandler={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                label="Code"
              />
            </div>
          </div>

          <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="accountNameType" className="form-label">
                Account:
              </label>
              <select
                id="accountName"
                className="form-input"
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
                value={formData.accountName}
              >
                <option value="">Select an Account Name</option>
                {accounst.map((accountNames) => (
                  <option
                    key={accountNames.id}
                    value={accountNames.id}
                    data-key={accountNames.typeChart}
                  >
                    {accountNames.name + " || " + accountNames.typeChart}
                  </option>
                ))}
              </select>
            </div>
          </div>
          </div>
         
          <div className="row w-100">
          <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="currency" className="text-comm">
                Currency
              </label>
              <select
                id="currency"
                className="form-input"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="">Select a currency</option>
                {Object.entries(currencies).map(([currencyCode, currencyName]) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode} - {currencyName}
                  </option>
                ))}
              </select>
            </div>
            </div>
            
            <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                type="number"
                inputName="price"
                value={formData.price}
                changeHandler={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                label="Price"
              />
            </div>
            </div>

            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="iataCode"
                placeholder="IATA Code here..."
                label="IATA Code"
                value={formData.iataCode}
                changeHandler={(e) =>
                  setFormData({ ...formData, iataCode: e.target.value })
                }
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
            Item and Service {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Item and Service. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

ItemAndServiceCreationForm.propTypes = {
  ItemServices: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onDataChange: propTypes.func,
};

ItemAndServiceCreationForm.defaultProps = {
  ItemServices: {},
  closeModal: null,
  creating: false,
  onDataChange: null,
};

export default ItemAndServiceCreationForm;