import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import AsyncSelect from "react-select/async";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Table from "../shared/components/Table";

import InvoicesService from "../../services/InvoicesService";
import PaymentTermsService from "../../services/PaymentTermsService";

import CustomerService from "../../services/CustomerService";
import ForwardingAgentService from "../../services/ForwardingAgentService";

import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";

import InvoiceIncomeCreationForm from "./InvoiceIncomeCreationForm";

const InvoicesCreationForm = ({
  invoice,
  closeModal,
  creating,
  onInvoicesDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("definition");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");


  const [issuedByOptions, setIssuedByOptions] = useState([]);
  const [paymentByOptions, setPaymentByOptions] = useState([]);
  const [accountByOptions, setAccountByOptions] = useState([]);
  const [typeByOptions, setptypeByOptions] = useState([]);


  const [type, settypes] = useState([]);
  const [total, settotal] = useState(0);
  const [types, settype] = useState([]);
  const [issuedby, setIssuedby] = useState(null);
  const [payment, setpayments] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [itemsAndServicestype, setItemsAndServicestype] = useState("");


  const [showCommodityCreationForm, setshowCommodityCreationForm] = useState(false)
  const [showCommodityEditForm, setshowCommodityEditForm] = useState(false);
  const [selectedCommodity, setselectedCommodity] = useState(null);
  const [commodities, setcommodities] = useState([]);

  var numprice = Number(numqueality);
  var numqueality = Number(numprice);

  const formFormat = {
    number: "",
    account: "",
    typeService: "",
    paymentTem: "",
    division: "",
    apply: "",
    issuedById: "",
    issuedByInfo: "",
    paymentById: "",
    accountById: "",
    accountByName: "",
    due: today,
    trasaDate: today,
    bilingAddres: 0.0,
    paidAd: "",
    amount: "",
    totalAmount: "",
    status: "Open",
    prepaid: "Yes",
    typeById: "",
    typeByCode: "",
    typeChart: "",
    total: "",

    commodities: [],
  };

  const [agent, setAgent] = useState()
  const [formData, setformData] = useState(formFormat);

  const fetchAgentOnInvoice = async () => {
    const results = (await ForwardingAgentService.getForwardingAgentById(invoice['issued_by'])).data;
    setAgent(results)
  }
  useEffect(() => {
    fetchAgentOnInvoice();
  }, [])

  const handleIssuedBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await ForwardingAgentService.getForwardingAgentById(id);
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    setIssuedby(result.data)
    setformData({
      ...formData,
      issuedById: id,
      issuedByName: name,
      issuedByInfo: info,
    });

  };

  const handlePaymentBySelection = async (event) => {
    const id = event.id;
    const description = event.description;
    const result = await PaymentTermsService.getPaymentTermById(id);
    setpayments(result.data)
    setformData({
      ...formData,
      paymentById: id,
      paymentByDesc: description,
    });
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
      accountByName: name,
    });
  };


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


  useEffect(() => {
    const fetchData = async () => {
      const typeData = await ItemsAndServicesService.getItemsAndServices();
      settypes(typeData.data.results);
    };
    fetchData();
  }, []);



  useEffect(() => {
    if (!creating && invoice) {
      setcommodities(invoice.invoiceCharges)
      setformData({
        number: invoice.number || "",
        account: invoice.account || "",
        typeService: invoice.typeService || "",
        paymentTem: invoice.paymentTem || "",
        division: total,
        apply: invoice.apply || "",
        issuedById: invoice.issued_by,
        paymentById: invoice.paymentById,
        accountById: invoice.accountById,
        accountByName: invoice.accountByName,
        due: invoice.due || "",
        trasaDate: invoice.trasaDate,
        bilingAddres: invoice.bilingAddres || "",
        paidAd: invoice.paidAd || "",

        amount: invoice.amount || "",
        totalAmount: invoice.totalAmount || "",

        paymentByDesc: invoice.paymentByDesc,
        accountByType: invoice.accountByType || "",
        typeByCode: invoice.typeByCode || "",
        status: invoice.status || "Open",
        typeChart: invoice.typeChart || "",
        invoiceCharges: invoice.invoiceCharges,

        issuedByInfo: `${agent?.street_and_number || ""} - ${agent?.city || ""
          } - ${agent?.state || ""} - ${agent?.country || ""
          } - ${agent?.zip_code || ""}`,
      });
    }
  }, [agent?.city, agent?.country, agent?.state, agent?.street_and_number, agent?.zip_code, creating, invoice, total]);

  const sendData = async () => {
    let rawData = {
      number: formData.number,
      account: formData.account,
      typeService: formData.typeService,
      paymentTem: formData.paymentTem,
      division: total,
      apply: formData.apply,
      due: formData.due,
      trasaDate: formData.trasaDate,
      bilingAddres: formData.bilingAddres,
      paidAd: formData.paidAd,
      type: formData.type,
      total: formData.total,


      issued_by: formData.issuedById,
      issuedByName: formData.issuedByName,

      paymentById: formData.paymentById,
      paymentByDesc: formData.paymentByDesc,

      accountById: formData.accountById,
      accountByType: formData.accountByType,
      accountByName: formData.accountByName,

      typeById: formData.typeById,
      typeByCode: formData.typeByCode,

      invoiceCharges: commodities,
    };

    const response = await (creating
      ? InvoicesService.createInvoice(rawData)
      : InvoicesService.updateInvoices(
        invoice.id,
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
  const sendDataType = async () => {
    let rawData = {
      apply: formData.apply,
      paymentTem: formData.paymentTem,
      account: formData.account,
      typeService: formData.typeService,

    };


    const response = await (creating
      ? CustomerService.CustomerService(rawData)
      : CustomerService.updateCustomer(
        invoice.id,
        rawData
      )
        ? ItemsAndServicesService.createItemAndService(rawData)
        : ItemsAndServicesService.updateItemsAndServicesService(
          invoice.id,
          rawData
        )
          ? ChartOfAccountsService.createChartOfAccounts(rawData)
          : ChartOfAccountsService.updateChartOfAccounts(
            invoice.id,
            rawData
          )
    );
  };

  const handleApply = async (event) => {
    const id = event.id;
    const type = event.type;

    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    setformData({
      ...formData,
      applyToId: id,
      applyToType: type,
    });
  };

  const SortArray = (x, y) => {
    return new Intl.Collator('es').compare(x.name, y.name);
  }

  const fetchFormData = async () => {
    const forwardingAgents = (await ForwardingAgentService.getForwardingAgents()).data.results;
    const paiment = (await PaymentTermsService.getPaymentTerms()).data.results;
    const accoun = (await ChartOfAccountsService.getChartOfAccounts()).data.results;
    const type = (await ItemsAndServicesService.getItemsAndServices()).data.results;
    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));


    const customers = (await CustomerService.getCustomers()).data.results;
    const customersWithType = addTypeToObjects(customers, "customer");


    const forwardingAgentsWithType = addTypeToObjects(forwardingAgents, "forwardingAgent");
    const paymentsWithType = addTypeToObjects(paiment, "paiment-termn");
    const accountWithType = addTypeToObjects(accoun, "accounten-termn");
    const typeWithType = addTypeToObjects(type, "type");


    const issuedByOptions = [...forwardingAgentsWithType, ...customersWithType];
    const paymentByOptions = [...paymentsWithType];
    const accountByOptions = [...accountWithType].filter(account => account.typeChart == "Accounts Receivable");
    const typeByOptions = [...typeWithType];

    setIssuedByOptions(issuedByOptions.sort(SortArray));
    setPaymentByOptions(paymentByOptions);
    setAccountByOptions(accountByOptions.sort(SortArray));
    setptypeByOptions(typeByOptions);

  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const handleType = (type) => {
    setItemsAndServicestype(type);
    setformData({ ...formData, type: type });

  };

  const handleSelectCommodity = (commodity) => {
    setselectedCommodity(commodity);
  };

  const handleCommodityDelete = () => {
    const newCommodities = commodities.filter(
      (com) => com.id != selectedCommodity.id
    );
    setcommodities(newCommodities);
  };

  const updateSelectedCommodity = (updatedInternalCommodities) => {
    const updatedCommodity = { ...selectedCommodity };
    updatedCommodity.internalCommodities = updatedInternalCommodities;
    setselectedCommodity(updatedCommodity);

    const index = commodities.findIndex((com) => com.id == selectedCommodity.id);

    if (index != -1) {
      const commoditiesCopy = [...commodities];
      commoditiesCopy[index] = updatedCommodity;
      setcommodities(commoditiesCopy);
    }
  };
  
  useEffect(() => {
    let totall = 0;
    for (const valor of commodities) {
      let prueba = 0;

      const totalP = 'amount';
      prueba = valor[totalP];
      totall = totall + prueba;
    }
    settotal(totall);
  }, [commodities]);

  const handleCancel = () => {
    window.location.reload();
  }

  const loadIssuedBySelectOptions = async (inputValue) => {
    const responseCustomers = (await CustomerService.search(inputValue)).data.results;
    const responseVendors = (await VendorService.search(inputValue)).data.results;
    const responseAgents = (await ForwardingAgentService.search(inputValue)).data.results;

    const options = [...(addTypeToObjects(
      responseVendors,
      "vendor"
    )), ...(addTypeToObjects(
      responseCustomers,
      "customer"
    )), ...(addTypeToObjects(
      responseAgents,
      "forwardingAgent"
    ))];

    return options;
  };

  return (
    <div className="company-form">
   
        <div className="row w-100">
        <div className="col-6 text-start">
        <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>Definition</h2><span></span></div>
         

          <div className="row w-100">
          <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                type="text"
                inputName="number"
                placeholder="EXP123456"
                value={formData.number}
                changeHandler={(e) =>
                  setformData({ ...formData, number: e.target.value })
                }
                label="Number"
              />
            </div>
            </div>

            <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="account" className="form-label">
                Chart Account:
              </label>
              <AsyncSelect
                id="account"
                value={accountByOptions.find(
                  (option) => option.id === formData.accountById)}
                onChange={(e) => { handleAccountBySelection(e); }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={accountByOptions}
                getOptionLabel={(option) => option.name + " || " + "Accounts Receivable"}
                getOptionValue={(option) => option.id}
              />
            </div>
            </div>
            </div>

            <div className="row w-100">
            <div className="col-6 text-start">
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <p id="creation-date" className="text-date">
                      Due Date
                    </p>
                <DateTimePicker
                  value={dayjs(formData.due)}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      due: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>
            </div>

            <div className="col-6 text-start">
            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <p id="creation-date" className="text-date">
                      Transaction Date
                    </p>
                <DateTimePicker
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
            </div>
        
            <div className="row w-100">
            <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="apply" className="form-label">
                Apply To:
              </label>
              <AsyncSelect
                id="issuedById"
                value={issuedByOptions.find(
                  (option) => option.id === formData.issuedById
                )}
                onChange={(e) => {
                  handleIssuedBySelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={issuedByOptions}
                loadOptions={loadIssuedBySelectOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
            </div>

            <div className="col-6 text-start">
            <div className="company-form__section">
              <label htmlFor="paymentTem" className="form-label">
                Payment Tems:
              </label>
              <AsyncSelect
                id="paymentTem"
                value={paymentByOptions.find(
                  (option) => option.id === formData.paymentById)}
                onChange={(e) => { handlePaymentBySelection(e); }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={paymentByOptions}
                getOptionLabel={(option) => option.description}
                getOptionValue={(option) => option.id}
              />
            </div>
            
            </div>
            </div>
            
            <div className="row w-100">
            <div className="col-6 text-start">
            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="issuedbyinfo"
                placeholder="Apply to..."
                value={formData.issuedByInfo}
                readonly={true}
              />
            </div>
            </div>
            </div>

          </div>
          
          </div>
    
        <div className="company-form__section">
          <button
          style={{ marginTop: "20px", height: "2vw" }}
            type="button"
            className="button-charge"
            onClick={() =>
              setshowCommodityCreationForm(!showCommodityCreationForm)
            }
          >
            Add Charge
          </button>
          {showCommodityCreationForm && (
            <InvoiceIncomeCreationForm
              onCancel={setshowCommodityCreationForm}
              commodities={commodities}
              setCommodities={setcommodities}
            ></InvoiceIncomeCreationForm>
          )}
          {showCommodityEditForm && (
            <InvoiceIncomeCreationForm
              onCancel={setshowCommodityEditForm}
              commodities={commodities}
              setCommodities={setcommodities}
              commodity={selectedCommodity}
              editing={true}
            ></InvoiceIncomeCreationForm>
          )}
          {selectedCommodity?.containsCommodities &&
            selectedCommodity.internalCommodities.map(
              (internalCommodity, index) => (
                <InvoiceIncomeCreationForm
                  key={index}
                  onCancel={() => { }}
                  commodities={selectedCommodity.internalCommodities}
                  setCommodities={updateSelectedCommodity}
                  commodity={internalCommodity}
                  editing={true}
                ></InvoiceIncomeCreationForm>
              )
            )}
        </div>

      </div>




      <Table
        data={commodities}
        columns={[
          "Status",
          "type Chart",
          "Description",

          "Quantity",
          "Price",
          "Amount",
          "Note",

          "Options",
        ]}
        onSelect={handleSelectCommodity} // Make sure this line is correct
        onDelete={handleCommodityDelete}
        onEdit={() => {
          setshowCommodityEditForm(!showCommodityEditForm);
        }}
        onInspect={() => {
        }}
        onAdd={() => { }}
        showOptions={false}
      />
      {/* ******************************************************************************************************* */}
      <div className="form-column">
        <label htmlFor="tota" className="text-comm">
          Total Amount:
        </label>
        <input
          className="form-input"
          type="number"
          readOnly
          id="tota"
          value={total}
        />
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
            invoice{creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"}  Invoice. Please
            try again
          </strong>
        </Alert>
      )}
    </div>

  );

};


InvoicesCreationForm.propTypes = {
  invoice: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onInvoicesDataChange: propTypes.func,
};

InvoicesCreationForm.defaultProps = {
  invoice: {},
  closeModal: null,
  creating: false,
  onInvoicesDataChange: null,
};

export default InvoicesCreationForm;  
