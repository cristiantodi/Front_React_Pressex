import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Table from "../shared/components/Table";

import PaymentsService from "../../services/PaymentsService";
import CustomerService from "../../services/CustomerService";
import InvoicesService from "../../services/InvoicesService";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";

const BillsPayForm = ({
  payments,
  closeModal,
  creating,
  onpaymentDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [Payments, setPayments] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [customerByOptions, setCustomerByOptions] = useState([]);
  const [accountByReceivable, setaccountByReceivable] = useState([]);
  const [accountBybank, setaccountBybank] = useState([]);
  const [customer, setcustomers] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [total, settotal] = useState("");
  const today = dayjs().format("YYYY-MM-DD");

  const [seleccion, setSeleccion] = useState('');


  const formFormat = {
    customerById: "",
    customerByName: "",
    amountReceived: 0.0,
    trasaDate: today,
    number: "",
    memo:"",
    prueba:"",
    account: "",
    accountbank:"",
    accountById : "",
    accountByType: "",
    accountRecei: "",
    typeChart: "",
    typeChartBanck: "",
    accountByBankId:"",
    accountByBankType:"",
    accountReceiBank:"",
  };

  const [formData, setformData] = useState({ formFormat });

  const handleCustomerBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await CustomerService.getCustomerById(id);
    setcustomers(result.data)
    setformData({
      ...formData,
      customerById: id,
      customerByName: name,
    });
    setSeleccion(result);
    const Payments = (await InvoicesService.getInvoicesAccountID(id)).data;
    setPayments(Payments);
    let totale = 0;
    Payments.forEach(element => {
      let subtotal=0;
      element.invoiceCharges.forEach(element => {
        subtotal += element.amount
      });
      totale+= subtotal
    });
    settotal(totale);
    
  };

  const handleAccountBySelection = async (event) => {
    const id = event.id;
    const typeChart = event.typeChart;
    const name = event.name;
    const result = await ChartOfAccountsService.getChartOfAccountsId(id);
    
    setaccounts(result.data)
    setformData({
      ...formData,
      accountById: id,
      accountByType: typeChart,
      accountRecei : name,
      
    });
    
  };

    const handleAccountBanckBySelection = async (event) => {
      const id = event.id;
      const typeChartBanck = event.typeChart;
      const name = event.name;
      const result = await ChartOfAccountsService.getChartOfAccountsId(id);
      
      setaccounts(result.data)
      setformData({
        ...formData,
        accountByBankId: id,
        accountByBankType: typeChartBanck,
        accountReceiBank : name,
        
      });
      
    };


  useEffect(() => {
    if (!creating && payments) {
      setformData({
        customerById:     payments.customerById,
        customerByName:   payments.customerByName,
        trasaDate:        payments.trasaDate,
        number:           payments.number,
        amountReceived:   payments.amountReceived,
        memo:             payments.memo,
        account:          payments.account,
        accountbank:      payments.accountbank,
        accountRecei:     payments.accountRecei,
        accountById:      payments.accountById,
        accountByType:    payments.accountByType,
        typeChart:        payments.typeChart,
        accountByBankId:  payments.accountByBankId,
        accountByBankType:payments.accountByBankType,
        accountReceiBank: payments.accountReceiBank,
      });
    }
  }, [creating, payments]);




  const sendData = async () => {
    let rawData = {
      customerById:   formData.customerById,
      customerByName: formData.customerByName,
      amountReceived: formData.amountReceived,
      trasaDate:      formData.trasaDate,
      number:         formData.number,
      memo:           formData.memo,

      accountById:    formData.accountById,
      accountByType:    formData.accountByType,
      account:        formData.account,
      accountbank:    formData.accountbank,
      accountRecei:   formData.accountRecei,
      typeChartBanck: formData.typeChartBanck,

      accountReceiBank: formData.accountReceiBank,
      accountByBankId: formData.accountByBankId,
      accountByBankType:formData.accountByBankType,
    };
    
    const response = await (creating
      ? PaymentsService.createPayment(rawData)
      : PaymentsService.updatePayment(
          payments.id,
          rawData
        )); 

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onpaymentDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {
      
      setShowErrorAlert(true);
    }
  };


  const fetchFormData = async () => {  
    const customer= (await CustomerService.getCustomers()).data.results;
    const accoun          = (await ChartOfAccountsService.getChartOfAccounts()).data.results;


    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));
  

    const customerWithType  = addTypeToObjects(customer,"customer");
    const accountWithType           = addTypeToObjects(accoun, "accounten-termn")



    const customerByOptions = [...customerWithType];
    const accountByReceivable = [...accountWithType].filter(account=> account.typeChart=="Accounts Receivable");
    
    const accountBybank = [...accountWithType].filter(account=> account.typeChart=="Bank Account");
    
 
    setCustomerByOptions(customerByOptions);
    setaccountByReceivable(accountByReceivable);
    setaccountBybank(accountBybank);
  };

  useEffect(() => {
    fetchFormData();
  }, []);



  return (
    <div className="company-form">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#definition"
            aria-selected={activeTab === "definition"}
            onClick={() => setActiveTab("definition")}
            role="tab"
          >
            Accounting Transaction Pay
          </a>
        </li>
      </ul>
      <form
        className={`tab-pane fade ${
          activeTab === "definition" ? "show active" : ""
        } company-form__general-form`}
        id="general"
        style={{ display: activeTab === "definition" ? "block" : "none" }}
      >

        -----------------------------------------------------------------------------
        <div className="containerr">
          <div className="cont-one">
            <div className="company-form__section">
              <label htmlFor="customer" className="form-label">
              Customer:
              </label>
              <AsyncSelect
                id="customer"
                value={customerByOptions.find(
                  (option) => option.id === formData.customerById)}
                onChange={(e) => {handleCustomerBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={customerByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <Input
                type="number"
                inputName="amountReceived"
                value={formData.amountReceived}
                changeHandler={(e) =>
                  setformData({ ...formData, amountReceived: e.target.value })
                }
                label="Amount Received"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Transaction Date"
                  className="font-right"
                  value={dayjs(formData.trasaDate)}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      trasaDate: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="cont-two">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="number"
                placeholder="Number"
                value={formData.number}
                changeHandler={(e) =>
                  setformData({ ...formData, number: e.target.value })
                }
                label="Check Number"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <Input
                type="text"
                inputName="memo"
                placeholder="Memo"
                value={formData.memo}
                changeHandler={(e) =>
                  setformData({ ...formData, memo: e.target.value })
                }
                label="Memo"
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <label htmlFor="account" className="form-label">
              A/R Account:
              </label>
              <AsyncSelect
                id="account"
                value={accountByReceivable.find(
                  (option) => option.id === formData.accountById)}
                onChange={(e) => {handleAccountBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={accountByReceivable}
                getOptionLabel={(option) => option.name + " || " +  "Accounts Receivable"} 
                getOptionValue={(option) => option.id}
              />
            </div>
            {/* ----------------------------------------------------------- */}
            <div className="company-form__section">
              <label htmlFor="accountbank" className="form-label">
              Bank Account:
              </label>
              <AsyncSelect
                id="accountbank"
                value={accountBybank.find(
                  (option) => option.id === formData.accountByBankId)}
                onChange={(e) => {handleAccountBanckBySelection(e);}}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={accountBybank}
                getOptionLabel={(option) => option.name + " || " +  "Bank Account"} 
                getOptionValue={(option) => option.id}
              />
            </div>
            {/* ----------------------------------------------------------- */}
          </div>
        </div>
        <Table
          data={Payments}
          columns={[
              "Name",
              "Number",
              "Account Type",
              "type Chart",
              "Transaction Date",
              "Due Date",
              "Apply",
              "Payment Temse",
          ]}









          onAdd={() => {}}
          showOptions={false}
        />
      </form>

      
      <div className="company-form__section">
        <Input
          type="text"
          inputName="number"
          placeholder="Number"
          value={total}
          label="Check Number"
        />
      </div>

      <div className="company-form__options-container">
        <button className="button-save" onClick={sendData}>
          Save
        </button>
        <button className="button-cancel" onClick={closeModal}>
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
            Payment Lists {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Payment Lists. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

BillsPayForm.propTypes = {
  payments: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onpaymentDataChange: propTypes.func,
};

BillsPayForm.defaultProps = {
  payments: {},
  closeModal: null,
  creating: false,
  onpaymentDataChange: null,
};

export default BillsPayForm;



