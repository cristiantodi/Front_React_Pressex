import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import Sidebar from "../shared/components/SideBar";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import DepositsCreationForm from "../forms/DepositsCreationForm";
import DepositsService from "../../services/DepositsService";
import { GlobalContext } from "../../context/global";


const Deposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedDeposits, setSelectedDeposits] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { hideShowSlider } = useContext(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);
  const columns = [
    "Date",
    // "Employee",
    "Bank Account",
    "Amount (USB)",
    "Memo",
    "Reconciliation Date",
    "Deposit PDF",
  ];
  const updateDeposit = (url = null) => {
    DepositsService.getDeposits(url)
      .then((response) => {

        setDeposits([...response.data.results].reverse());

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
      updateDeposit();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateDeposit(nextPageURL);
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

  const handleDepositsDataChange = () => {
    updateDeposit();
  };

  const handleSelectDeposits = (deposit) => {
    setSelectedDeposits(deposit);
  };

  const handleEditDeposits = () => {
    if (selectedDeposits) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Deposits to edit.");
    }
  };

  const handleAddDeposits = () => {
    openModal();
  };

  const handleDeleteDeposits = () => {
    if (selectedDeposits) {
      DepositsService.deleteDeposit(selectedDeposits.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);

            const newDeposits = deposits.filter((order) => order.id !== selectedDeposits.id);
            setDeposits(newDeposits);
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
      alert("Please select a Deposits to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isDepositsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isDepositsButton && !isTableRow && !isEdit) {
        setSelectedDeposits(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  },);

  return (
    <>
      <div className="dashboard__sidebar sombra">
        <div className="dashboard__sidebar sombra">
          <Sidebar />
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              data={deposits}
              columns={columns}
              onSelect={handleSelectDeposits} // Make sure this line is correct
              selectedRow={selectedDeposits}
              onDelete={handleDeleteDeposits}
              onEdit={handleEditDeposits}
              onAdd={handleAddDeposits}
              title="Deposits"
              importEnabled={false}
              importLabel={false}
            >
              {selectedDeposits === null && (

                <DepositsCreationForm
                  deposit={null}
                  closeModal={closeModal}
                  creating={true}
                  ondepositDataChange={handleDepositsDataChange}
                />

              )}

              {selectedDeposits !== null && (

                <DepositsCreationForm
                  deposit={selectedDeposits}
                  closeModal={closeModal}
                  creating={false}
                  ondepositDataChange={handleDepositsDataChange}
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
                <strong>Deposits deleted successfully!</strong>
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
                  Error deleting Deposits. Please try again
                </strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposits;