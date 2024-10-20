import { useState, useEffect, useRef } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import CurrenciesService from "../../services/CurrencyService";
import ItemsAndServicesService from "../../services/ItemsAndServicesService";
import Input from "../shared/components/Input";
import { Padding } from "@mui/icons-material";

const ExpenseChargeForm = ({
  onCancel,
  charges,
  setcharges,
  commodities,
  consignee,
  agent,
  shipper,
  editing,
  charge,
}) => {



  const [currencies, setcurrencies] = useState([]);
  const [itemsAndServices, setitemsAndServices] = useState([]);
  const [internalID, setinternalID] = useState(0);

  const formFormat = {
    type: "expense",
    charge: "",
    currency: "",
    applyTo: "",
    applyBy: "weight",
    paidAs: "",
    numberOfPieces: 0,
    grossWeight: 0,
    weightUnit: "lbs",
    rateCharge: "",
    grossVolume: 0,
    volumeUnit: "ft3",
    chargeableWeight: 0,
    totalAmount: 0,
    show: false,
    description: "",
    status: 15,
  };

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input7Ref = useRef(null);
  const input8Ref = useRef(null);
  const input9Ref = useRef(null);
  const input10Ref = useRef(null);
  const input11Ref = useRef(null);
  const input12Ref = useRef(null);
  const input13Ref = useRef(null);
  const input14Ref = useRef(null);
  const input15Ref = useRef(null);

  const handleKeyDown = (event, nextInputRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextInputRef.current.focus();
    }
  };

  const [formData, setformData] = useState(formFormat);
  useEffect(() => {
    CurrenciesService.getCurrencies()
      .then((response) => {
        setcurrencies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching currencies:", error);
      });

    ItemsAndServicesService.getItemsAndServices()
      .then((response) => {
        setitemsAndServices(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching Items and Services:", error);
      });
  }, []);

  useEffect(() => {

    let initialNumberOfPieces = 0;
    let initialGrossWeight = 0;
    let initialGrossVolume = 0;
    let initialChargeableWeight = 0;

    if (commodities && commodities.length > 0) {
      commodities.forEach((commodity) => {
        initialNumberOfPieces += 1; // Puedes ajustar esto según tus necesidades
        initialGrossWeight += parseFloat(commodity.weight);
        initialGrossVolume += commodity.volumetricWeight;
        initialChargeableWeight += parseFloat(commodity.chargedWeight);
      });
    }


    setformData({
      ...formData,
      numberOfPieces: initialNumberOfPieces,
      grossWeight: initialGrossWeight,
      grossVolume: initialGrossVolume,
      chargeableWeight: initialChargeableWeight,
    });


  }, [commodities]);



  const createCharge = () => {
    onCancel(true);
    const body = {
      id: internalID,
      ...formData,
      quantity: 1,
    };

    if (editing) {
      const indexToEdit = charges.findIndex((comm) => comm.id == charge.id);
      const copy = [...charges];
      copy[indexToEdit] = body;
      setcharges(copy);
    } else {
      setcharges([...charges, body]);
      setinternalID(internalID + 1);
    }
    setformData(formFormat);
  };

  useEffect(() => {
    if (editing) {
      const formFormat = {
        type: charge.type,
        charge: charge.charge,
        currency: charge.currency,
        applyTo: charge.applyTo,
        applyBy: charge.applyBy,
        paidAs: charge.paidAs,
        numberOfPieces: charge.numberOfPieces,
        grossWeight: charge.grossWeight,
        weightUnit: charge.weightUnit,
        rateCharge: charge.rateCharge,
        grossVolume: charge.grossVolume,
        volumeUnit: charge.volumeUnit,
        chargeableWeight: charge.chargeableWeight,
        totalAmount: charge.totalAmount,
        show: charge.show,
        status: charge.status,
        description: charge.description,
      };
      setformData(formFormat);
    }

  }, []);

  const handleChargeRateChange = (e) => {
    let unit = 0;
    const rate = e.target.value;
    if (formData.applyBy === "pieces") {
      unit = formData.numberOfPieces;
    }
    if (formData.applyBy === "weight") {
      unit = formData.grossWeight;
    }
    if (formData.applyBy === "volume") {
      unit = formData.grossVolume;
    }
    if (formData.applyBy === "container") {
      unit = formData.numberOfPieces;
    }
    const total = unit * rate;
    setformData({ ...formData, rateCharge: rate, totalAmount: total });
  };
  return (
    <div className="income-charge-form">
      <h2 className=" tab-pane">Expense Charge Form</h2>

      <div className="row w-100 mb-3">
        <div className="col-6">
          <label htmlFor="charge" className="text-comm">
            Freight Service Class
          </label>
          <select
            id="charge"
            className="form-input"
            value={formData.charge}
            onChange={(e) =>
              setformData({ ...formData, charge: e.target.value })
            }
            ref={input1Ref}
            onKeyDown={(e) => handleKeyDown(e, input2Ref)}
          >
            {/* Add options for charge */}
            <option value="">Select an option</option>
            {itemsAndServices.map((code) => (
              <option key={code.id} value={code.id}>
                {code.code}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6">
          <label htmlFor="applyTo" className="text-comm  tab-pane">
            Apply to
          </label>
          <select
            id="applyTo"
            className="form-input"
            value={formData.applyTo}
            onChange={(e) =>
              setformData({ ...formData, applyTo: e.target.value })
            }
            ref={input2Ref}
            onKeyDown={(e) => handleKeyDown(e, input3Ref)}
          >
            {/* Add options for applyTo */}
            <option value="">Select an option</option>
            {consignee && (
              <option value={consignee.id} data-key="consignee">
                {consignee.name}
              </option>
            )}
            {agent && (
              <option value={agent.id} data-key="agent">
                {agent.name}
              </option>
            )}
            {shipper && (
              <option value={shipper.id} data-key="shipper">
                {shipper.name}
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="row w-100 mb-3">
        <div className="col-6">
          <label htmlFor="currency" className="text-comm">
            Currency
          </label>
          <select
            id="currency"
            className="form-input"
            value={formData.currency}
            onChange={(e) =>
              setformData({ ...formData, currency: e.target.value })
            }
            ref={input3Ref}
            onKeyDown={(e) => handleKeyDown(e, input4Ref)}
          >
            <option value="">Select a currency</option>
            {Object.entries(currencies).map(([currencyCode, currencyName]) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode} - {currencyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6">
          <label htmlFor="paidAs" className="text-comm  tab-pane">
            Paid as
          </label>
          <select
            id="paidAs"
            className="form-input"
            value={formData.paidAs}
            onChange={(e) =>
              setformData({ ...formData, paidAs: e.target.value })
            }
            ref={input4Ref}
            onKeyDown={(e) => handleKeyDown(e, input5Ref)}
          >
            {/* Add options for paidAs */}
            <option value="prepaid">Prepaid</option>
            <option value="collect">Collect</option>
          </select>
        </div>
      </div>

      <div className="containerr">
        <div className="cont-one">
          <div className="col-12">
            <label htmlFor="description" className="text-comm">
              Description:
            </label>
            <input
            style={{
              width: "97%",
              display: "flow",
            }}
              name="description"
              type="text"
              className="form-input"
              placeholder="Description..."
              value={formData.description}
              onChange={(e) =>
                setformData({ ...formData, description: e.target.value })
              }
              ref={input5Ref}
              onKeyDown={(e) => handleKeyDown(e, input6Ref)}
            />
          </div>

          <div className="row w-100 mb-2">
          <div className="col-4">
            <label htmlFor="numberOfPieces" className="text-comm">
              No. of Pieces
            </label>
            <input

              className="form-input"
              type="number"
              id="numberOfPieces"
              readOnly={
                formData.applyBy !== "pieces" && formData.applyBy !== "container"
              }
              value={formData.numberOfPieces}
              onChange={(e) =>
                setformData({ ...formData, numberOfPieces: e.target.value })
              }
              ref={input6Ref}
              onKeyDown={(e) => handleKeyDown(e, input7Ref)}
            />
          </div>

          <div className="col-4">
            <label htmlFor="grossWeight" className="text-comm">
              Gross Weight
            </label>
            <div className="input-space">
              <input
                className="with-space"
                type="number"
                id="grossWeight"
                readOnly={formData.applyBy !== "weight"}
                value={formData.grossWeight}
                onChange={(e) =>
                  setformData({ ...formData, grossWeight: e.target.value })
                }
                ref={input7Ref}
                onKeyDown={(e) => handleKeyDown(e, input8Ref)}
              />
              <select
                className="add-select"
                id="weightUnit"
                value={formData.weightUnit}
                onChange={(e) =>
                  setformData({ ...formData, weightUnit: e.target.value })
                }
                ref={input8Ref}
                onKeyDown={(e) => handleKeyDown(e, input9Ref)}
              >
                <option value="kgs">kgs</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          <div className="col-4">
            <label htmlFor="grossVolume" className="text-comm">
              Gross Volume
            </label>
            <div className="input-space">
              <input
                className="with-space"
                style={{
                  backgroundColor: `${formData.applyBy === "volume" ? "" : "lightgray"
                    }`,
                  marginRight: "0px",
                }}
                type="number"
                id="grossVolume"
                readOnly={formData.applyBy !== "volume"}
                value={formData.grossVolume}
                onChange={(e) =>
                  setformData({ ...formData, grossVolume: e.target.value })
                }
                ref={input9Ref}
                onKeyDown={(e) => handleKeyDown(e, input10Ref)}
              />
              <select
                className="add-select"
                id="volumeUnit"
                value={formData.volumeUnit}
                onChange={(e) =>
                  setformData({ ...formData, volumeUnit: e.target.value })
                }
                ref={input10Ref}
                onKeyDown={(e) => handleKeyDown(e, input11Ref)}
              >
                <option value="ft3">ft3</option>
                <option value="m3">m3</option>
              </select>
            </div>
          </div>
          </div>
        </div>
        <div className="row w-100">

          
        <div className="row w-100" style={{paddingRight: "0px"}}>
          <div className="col-6" style={{padding: "0px"}}>
            <label htmlFor="applyBy" className="text-comm">
              Apply By
            </label>
            <select
              className="form-input"
              id="applyBy"
              value={formData.applyBy}
              onChange={(e) =>
                setformData({ ...formData, applyBy: e.target.value })
              }
              ref={input11Ref}
              onKeyDown={(e) => handleKeyDown(e, input12Ref)}
            >
              {/* Add options for applyBy */}
              <option value="weight">Weight</option>
              <option value="pieces">Pieces</option>
              <option value="volume">Volume</option>
              <option value="container">Container</option>
            </select>
          </div>
          
          <div className="col-6">
            <label htmlFor="chargeableWeight" className="text-comm">
              Chargeable Weight (vlb)
            </label>
            <input
              className="form-input"
              readOnly
              id="chargeableWeight"
              value={formData.chargeableWeight}
              onChange={(e) =>
                setformData({ ...formData, chargeableWeight: e.target.value })
              }
              ref={input12Ref}
              onKeyDown={(e) => handleKeyDown(e, input13Ref)}
            />
          </div>
          </div>

          <div className="row w-100 mb-3" style={{paddingRight: "0px"}}>
          <div className="col-6" style={{padding: "0px"}}>
            <label htmlFor="rateCharge" className="text-comm">
              Rate Charge
            </label>
            <input
              className="form-input"
              type="number"
              id="rateCharge"
              value={formData.rateCharge}
              onChange={(e) => handleChargeRateChange(e)}
              ref={input13Ref}
              onKeyDown={(e) => handleKeyDown(e, input14Ref)}
            />
          </div>

          <div className="col-6">
            <label htmlFor="totalAmount" className="text-comm">
              Total Amount
            </label>
            <input
              className="form-input"
              type="number"
              id="totalAmount"
              readOnly
              value={formData.totalAmount}
              onChange={(e) =>
                setformData({ ...formData, totalAmount: e.target.value })
              }
              ref={input14Ref}
              onKeyDown={(e) => handleKeyDown(e, input15Ref)}
            />
          </div>
          </div>
          

        </div>
      </div>
      <div className="form-row">
        <div className="form-column">
          <Input
            type="checkbox"
            inputName="showInDocument"
            value={formData.show}
            changeHandler={(e) =>
              setformData({ ...formData, show: e.target.checked })
            }
            label="Show in document"
            ref={input15Ref}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="table-hover charge-buttons">
          <button
            className="button-save__change"
            style={{ marginRight: "10px" }}
            type="button"
            onClick={createCharge}
          >
            Create Charge
          </button>
          <button
            className="button-cancel"
            type="button"
            onClick={() => onCancel(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

ExpenseChargeForm.propTypes = {
  onCancel: propTypes.func,
};

ExpenseChargeForm.defaultProps = {
  onCancel: null,
};

export default ExpenseChargeForm;