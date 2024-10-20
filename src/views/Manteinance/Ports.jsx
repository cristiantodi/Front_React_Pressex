import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PortsCreationForm from "../forms/PortCreationForms";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PortService from "../../services/PortServices";
import Sidebar from "../shared/components/SideBar";
import PortServices from "../../services/PortServices";
import { GlobalContext } from "../../context/global";

const Ports = () => {
  const [ports, setports] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPort, setselectedPort] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const columns = [
    "Code",
    "Name",
    // "Method",
    "Country",
    "Subdivision",
    "Used",
    // "Remarks",
    "Maritime",
    "Rail",
    "Road",
    "Air",
    // "Mail",
    // "Border Crossing Point",
    "US Customs Code",
  ];
  const { hideShowSlider } = useContext(GlobalContext);
  const fetchportsData = (url = null) => {
    PortService.getPorts(url)
      .then((response) => {
        setports([...ports, ...response.data.results].reverse());
        if (response.data.next) {
          setNextPageURL(response.data.next);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!initialDataFetched) {
      fetchportsData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        fetchportsData(nextPageURL);
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

  const handleportsDataChange = () => {
    fetchportsData();
  };

  const handleEditPort = () => {
    if (selectedPort) {
      openModal();
    } else {
      alert("Please select a Port to edit.");
    }
  };

  const handleSelectPort = (wp) => {
    setselectedPort(wp);
  };

  const handleAddPort = () => {
    openModal();
  };

  const handleDeletePort = () => {
    if (selectedPort) {
      PortService.deletePort(selectedPort.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
            const newreceipts = ports.filter(
              (order) => order.id !== selectedPort.id
            );
            setports(newreceipts);
          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 1000);
          }
        })
        .catch((error) => {});
    } else {
      alert("Please select a Port to delete.");
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
        setselectedPort(null);
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
          <div
            className="content-page"
            style={
              !hideShowSlider
                ? { marginLeft: "22rem", width: "calc(100vw - 250px)" }
                : { marginInline: "auto" }
            }
          >
            <Table
              data={ports}
              columns={columns}
              onSelect={handleSelectPort} // Make sure this line is correct
              selectedRow={selectedPort}
              onDelete={handleDeletePort}
              onEdit={handleEditPort}
              onAdd={handleAddPort}
              contextService={PortServices}
              title="Ports"
            >
              {/* <PortsCreationForm
            port={selectedPort}
            closeModal={closeModal}
            creating={false}
            onPortDataChange={handleportsDataChange}
          /> */}
              {selectedPort !== null && (
                <PortsCreationForm
                  port={selectedPort}
                  closeModal={closeModal}
                  creating={false}
                  onPortDataChange={handleportsDataChange}
                />
              )}
              {selectedPort === null && (
                <PortsCreationForm
                  port={null}
                  closeModal={closeModal}
                  creating={true}
                  onPortDataChange={handleportsDataChange}
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
                <strong>Port deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Port. Please try again</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ports;
