import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Table from "../shared/components/Table";

import DepositsService from "../../services/DepositsService";
import DepositsChargeForm from "./DepositsChargeForm";


const DepositsCreationForm = ({
  deposit,
  closeModal,
  creating,
  ondepositDataChange,
}) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");

  const [showDepositsCreationForm, setshowDepositsCreationForm] = useState(false)
  const [showDepositEditForm, setshowDepositEditForm] = useState(false);
  const [selectedDeposit, setselectedDeposit] = useState(null);
  const [deposits, setdeposits] = useState([]);

  const [accountype, setAccountype] = useState("");
  const [total, settotal] = useState(0);

  const formFormat = {
    bankAccount: "",
    date: today,
    memo: "",
    total: "",
    amount: "",
    deposits: [],
  };

  const [formData, setFormData] = useState({ formFormat });

  useEffect(() => {
    if (!creating && deposit) {
      setdeposits(deposit.depositCharges)

      setFormData({
        bankAccount: deposit.bankAccount,
        date: deposit.date,
        memo: deposit.memo,
        amount: deposit.amount,
        total: total,
      });
      setAccountype(deposit.bankAccount);
    }
  }, [creating, deposit]);

  const sendData = async () => {
    let rawData = {
      bankAccount: formData.bankAccount,
      date: formData.date,
      memo: formData.memo,
      total: total,
      depositCharges: deposits,
    };

    //-------------------------------------
    const response = await (creating
      ? DepositsService.createDeposit(rawData)
      : DepositsService.updateDeposits(deposit.id, rawData));

    if (response.status >= 200 && response.status <= 300) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        closeModal();
        ondepositDataChange();
        setShowSuccessAlert(false);
        window.location.reload();
      }, 500);
    } else {
      setShowErrorAlert(true);
    }
  };


  const handleSelectDeposit = (deposit) => {
    setselectedDeposit(deposit);
  };

  const handleDepositDelete = () => {
    const newDeposits = deposits.filter(
      (com) => com.id != selectedDeposit.id
    );
    setdeposits(newDeposits);
  };
  const updateSelectedDeposit = (updatedInternalDeposits) => {
    const updatedDeposit = { ...selectedDeposit };
    updatedDeposit.internalDeposits = updatedInternalDeposits;
    setselectedDeposit(updatedDeposit);

    const index = deposits.findIndex((com) => com.id == selectedDeposit.id);

    if (index != -1) {
      const depositsCopy = [...deposits];
      depositsCopy[index] = updatedDeposit;
      setdeposits(depositsCopy);
    }
  };
  const handlebankAccount = (bankAccount) => {
    setAccountype(bankAccount);
    setFormData({ ...formData, bankAccount: bankAccount });
  };

  useEffect(() => {
    let totall = 0;
    for (const valor of deposits) {
      let prueba = 0;

      const totalP = 'amount';
      prueba = valor[totalP];
      totall = totall + parseInt(prueba);
    }
    settotal(totall);
  }, [deposits]);

  const handleCancel = () => {
    window.location.reload();
  }

  return (
    <div className="company-form">
      <div className="creation creation-container w-100">
        <div className="row w-100">
          <div className="col-12 text-start">
            <div className="form-label_name"><h2>Deposit</h2><span></span> </div>

            <div className="company-form__section">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Transation Date"
                  className="font-right"
                  value={dayjs(formData.date)}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      date: dayjs(e).format("YYYY-MM-DD"),
                    })
                  }
                  }
                />
              </LocalizationProvider>
            </div>

            <div className="company-form__section">
              <label htmlFor="bankAccount" className="form-label">
                Bank Account:
              </label>
              <select
                id="bankAccount"
                className="form-input"
                value={formData.bankAccount}
                onChange={(e) => handlebankAccount(e.target.value)}
              >
                <option value="">Select a Bank</option>
                <option value="Bank Acc - Chase 685285053">Bank Acc - Chase 685285053</option>
              </select>
            </div>

            <div className="company-form__section">
              <Input
                type="text"
                inputName="memo"
                placeholder="Memo"
                value={formData.memo}
                changeHandler={(e) =>
                  setFormData({ ...formData, memo: e.target.value })
                }
                label="Memo"
              />
            </div>
          </div>
          <div className="company-form__section">
            <button
              type="button"
              className="button-addpiece"
              onClick={() => setshowDepositsCreationForm(!showDepositsCreationForm)}
            >
              Add
            </button>
            {showDepositsCreationForm && (
              <DepositsChargeForm
                onCancel={setshowDepositsCreationForm}
                deposits={deposits}
                setdeposits={setdeposits}
              ></DepositsChargeForm>
            )}
            {showDepositEditForm && (
              <DepositsChargeForm
                onCancel={setshowDepositEditForm}
                deposits={deposits}
                setdeposits={setdeposits}
                deposit={selectedDeposit}
                editing={true}
              ></DepositsChargeForm>
            )}
            {/* selectedDeposit?.containsDeposits && */
              selectedDeposit?.internalDeposits?.map(
                (internalDeposit, index) => (
                  <DepositsChargeForm
                    key={index}
                    onCancel={() => { }}
                    deposits={selectedDeposit.internalDeposits}
                    setdeposits={updateSelectedDeposit}
                    deposit={internalDeposit}
                    editing={true}
                  ></DepositsChargeForm>
                )
              )}
          </div>
        </div>
      </div>

      <Table
        data={deposits}
        columns={[
          "Account Name",
          "Amount",
          "Description",
          "Entity",
          "Options",
        ]}
        onSelect={handleSelectDeposit} // Make sure this line is correct
        onDelete={handleDepositDelete}
        onEdit={() => {
          setshowDepositEditForm(!showDepositEditForm);
        }}
        onInspect={() => {
        }}
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
            Deposit Terms {creating ? "created" : "updated"} successfully!
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
            Error {creating ? "creating" : "updating"} Deposit Terms. Please
            try again
          </strong>
        </Alert>
      )}
    </div>
  );
};

DepositsCreationForm.propTypes = {
  deposit: propTypes.object,
  closeModal: propTypes.func,
  creating: propTypes.bool.isRequired,
  ondepositDataChange: propTypes.func,
};

DepositsCreationForm.defaultProps = {
  deposit: {},
  closeModal: null,
  creating: false,
  ondepositDataChange: null,
};

export default DepositsCreationForm;
