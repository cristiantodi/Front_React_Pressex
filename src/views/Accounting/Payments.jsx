import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import Sidebar from "../shared/components/SideBar";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import { GlobalContext } from "../../context/global";
import PaymentsCreationForm from "../forms/PaymentsCreationForm";
import PaymentsService from "../../services/PaymentsService";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedPayments, setSelectedPayments] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { hideShowSlider } = useContext(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);
  const columns = [
    "Number",
    "Entipy",
    "Transaction Date",
    "employee",
    "AR Amount",
    "Acount Name",
    "Exported",
    "Is Deposited",
    "Memo",
    "Back Acount",
    "Reconciliation Date",
  ];

  const updatePayment = (url = null) => {
    PaymentsService.getPayments(url)
      .then((response) => {
        const newPaymentsTerms = response.data.results.filter(
          (PaymentsTerms) => {
            const PaymentsTermsId = PaymentsTerms.id;
            return !payments.some(
              (existingPaymentsTerms) =>
                existingPaymentsTerms.id === PaymentsTermsId
            );
          }
        );

        setPayments([...response.data.results].reverse());

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
      updatePayment();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePayment(nextPageURL);
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

  const handlePaymentsDataChange = () => {
    updatePayment();
  };

  const handleSelectPayments = (payments) => {
    setSelectedPayments(payments);
  };

  const handleEditPayments = () => {
    if (selectedPayments) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Payments to edit.");
    }
  };

  const handleAddPayments = () => {
    openModal();
  };

  const handleDeletePayments = () => {
    if (selectedPayments) {
      PaymentsService.deletePayment(selectedPayments.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);

            const newPaymentsTerms = payments.filter(
              (order) => order.id !== selectedPayments.id
            );
            setPayments(newPaymentsTerms);
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
      alert("Please select a Payments to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isPaymentsButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPaymentsButton && !isTableRow && !isEdit) {
        setSelectedPayments(null);
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
          <div
            className="content-page"
            style={
              !hideShowSlider
                ? { marginLeft: "22rem", width: "calc(100vw - 250px)" }
                : { marginInline: "auto" }
            }
          >
            <Table
              data={payments}
              columns={columns}
              onSelect={handleSelectPayments} // Make sure this line is correct
              selectedRow={selectedPayments}
              onDelete={handleDeletePayments}
              onEdit={handleEditPayments}
              onAdd={handleAddPayments}
              importEnabled={false}
              importLabel={false}
              title="Payments"
            >
              {selectedPayments !== null && (
                <PaymentsCreationForm
                  payments={selectedPayments}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentDataChange={handlePaymentsDataChange}
                />
              )}

              {selectedPayments === null && (
                <PaymentsCreationForm
                  payments={null}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentDataChange={handlePaymentsDataChange}
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
                <strong>Payments deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Payments. Please try again</strong>
              </Alert>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
