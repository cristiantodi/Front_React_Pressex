import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PackageTypesCreationForm from "../forms/PackageTypeCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PackageTypeService from "../../services/PackageTypeService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const PackageType = () => {
  const [packageTypes, setpackageTypes] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPackageType, setselectedPackageType] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Description",
    "Length",
    "Height",
    "Width",
    "Weight",
    "Volume",
    "Max. Weight",
    "Type",
    "Type Code",
    "Container Code",
    "Container Type",
    "Ground",
    "Air",
    "Ocean",
  ];
  const {hideShowSlider} = useContext(GlobalContext);
  const fetchpackageTypesData = (url = null) => {
    PackageTypeService.getPackageTypes(url)
      .then((response) => {
        setpackageTypes([...packageTypes, ...response.data.results].reverse());
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
      fetchpackageTypesData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchpackageTypesData(nextPageURL);
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

  const handlepackageTypesDataChange = () => {
    fetchpackageTypesData();
  };

  const handleEditPackageType = () => {
    if (selectedPackageType) {
      openModal();
    } else {
      alert("Please select a Package Type to edit.");
    }
  };

  const handleSelectPackageType = (wp) => {
    setselectedPackageType(wp);
  };

  const handleAddPackageType = () => {
    openModal();
  };

  const handleDeletePackageType = () => {
    if (selectedPackageType) {
      PackageTypeService.deletePackageType(selectedPackageType.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = packageTypes.filter((order) => order.id !== selectedPackageType.id);
            setpackageTypes(newreceipts);
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
      alert("Please select a Package Type to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isWPButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isWPButton && !isTableRow) {
        setselectedPackageType(null);
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
          data={packageTypes}
          columns={columns}
          onSelect={handleSelectPackageType} // Make sure this line is correct
          selectedRow={selectedPackageType}
          onDelete={handleDeletePackageType}
          onEdit={handleEditPackageType}
          onAdd={handleAddPackageType}
          contextService={PackageTypeService}
          title="Package Types"
        >
           <PackageTypesCreationForm
              packageType={selectedPackageType}
              closeModal={closeModal}
              creating={false}
              onpackageTypeDataChange={handlepackageTypesDataChange}
            />
             {selectedPackageType !== null && (
            <PackageTypesCreationForm
              packageType={selectedPackageType}
              closeModal={closeModal}
              creating={false}
              onpackageTypeDataChange={handlepackageTypesDataChange}
            />
        )}
        {selectedPackageType === null && (
            <PackageTypesCreationForm
              packageType={null}
              closeModal={closeModal}
              creating={true}
              onpackageTypeDataChange={handlepackageTypesDataChange}
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
            <strong>Package Type deleted successfully!</strong>
          </Alert>
        )}
        {showErrorAlert && (
          <Alert
            severity="error"
            onClose={() => setShowErrorAlert(false)}
            className="alert-notification"
          >
            <AlertTitle>Error</AlertTitle>
            <strong>Error deleting Package Type. Please try again</strong>
          </Alert>
        )}
       
        </div>
      </div>
    </div>
    </>
  );
};

export default PackageType;
