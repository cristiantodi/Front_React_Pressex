import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import AsyncSelect from "react-select/async";
import Table from "../shared/components/Table";

import BillsService from "../../services/BillsService";
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import VendorService from "../../services/VendorService";
import PaymentTermsService from "../../services/PaymentTermsService";
import BillsChargeForm from "./BillsChargeForm";

const BillsCreationForm = ({
  bill,
  closeModal,
  creating,
  onbillDataChange,
}) => {
  const [activeTab, setActiveTab] = useState("bil");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");

  const [accountByOptions, setAccountByOptions] = useState([]);
  const [accounst, setaccounts] = useState([]);
  const [carriVerndorByOptions, setcarriVerndoByOptions] = useState([]);
  const [payment, setpayments] = useState([]);

  const [paymentByOptions, setPaymentByOptions] = useState([]);
  const [issuedby, setVendorCarriby] = useState(null);

  const [showBillsCreationForm, setshowBillsCreationForm] = useState(false);
  const [showBillEditForm, setshowBillEditForm] = useState(false);
  const [selectedBill, setselectedBill] = useState(null);
  const [bills, setbills] = useState([]);
  const [total, settotal] = useState(0);
  const [vendor, setVendor] = useState()

  const formFormat = {
    status: 14,
    number: "",
    due: today,
    trasaDate: today,
    paymentById: "",
    paymentTermsByType: "",
    paymentTemr: "",
    accountById: "",
    accountByType: "",
    carriVerndorByName: "",
    carriVerndorById: "",
    total: "",
    bills: [],
  };

  const SortArray = (x, y) => {
    return new Intl.Collator('es').compare(x.name, y.name);
  }

  const fetchVendorInBill = async () => {
    const results = (await VendorService.getVendorByID(bill['carriVerndorById'])).data;
    setVendor(results)
  }
  useEffect(() => {
    fetchVendorInBill();
  }, [])

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    if (!creating && bill) {
      setbills(bill.billCharges);
      setFormData({
        number: bill.number || "",
        due: bill.due || "",
        division: total,
        trasaDate: bill.trasaDate,
        paymentById: bill.paymentById,
        paymentByDesc: bill.paymentByDesc,
        paymentTemr: bill.paymentTemr,
        accountById: bill.accountById,
        accountByType: bill.accountByType,
        carriVerndorByName: bill.carriVerndorByName,
        carriVerndorById: bill.carriVerndorById,
        billCharges: bill.billCharges,
        // vendorByInfo: bill.vendorByInfo,
        status: bill.status || 14,
        vendorByInfo: `${vendor?.street_and_number || ""} - ${vendor?.city || ""
          } - ${vendor?.state || ""} - ${vendor?.country || ""
          } - ${vendor?.zip_code || ""}`,
      });
    }
  }, [creating, bill, total, vendor?.street_and_number, vendor?.city, vendor?.state, vendor?.country, vendor?.zip_code]);

  /* const fetchVendorInBill = async () => {
    const results = (await VendorService.getVendorByID(bill['carriVerndorById'])).data.results;
    console.log(results)
    setVendor(results)
    console.table(vendor)
  }
  useEffect(() => {
    fetchVendorInBill()
  }, []) */

  useEffect(() => {
    let totall = 0;
    for (const valor of bills) {
      let prueba = 0;

      const totalP = 'amount';
      prueba = valor[totalP];
      totall = totall + prueba;
    }
    settotal(totall);
  }, [bills]);

  const sendData = async () => {
    let rawData = {
      status: formData.status,
      number: formData.number || "",
      due: formData.due,
      division: total,
      trasaDate: formData.trasaDate,
      total: formData.total,
      paymentById: formData.paymentById,
      paymentByDesc: formData.paymentByDesc,
      paymentTemr: formData.paymentTemr,
      accountById: formData.accountById,
      accountByType: formData.accountByType,
      carriVerndorByName: formData.carriVerndorByName,
      carriVerndorById: formData.carriVerndorById,
      vendorByInfo: formData.vendorByInfo,
      billCharges: bills,
    };


    const response = await (creating
      ? BillsService.createBill(rawData)
      : BillsService.updateBill(bill.id, rawData));

    if (response.status >= 200 && response.status <= 300) {

      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        onbillDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 1000);
    } else {

      setShowErrorAlert(true);
    }
  };

  const fetchFormData = async () => {
    const accoun = (await ChartOfAccountsService.getChartOfAccounts()).data
      .results;
    const carriVerndo = (await VendorService.getVendors()).data.results;
    const paiment = (await PaymentTermsService.getPaymentTerms()).data.results;

    const addTypeToObjects = (arr, type) =>
      arr.map((obj) => ({ ...obj, type }));


    const accountWithType = addTypeToObjects(accoun, "accounten-termn");
    const carriVerndorWithType = addTypeToObjects(carriVerndo, "carri-Verndor");
    const paymentsWithType = addTypeToObjects(paiment, "paiment-termn");

    const accountByOptions = [...accountWithType].filter(account => account.typeChart == "Accouns Payable");
    const carriVerndorByOptions = [...carriVerndorWithType];
    const paymentByOptions = [...paymentsWithType];

    setAccountByOptions(accountByOptions);
    setcarriVerndoByOptions(carriVerndorByOptions.sort(SortArray));
    setPaymentByOptions(paymentByOptions);
  };
  useEffect(() => {
    fetchFormData();
  }, []);

  const handleAccountBySelection = async (event) => {
    const id = event.id;
    const typeChart = event.typeChart;
    const name = event.name;
    const result = await ChartOfAccountsService.getChartOfAccountsId(id);

    setaccounts(result.data)
    setFormData({
      ...formData,
      accountById: id,
      accountByType: typeChart,
      accountByName: name,
    });
  };


  const handlePaymentBySelection = async (event) => {
    const id = event.id;
    const description = event.description;
    const result = await PaymentTermsService.getPaymentTermById(id);
    setpayments(result.data);
    setFormData({
      ...formData,
      paymentById: id,
      paymentByDesc: description,
    });
  };

  const handleVendorCarriBySelection = async (event) => {
    const id = event.id;
    const name = event.name;
    const result = await VendorService.getVendorByID(id);
    const info = `${result.data.street_and_number || ""} - ${result.data.city || ""
      } - ${result.data.state || ""} - ${result.data.country || ""} - ${result.data.zip_code || ""
      }`;
    // setVendorCarriby(result.data);
    setFormData({
      ...formData,
      carriVerndorById: id,
      carriVerndorByName: name,
      vendorByInfo: info,
    });
  };


  const handleSelectBill = (bill) => {
    setselectedBill(bill);
  };

  const handleBillDelete = () => {
    const newBills = bills.filter((com) => com.id != selectedBill.id);
    setbills(newBills);
  };

  const updateSelectedBill = (updatedInternalBills) => {
    const updatedBill = { ...selectedBill };
    updatedBill.internalBills = updatedInternalBills;
    setselectedBill(updatedBill);

    const index = bills.findIndex((com) => com.id == selectedBill.id);

    if (index != -1) {
      const billsCopy = [...bills];
      billsCopy[index] = updatedBill;
      setbills(billsCopy);
    }
  };
  return (
    <div className="company-form">
     
        <div className="row w-100">
          

          <div className="col-6 text-start">
          <div className="creation creation-container w-100">
          <div className="form-label_name"><h2>Bill</h2><span></span>

            <div className="company-form__section">
              <Input
                type="text"
                inputName="number"
                placeholder="PNF123456"
                value={formData.number}
                changeHandler={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                label="Number"
              />
            </div>

            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  className="font-right"
                  value={dayjs(formData.due)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      due: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>

            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Transation Date"
                  className="font-right"
                  value={dayjs(formData.trasaDate)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trasaDate: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                />
              </LocalizationProvider>
            </div>

            <div className="company-form__section">
              <label htmlFor="account" className="form-label">
                Account:
              </label>
              <AsyncSelect
                id="account"
                value={accountByOptions.find(
                  (option) => option.id === formData.accountById)}
                onChange={(e) => { handleAccountBySelection(e); }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={accountByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>
          </div>

         
            <div className="company-form__section">
              <label htmlFor="apply" className="form-label">
                Vendor:
              </label>
              <AsyncSelect
                id="apply"
                value={carriVerndorByOptions.find(
                  (option) => option.id === formData.carriVerndorById
                )}
                onChange={(e) => {
                  handleVendorCarriBySelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={carriVerndorByOptions}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
              />
            </div>

            <div className="company-form__section">
              <Input
                type="textarea"
                inputName="vendorByInfo"
                placeholder="Apply to..."
                value={formData.vendorByInfo}
                readonly={true}
                label=""
              />
            </div>

            <div className="company-form__section">
              <label htmlFor="paymentTem" className="form-label">
                Payment Terms:
              </label>
              <AsyncSelect
                id="paymentTem"
                value={paymentByOptions.find(
                  (option) => option.id === formData.paymentById
                )}
                onChange={(e) => {
                  handlePaymentBySelection(e);
                }}
                isClearable={true}
                placeholder="Search and select..."
                defaultOptions={paymentByOptions}
                getOptionLabel={(option) => option.description}
                getOptionValue={(option) => option.id}
              />
            </div>
            </div>
            </div>
      


        <div className="company-form__section">
          <button
            type="button"
            className="button-addpiece"
            onClick={() => setshowBillsCreationForm(!showBillsCreationForm)}
          >
            Add Piece
          </button>
          {showBillsCreationForm && (
            <BillsChargeForm
              onCancel={setshowBillsCreationForm}
              bills={bills}
              setBills={setbills}
            ></BillsChargeForm>
          )}
          {showBillEditForm && (
            <BillsChargeForm
              onCancel={setshowBillEditForm}
              bills={bills}
              setBills={setbills}
              bill={selectedBill}
              editing={true}
            ></BillsChargeForm>
          )}
          {selectedBill?.containsBills &&
            selectedBill.internalBills.map((internalBill, index) => (
              <BillsChargeForm
                key={index}
                onCancel={() => { }}
                bills={selectedBill.internalBills}
                setBills={updateSelectedBill}
                bill={internalBill}
                editing={true}
              ></BillsChargeForm>
            ))}
        </div>

      </div>

      <Table
        data={bills}
        columns={[
          "Status",
          "Description",
          "Prepaid",
          "Quantity",
          "Price",
          "Amount",
          "Options",
        ]}
        onSelect={handleSelectBill} // Make sure this line is correct
        onDelete={handleBillDelete}
        onEdit={() => {
          setshowBillEditForm(!showBillEditForm);
        }}
        onInspect={() => { }}
        onAdd={() => { }}
        showOptions={false}
      />
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
            Bill Terms {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Bill Terms. Please try
            again
          </strong>
        </Alert>
      )}
    </div>
  );
};

BillsCreationForm.propTypes = {
  bill: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  onbillDataChange: propTypes.func,
};

BillsCreationForm.defaultProps = {
  bill: {},
  closeModal: null,
  creating: false,
  onbillDataChange: null,
};

export default BillsCreationForm;
