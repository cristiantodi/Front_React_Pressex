import { useState, useEffect } from "react";
import propTypes from "prop-types"; // Import propTypes from 'prop-types'
import "../../styles/components/IncomeChargeForm.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Input from "../shared/components/Input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EventCreationForm = ({ onCancel, events, setevents }) => {
  const today = dayjs().format("YYYY-MM-DD hh:mm A");
  const formFormat = {
    dateTime: today,
    eventType: "",
    details: "",
    location: "",
    createIn: "WareHouse Receipt",
    createOn: today,
    includeInTracking: false,
  };
  const [Eventype, setEventype] = useState("");
  const [formData, setformData] = useState(formFormat);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Initialize internalID to the next available ID
  const [internalID, setinternalID] = useState(events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1);


  const addEvent = () => {
    // Convertir createdDateAndTime a ISO 8601
    const isoDate = dayjs(formData.dateTime,"YYYY-MM-DD hh:mm A").toISOString();
    // # Obtener la fecha y la hora por separado
    let dataCreation = new Date(isoDate);
    let year = dataCreation.getFullYear();
    let month = String(dataCreation.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
    let day = String(dataCreation.getDate()).padStart(2, '0');
    let hours = dataCreation.getHours();
    let minutes = String(dataCreation.getMinutes()).padStart(2, '0');
    // Determinar AM o PM
    let ampm = hours >= 12 ? 'Pm' : 'Am';
    // Convertir horas de 24 horas a 12 horas
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 debería ser 12
    // Formato: YYYY-MM-DD HH:MM AM/PM
    let formattedDateTime = `${day}/${month}/${year}-${hours}:${minutes}${ampm}`;

//-----------------------
    const isopickupDate = dayjs(formData.createOn, "YYYY-MM-DD hh:mm A").toISOString();
    // # Obtener la fecha y la hora por separado
    let pickData = new Date(isopickupDate);
    let pickyear = pickData.getFullYear();
    let pickmonth = String(pickData.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
    let pickday = String(pickData.getDate()).padStart(2, '0');
    let pickhours = pickData.getHours();
    let pickminutes = String(pickData.getMinutes()).padStart(2, '0');
    // Determinar AM o PM
    let pickampm = pickhours >= 12 ? 'Pm' : 'Am';
    // Convertir horas de 24 horas a 12 horas
    pickhours = pickhours % 12;
    pickhours = pickhours ? pickhours : 12; // La hora 0 debería ser 12
    // Formato: YYYY-MM-DD HH:MM AM/PM
    let pickformattedDateTime = `${pickday}/${pickmonth}/${pickyear} - ${pickhours}:${pickminutes} ${pickampm}`;


    const body = {
      id: internalID,
      creation_date: isoDate,
      creation_text_date: formattedDateTime,
      eventType: formData.eventType,
      details: formData.details,
      location: formData.location,
      createIn: formData.createIn,
      createOn: pickformattedDateTime,
      includeInTracking: formData.includeInTracking,
    };
    setevents([...events, body]);
    // Increment internalID after adding the event
    setinternalID(internalID + 1);
  };

  const handleeventType = (type) => {
    setEventype(type);
    setformData({ ...formData, eventType: type });
  };

  const handlelocation = (type) => {
    setEventype(type);
    setformData({ ...formData, location: type });
  };

  return (
    <div className="income-charge-form">
      <div>
        <div className="form-row">
          <div className="form-column-create">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <p
                id="creation-date"
                className="text-date"
                style={{ fontSize: "4rem" }}
              >
                Entry Date and Time
              </p>
              <DateTimePicker
                className="font-right"
                value={dayjs(formData.dateTime)}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    dateTime: dayjs(e).format("YYYY-MM-DD hh:mm A"),
                  })
                }
              />
            </LocalizationProvider>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column-create">
            <label className="text-comm">Event Type:</label>
            <select
              name="eventType"
              id="eventType"
              style={{ height: "3rem", padding: "0px" }}
              value={formData.eventType}
              onChange={(e) => handleeventType(e.target.value)}
            >
              <option value="">Select Event Type ...</option>
              <option value="Arrived at Destination">
                Arrived at Destination
              </option>
              <option value="Arrived at Warehouse">Arrived at Warehouse</option>
              <option value="Arrived at Warehouse MIA">
                Arrived at Warehouse MIA
              </option>
              <option value="Cargo has been picked">
                Cargo has been picked
              </option>
              <option value="Cargo scanned in">Cargo scanned in</option>
              <option value="Cargo scanned out">Cargo scanned out</option>
              <option value="Cargo status update">Cargo status update</option>
              <option value="Customs Entry / Inicio Aduana">
                Customs Entry / Inicio Aduana
              </option>
              <option value="Customs On-Hold">Customs On-Hold</option>
              <option value="Customs Release / Liberación">
                Customs Release / Liberación
              </option>
              <option value="Delivered to Consignee">
                Delivered to Consignee
              </option>
              <option value="Entry Status Update">Entry Status Update</option>
              <option value="External Tracking Update">
                External Tracking Update
              </option>
              <option value="In Transit">In Transit</option>
              <option value="In Bond (7512)">In Bond (7512)</option>
              <option value="Origin Document">Origin Document</option>
              <option value="Package Available for Pickup">
                Package Available for Pickup
              </option>
              <option value="Package Cancelled">Package Cancelled</option>
              <option value="Package Delivered">Package Delivered</option>
              <option value="Package Error">Package Error</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-column-create">
            <label htmlFor="details" className="text-comm">
              Details:
            </label>
            <input
              name="details"
              type="text"
              className="form-input"
              placeholder="Details..."
              value={formData.details}
              onChange={(e) =>
                setformData({ ...formData, details: e.target.value })
              }
              style={{ width: "100%", height: "3rem", padding: "0px 5px" }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-column-create">
            <label className="text-comm">Location:</label>
            <select
              name="location"
              id="eventType"
              style={{ height: "3rem", padding: "0px 5px" }}
              value={formData.location}
              onChange={(e) => handlelocation(e.target.value)}
            >
              <option value="">Select Location ...</option>
              <option value="Acajutla">Acajutla</option>
              <option value="Alajuela">Alajuela</option>
              <option value="Ambarli">Ambarli</option>{" "}
              <option value="Arica">Arica</option>
              <option value="ATLANTA">Atlanta</option>{" "}
              <option value="Balboa">Balboa</option>
              <option value="Baltimore">Baltimore</option>{" "}
              <option value="Barranquilla">Barranquilla</option>
              <option value="Bogota">Bogota</option>{" "}
              <option value="Bridgeport">Bridgeport</option>
              <option value="Brooklyn">Brooklyn</option>{" "}
              <option value="Bucaramanga">Bucaramanga</option>
              <option value="Cali">Cali</option>{" "}
              <option value="Cambria">Cambria</option>
              <option value="Caracas">Caracas</option>{" "}
              <option value="Carson">Carson</option>
              <option value="Cartagena">Cartagena</option>{" "}
              <option value="Centerville">Centerville</option>
              <option value="Chester">Chester</option>{" "}
              <option value="Charleston">Charleston</option>
              <option value="Chicago">Chicago</option>{" "}
              <option value="Columbus">Columbus</option>
              <option value="Detroit">Detroit</option>{" "}
              <option value="Douglassville">Douglassville</option>
              <option value="Guayaquil">Guayaquil</option>{" "}
              <option value="Guayaquil">Guayaquil</option>
              <option value="Hilliard">Hilliard</option>{" "}
              <option value="Houston">Houston</option>
              <option value="Kingston">Kingston</option>{" "}
              <option value="Las Vegas">Las Vegas</option>
              <option value="Lima">Lima</option>{" "}
              <option value="Lisboa">Lisboa</option>
              <option value="London">London</option>{" "}
              <option value="Madrid">Madrid</option>
              <option value="Maracaibo">Maracaibo</option>{" "}
              <option value="Marlboro">Marlboro</option>
              <option value="Miami">Miami</option>{" "}
              <option value="Middleton">Middleton</option>
              <option value="Montevideo">Montevideo</option>{" "}
              <option value="Mulberry">Mulberry</option>
              <option value="New York">New York</option>{" "}
              <option value="Norfolk">Norfolk</option>
              <option value="OAKLAND">Oakland</option>{" "}
              <option value="Orlando">Orlando</option>
              <option value="Pasadena">Pasadena</option>
              <option value="Philadelphia">Philadel</option>
              <option value="Quito">Quito</option>
              <option value="Reedsburg">Reedsburg</option>
              <option value="Santiago">Santiago</option>
              <option value="Savannah">Savannah</option>
              <option value="Summerville">Summerville</option>
              <option value="Tampa">Tampa</option>
              <option value="Washington">Washington</option>
              <option value="Wilmington"></option>
            </select>
          </div>
        </div>
        <div
          className="form-row"
          style={{ width: "12vw", alignItems: "center", marginLeft: "13px" }}
        >
          <div className="form-column-create">
            <Input
              inputName="includeTracking"
              changeHandler={(e) =>
                setformData({
                  ...formData,
                  includeInTracking: e.target.checked,
                })
              }
              label="Include in Tracking"
              name="includeTracking"
              type="checkbox"
            ></Input>
           
          </div>
        </div>

        <div
          className="form-row"
          style={{ width: "8vw", marginTop: "5px", marginLeft: "-11px" }}
        >
          <div className="form-column-create">
            <div
              className="table-hover charge-buttons"
              style={{ textAlign: "left" }}
            >
              <button
                className="button-save pick "
                style={{ marginRight: "10px" }}
                type="button"
                onClick={addEvent}
              >
                <i className="fas fa-check-circle"></i>
              </button>
             {/*  <button
                className="button-cancel pick "
                type="button"
                onClick={() => onCancel(false)}
              >
                <i className="fas fa-times-circle"></i>
              </button> */}
            </div>
          </div>
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

EventCreationForm.propTypes = {
  onCancel: propTypes.func,
  events: propTypes.array,
};

EventCreationForm.defaultProps = {
  onCancel: null,
  events: [],
};

export default EventCreationForm;
