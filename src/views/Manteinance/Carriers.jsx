import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import CarrierCreationForm from "../forms/CarrierCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import CarrierService from "../../services/CarrierService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Carrier = () => {
  const [carriers, setCarriers] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Name",
    "Phone",
    "Mobile Phone",
    "Email",
    "Fax",
    "Web Site",
    "Reference Number",
    "Contact First Name",
    "Contact Last Name",
    "ID",
    // "Type ID",
    // "System ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",
    // "Parent Account",
    // "Carrier Type",
    // "Method Code",
    // "Carrier Code",
    // "SCAC Number",
    // "IATA Code",
    // "Airline Code",
    // "Airline Prefix",
    // "Airway Bill Numbers",
    // "Passenger Only Airline",
  ];

  const {hideShowSlider} = useContext(GlobalContext);

  const updateCarriers = (url = null) => {
    CarrierService.getCarriers(url)
      .then((response) => {
        const newCarriers = response.data.results.filter((newCarrier) => {
          return !carriers.some((existingCarrier) => existingCarrier.id === newCarrier.id);
        });
  
        setCarriers([...carriers, ...newCarriers].reverse());

        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if(!initialDataFetched){
      updateCarriers();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateCarriers(nextPageURL);
      }
    });

    const lastRow = document.querySelector(".table-row:last-child");
    if (lastRow) {
      observer.observe(lastRow);
    }

    return () => {

      observer.disconnect();
    };
  }, [nextPageURL]);

  const handleCarrierDataChange = () => {
    updateCarriers();
  };

  const handleSelectCarrier = (carrier) => {
    setSelectedCarrier(carrier);
  };

  const handleEditCarrier = () => {
    if (selectedCarrier) {
      openModal();
    } else {
      alert("Please select a carrier to edit.");
    }
  };

  const handleAddCarrier = () => {
    openModal();
  };

  const handleDeleteCarrier = () => {
    if (selectedCarrier) {
      CarrierService.deleteCarrier(selectedCarrier.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = carriers.filter((order) => order.id !== selectedCarrier.id);
            setCarriers(newreceipts);
          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 1000);
          }
        })
        .catch((error) => {
          
        });
    } else {
      alert("Please select a carrier to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      // const clickedElement = event.target;
      // const isCarrierButton = clickedElement.classList.contains("ne");
      // const isTableRow = clickedElement.closest(".table-row");

      // if (!isCarrierButton && !isTableRow) {
      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {
        setSelectedCarrier(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <>
    <div className="dashboard__sidebar sombra">
      <div className="dashboard__sidebar sombra">
        <Sidebar />
      <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
        <Table
          data={carriers}
          columns={columns}
          onSelect={handleSelectCarrier} // Make sure this line is correct
          selectedRow={selectedCarrier}
          onDelete={handleDeleteCarrier}
          onEdit={handleEditCarrier}
          onAdd={handleAddCarrier}
          title="Carriers"
          contextService={CarrierService}
        >

             {selectedCarrier !== null && (
            <CarrierCreationForm
              carrier={selectedCarrier}
              closeModal={closeModal}
              creating={false}
              onCarrierDataChange={handleCarrierDataChange}
            />
        )}

        {selectedCarrier === null && (
            <CarrierCreationForm
              carrier={null}
              closeModal={closeModal}
              creating={true}
              onCarrierDataChange={handleCarrierDataChange}
            />
        )}
            </Table>

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Carrier deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Carrier. Please try again</strong>
          </Alert>
        )}

       
        </div>
      </div>
    </div>
    </>
  );
};

export default Carrier;