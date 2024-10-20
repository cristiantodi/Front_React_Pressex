import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CustomerService from "../../services/CustomerService";
import Input from "../shared/components/Input";
import dayjs from "dayjs";
import PreAlertService from "../../services/PreAlertService";
import AsyncSelect from "react-select/async";
import Table from "../shared/components/Table";

const PreAlertCreationForm = ({
  preAlert,
  closeModal,
  creating,
  onPreAlertDataChange,
}) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [otherStore, setOtherStore] = useState(false);
  const [otherCourier, setOtherCourier] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageId, setPackageId] = useState(0);
  const today = dayjs().format("YYYY-MM-DD");

  const formFormat = {
    created_at: today,
    client: null,
    tracking_number: null,
    store: null,
    courier: null,
    packages: [],
  };

  const [formData, setFormData] = useState(formFormat);
  const [packageData, setPackageData] = useState({
    id: packageId,
    amount: 0,
    description: "",
  });

  useEffect(() => {
    if (!creating && preAlert != null) {
      let updatedFormData = {
        created_at: preAlert.created_at,
        client: preAlert.client,
        tracking_number: preAlert.tracking_number,
        store: preAlert.store,
        courier: preAlert.courier,
        packages: preAlert.packages,
      };
      
      setFormData(updatedFormData);
    }
  }, [creating, preAlert]);

  useEffect(() => {
    async function fetchData() {
      const customers = (await CustomerService.getCustomers()).data.results;
      setClients(customers);
    }

    fetchData();
  }, [creating, preAlert]);

  const sendData = async () => {
    const createPickUp = async () => {
      const response = await (creating
        ? PreAlertService.createPreAlert(formData)
        : PreAlertService.updatePreAlert(preAlert.id, formData));

      if (response.status >= 200 && response.status <= 300) {
        
        setShowSuccessAlert(true);
        setTimeout(() => {
          closeModal();
          onPreAlertDataChange();
          setShowSuccessAlert(false);
          setFormData(formFormat);
          window.location.reload();
        }, 1000);
      } else {
        
        setShowErrorAlert(true);
      }
    };
    createPickUp();
  };

  const handleStoreSelection = (e) => {
    const store = e.target.value;
    if (store === "other") {
      setOtherStore(true);
      setFormData({ ...formData, store: null });
    } else {
      setFormData({ ...formData, store: store });
      setOtherStore(false);
    }
  };

  const handleCourierSelection = (e) => {
    const courier = e.target.value;
    if (courier === "other") {
      setOtherCourier(true);
      setFormData({ ...formData, courier: null });
    } else {
      setFormData({ ...formData, courier: courier });
      setOtherCourier(false);
    }
  };

  const handleAddPackage = () => {
    const newPackage = { ...packageData };
    const newPackcages = [...formData.packages, newPackage];
    setFormData({ ...formData, packages: newPackcages });
    setPackageData({
      id: packageId + 1,
      amount: 0,
      description: "",
    });
    setPackageId(packageId + 1);
  };

  useEffect(() => {
    
  }, [formData]);

  const handleSelectPackage = (actualPackage) => {
    setSelectedPackage(actualPackage);
  };

  const handleDeletePackage = () => {
    const newPackcages = formData.packages.filter(
      (com) => com.id != selectedPackage.id
    );
    setFormData({ ...formData, packages: newPackcages });
  };

  return (
    <div className="company-form release-order">
      <div className="row w-100">
        <div className="col-6">
          <div className="creation creation-container w-100">
            <div className="form-label_name">
              <h2>General</h2>
              <span></span>
            </div>
            <div className="row align-items-center">
              <div className="col-4 text-start">
                <label htmlFor="employee" className="form-label">
                  Client:
                </label>
                <AsyncSelect
                  id="client"
                  value={clients.find((option) => option.id == formData.client)}
                  onChange={(e) => {
                    setFormData({ ...formData, client: e.id });
                  }}
                  isClearable={true}
                  defaultOptions={clients}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                />

                <Input
                  type="text"
                  inputName="trackingNumber"
                  placeholder="Tracking number..."
                  value={formData.tracking_number}
                  changeHandler={(e) => {
                    setFormData({ ...formData, tracking_number: e.target.value });
                  }}
                  readonly={false}
                  label="Tracking Number"
                />
              </div>

              <div className="col-4 text-start">
                <label htmlFor="store" className="form-label">
                  Store:
                </label>
                <select
                  name="store"
                  id="store"
                  value = {formData.store}
                  onChange={(e) => {
                    handleStoreSelection(e);
                  }}
                >
                  <option value="">Select an Option</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Walmart">Walmart</option>
                  <option value="Costco">Costco</option>
                  <option value="Ebay">Ebay</option>
                  <option value="other">Other</option>
                </select>
                {otherStore && (
                  <Input
                    type="text"
                    inputName="store"
                    placeholder="Store name..."
                    value={formData.store}
                    readonly={false}
                    changeHandler={(e) =>
                      setFormData({ ...formData, store: e.target.value })
                    }
                    label=""
                  />
                )}

                <label htmlFor="courier" className="form-label">
                  Courier:
                </label>
                <select
                  name="courier"
                  id="courier"
                  value={formData.courier}
                  onChange={(e) => {
                    handleCourierSelection(e);
                  }}
                >
                  <option value="">Select an Option</option>
                  <option value="DHL">DHL</option>
                  <option value="USPS">USPS</option>
                  <option value="Fedex">Fedex</option>
                  <option value="UPS">UPS</option>
                  <option value="other">Other</option>
                </select>
                {otherCourier && (
                  <Input
                    type="text"
                    inputName="store"
                    placeholder="Store name..."
                    value={formData.courier}
                    changeHandler={(e) =>
                      setFormData({ ...formData, courier: e.target.value })
                    }
                    readonly={false}
                    label=""
                  />
                )}
              </div>
            </div>

            <div className="row">
              <Input
                type="number"
                inputName="amount"
                placeholder="Amount..."
                value={packageData.amount}
                readonly={false}
                changeHandler={(e) =>
                  setPackageData({ ...packageData, amount: e.target.value })
                }
                label="Amount"
              />
              <Input
                type="text"
                inputName="description"
                placeholder="Description..."
                value={packageData.description}
                readonly={false}
                changeHandler={(e) =>
                  setPackageData({
                    ...packageData,
                    description: e.target.value,
                  })
                }
                label="Description"
              />

              <button
                className="button-save pick "
                type="button"
                onClick={handleAddPackage}
              >
                <i className="fas fa-check-circle"></i>
              </button>
            </div>

            <div className="row align-items-center">
              <Table
                data={formData.packages}
                columns={["Amount", "Description", "Delete"]}
                onSelect={handleSelectPackage}
                selectedRow={selectedPackage}
                onDelete={handleDeletePackage}
                showOptions={false}
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
            {showSuccessAlert && (
              <Alert
                severity="success"
                onClose={() => setShowSuccessAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Success</AlertTitle>
                <strong>
                  Pre Alert {creating ? "created" : "updated"} successfully!
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
                  Error {creating ? "creating" : "updating"} Pre Alert. Please
                  try again
                </strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAlertCreationForm;
