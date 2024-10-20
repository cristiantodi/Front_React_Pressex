import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import VendorsCreationForm from "../forms/VendorCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import VendorService from "../../services/VendorService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Vendors = () => {
  const [vendors, setvendors] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedVendor, setselectedVendor] = useState(null);
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
    "Type ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",

    "System ID",
  ];
  const {hideShowSlider} = useContext(GlobalContext);
  const fetchvendorsData = (url = null) => {
    VendorService.getVendors(url)
      .then((response) => {
        setvendors([...vendors, ...response.data.results].reverse());
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
      fetchvendorsData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchvendorsData(nextPageURL);
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

  const handleVendorsDataChange = () => {
    fetchvendorsData();
  };

  const handleEditVendor = () => {
    if (selectedVendor) {
      openModal();
    } else {
      alert("Please select a Vendor to edit.");
    }
  };

  const handleSelectVendor = (wp) => {
    setselectedVendor(wp);
  };

  const handleAddVendor = () => {
    openModal();
  };

  const handleDeleteVendor = () => {
    if (selectedVendor) {
      VendorService.deleteVendor(selectedVendor.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = vendors.filter((order) => order.id !== selectedVendor.id);
            setvendors(newreceipts);
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
      alert("Please select a Vendor to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      // const clickedElement = event.target;
      // const isWPButton = clickedElement.classList.contains("ne");
      // const isTableRow = clickedElement.closest(".table-row");

      // if (!isWPButton && !isTableRow) {
      const contextMenu = document.querySelector(".context-menu");
        if (contextMenu && !contextMenu.contains(e.target)) {
        setselectedVendor(null);
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
          data={vendors}
          columns={columns}
          onSelect={handleSelectVendor} // Make sure this line is correct
          selectedRow={selectedVendor}
          onDelete={handleDeleteVendor}
          onEdit={handleEditVendor}
          onAdd={handleAddVendor}
          contextService={VendorService}
          title="Vendors"
        >
           {/* <VendorsCreationForm
              vendor={selectedVendor}
              closeModal={closeModal}
              creating={false}
              onvendorDataChange={handleVendorsDataChange}
            /> */}
              {selectedVendor !== null && (
            <VendorsCreationForm
              vendor={selectedVendor}
              closeModal={closeModal}
              creating={false}
              onvendorDataChange={handleVendorsDataChange}
            />
        )}
        {selectedVendor === null && (
            <VendorsCreationForm
              vendor={null}
              closeModal={closeModal}
              creating={true}
              onvendorDataChange={handleVendorsDataChange}
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
            <strong>Vendor deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Vendor. Please try again</strong>
          </Alert>
        )}
      
        </div>
      </div>
    </div>
    </>
  );
};

export default Vendors;
