import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import LocationsCreationForm from "../forms/LocationCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import LocationService from "../../services/LocationService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Locations = () => {
  const [locations, setlocations] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedLocation, setselectedLocation] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Status",
    "Code",
    "Description",
    "Empty",
    "Type",
    "Zone",
    "Length",
    "Width",
    "Height",
    "Volume",
    "Weight",
    "Max. Weight",
    "Disable",
  ];

  const {hideShowSlider} = useContext(GlobalContext);
  const fetchlocationsData = (url = null) => {
    LocationService.getLocations(url)
      .then((response) => {
        setlocations([...locations, ...response.data.results].reverse());
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
      fetchlocationsData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchlocationsData(nextPageURL);
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

  const handlelocationsDataChange = () => {
    fetchlocationsData();
  };

  const handleAddLocation = () => {
    openModal();
  };

  const handleEditLocation = () => {
    if (selectedLocation) {
      openModal();
    } else {
      alert("Please select a Location to edit.");
    }
  };

  const handleSelectLocation = (wp) => {
    setselectedLocation(wp);
  };

  const handleDeleteLocation = () => {
    if (selectedLocation) {
      LocationService.deleteLocation(selectedLocation.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = locations.filter((order) => order.id !== selectedLocation.id);
            setlocations(newreceipts);
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
      alert("Please select a Location to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".locations-table__row");

      if (!isWPButton && !isTableRow) {
        setselectedLocation(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <>
    <div className="dashboard__layout">
      <div className="dashboard__sidebar sombra">
        <Sidebar />
      <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
        <Table
          data={locations}
          columns={columns}
          onSelect={handleSelectLocation} // Make sure this line is correct
          selectedRow={selectedLocation}
          onDelete={handleDeleteLocation}
          onEdit={handleEditLocation}
          onAdd={handleAddLocation}
          contextService={LocationService}
          title="Locations"
        >
          <LocationsCreationForm
              location={selectedLocation}
              closeModal={closeModal}
              creating={false}
              onlocationDataChange={handlelocationsDataChange}
            />
            </Table>

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Location deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Location. Please try again</strong>
          </Alert>
        )}
        {selectedLocation !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <LocationsCreationForm
              location={selectedLocation}
              closeModal={closeModal}
              creating={false}
              onlocationDataChange={handlelocationsDataChange}
            />
          </ModalForm>
        )}
        {selectedLocation === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <LocationsCreationForm
              location={null}
              closeModal={closeModal}
              creating={true}
              onlocationDataChange={handlelocationsDataChange}
            />
          </ModalForm>
        )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Locations;
