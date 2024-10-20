import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import WarehouseProviderCreationForm from "../forms/WarehouseProviderCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import WarehouseProviderService from "../../services/WarehouseProviderService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const WarehouseProviders = () => { 
  const [warehouseProviders, setwarehouseProviders] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedWarehouseProvider, setselectedWarehouseProvider] =
    useState(null);
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
    "Website",
    "Reference Number",
    "Contact First Name",
    "Contact Last Name",
    "ID",
    "Type ID",
    "System ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",
  ];
  const {hideShowSlider} = useContext(GlobalContext);
  const fetchWarehouseProvidersData = (url = null) => {
    WarehouseProviderService.getWarehouseProviders(url)
      .then((response) => {
        setwarehouseProviders([...warehouseProviders, ...response.data.results].reverse());
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
      fetchWarehouseProvidersData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchWarehouseProvidersData(nextPageURL);
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
  const handleWarehouseProviderDataChange = () => {
    fetchWarehouseProvidersData();
  };

  const handleEditWarehouseProvider = () => {
    if (selectedWarehouseProvider) {
      openModal();
    } else {
      alert("Please select a warehouse provider to edit.");
    }
  };

  const handleSelectWarehouseProvider = (wp) => {
    setselectedWarehouseProvider(wp);
  };

  const handleAddWarehouseProvider = () => {
    openModal();
  };

  const handleDeleteWarehouseProvider = () => {
    if (selectedWarehouseProvider) {
      WarehouseProviderService.deleteWarehouseProvider(
        selectedWarehouseProvider.id
      )
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = WarehouseProviders.filter((order) => order.id !== selectedWarehouseProvider.id);
            setwarehouseProviders(newreceipts);
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
      alert("Please select a warehouse provider to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedWarehouseProvider(null);
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
      <div className="content-page" style={!hideShowSlider ? { marginLeft: "21rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
        <Table
          data={warehouseProviders}
          columns={columns}
          onSelect={handleSelectWarehouseProvider} // Make sure this line is correct
          selectedRow={selectedWarehouseProvider}
          onDelete={handleDeleteWarehouseProvider}
          onEdit={handleEditWarehouseProvider}
          onAdd={handleAddWarehouseProvider}
          contextService={WarehouseProviderService}
          title="Warehouse Providers"
        >
          <WarehouseProviderCreationForm
              warehouseProvider={selectedWarehouseProvider}
              closeModal={closeModal}
              creating={false}
              onWarehouseProviderDataChange={handleWarehouseProviderDataChange}
            />
            </Table>

        {showSuccessAlert && (
          <Alert
            severity="success"
            onClose={() => setShowSuccessAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Success</AlertTitle>
            <strong>Warehouse Provider deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Warehouse Provider. Please try again</strong>
          </Alert>
        )}
        {selectedWarehouseProvider !== null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <WarehouseProviderCreationForm
              warehouseProvider={selectedWarehouseProvider}
              closeModal={closeModal}
              creating={false}
              onWarehouseProviderDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        {selectedWarehouseProvider === null && (
          <ModalForm isOpen={isOpen} closeModal={closeModal}>
            <WarehouseProviderCreationForm
              warehouseProvider={null}
              closeModal={closeModal}
              creating={true}
              onWarehouseProviderDataChange={handleWarehouseProviderDataChange}
            />
          </ModalForm>
        )}
        </div>
      </div>
    </div>
    </>
  );
};

export default WarehouseProviders;
