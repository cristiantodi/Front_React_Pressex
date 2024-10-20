import { useState, useEffect } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import PaymentTermsCreationForms from "../forms/PaymentTermsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import PaymentTermsService from "../../services/PaymentTermsService";
import Sidebar from "../shared/components/SideBar";
import ReceiptCreationForm from "../forms/ReceiptCreationForm";


const PaymentTerms  = () => {
  const [paymentOfTerms, setpaymentOfTerms] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [isOpenReceiptCreation, openModalReceiptCreation, closeModalReceiptCreation] = useModal(false);
  const [selectedPaymentOfTerm, setSelectedPaymentOfTerm] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = [
    "Description",
    "Due Days",
    "Discount Percentage",
    "Discount Days",

  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {

      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {

        setShowContextMenu(false);
      }
    };


    document.addEventListener("click", handleDocumentClick);


    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showContextMenu]); // Only re-add the event listener when showContextMenu changes

  const updatePaymentTerms = (url = null) => {
    PaymentTermsService.getPaymentTerms(url)
      .then((response) => {
        const newPickupOrders = response.data.results.filter((paymentTerms) => {
          const paymentTermId = paymentTerms.id;
          return !paymentOfTerms.some(
            (existingPickupOrder) => existingPickupOrder.id === paymentTermId
          );
        });

        setpaymentOfTerms([...response.data.results].reverse());
        


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
      updatePaymentTerms();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    if (initialDataFetched) {
      const number = paymentOfTerms[paymentOfTerms.length - 1]?.number || 0;
      setcurrentPickupNumber(number + 1);
    }
  }, [paymentOfTerms]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updatePaymentTerms(nextPageURL);
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

  const handlePickupOrdersDataChange = () => {
    updatePaymentTerms();
  };

  const handleSelectPaymentOfTerms = (PickupOrder) => {
    setSelectedPaymentOfTerm(PickupOrder);
  };

  const handleEditPaymentOfTerms = () => {
    if (selectedPaymentOfTerm) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a PaymentTerms  Order to edit.");
    }
  };

  const handleAddPaymentOfTerm = () => {
    openModal();
  };

  const handleDeletePaymentOfTerm = () => {
    if (selectedPaymentOfTerm) {
      PaymentTermsService.deletePaymentTerm(selectedPaymentOfTerm.id)
        .then((response) => {
          if (response.status == 204) {
            const newPickupOrders = paymentOfTerms.filter(
              (order) => order.id !== selectedPaymentOfTerm.id
            );
            setpaymentOfTerms(newPickupOrders);
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);

            const newDeposits = DepositsService.filter((order) => order.id !== selectedDeposits.id);
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
      alert("Please select a PaymentTerms  Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");

      if (!isPickupOrdersButton && !isTableRow && !isEdit) {
        setSelectedPaymentOfTerm(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  }, []);







  

  const contextMenuOptions = [
    {
      label: "Create Warehouse Receipt",
      handler: () => setCreateWarehouseReceipt(true)
    },
    {
      label: "Option 2",
      handler: () => {

      },
    },
    {
      label: "Option 3",
      handler: () => {

      },
    },
  ];

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar sombra">
          <Sidebar />
          <div className="content-page">
            <Table
              data={paymentOfTerms}
              columns={columns}
              onSelect={handleSelectPaymentOfTerms} // Make sure this line is correct
              selectedRow={selectedPaymentOfTerm}
              onDelete={handleDeletePaymentOfTerm}
              onEdit={handleEditPaymentOfTerms}
              onAdd={handleAddPaymentOfTerm}
              title="Payments Terms"
              setData={setpaymentOfTerms}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              contextMenuPosition={contextMenuPosition}
              setShowContextMenu={setShowContextMenu}
              contextMenuOptions={contextMenuOptions}
            >
               {selectedPaymentOfTerm !== null && (
                <PaymentTermsCreationForms
                  paymentTerms={selectedPaymentOfTerm}
                  closeModal={closeModal}
                  creating={false}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
            )}

            {selectedPaymentOfTerm === null && (
                <PaymentTermsCreationForms
                  paymentTerms={null}
                  closeModal={closeModal}
                  creating={true}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                />
            )}

            {selectedPaymentOfTerm !== null && createWarehouseReceipt && (

                <ReceiptCreationForm
                  paymentTerms={selectedPaymentOfTerm}

                  creating={true}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                  fromPickUp={true}
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
                <strong>Payment Terms deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Payment Terms. Please try again</strong>
              </Alert>
            )}

            {selectedPaymentOfTerm !== null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForms
                  paymentTerms={selectedPaymentOfTerm}
                  closeModal={closeModal}
                  creating={false}

                />
              </ModalForm>
            )}

            {selectedPaymentOfTerm === null && (
              <ModalForm isOpen={isOpen} closeModal={closeModal}>
                <PaymentTermsCreationForms
                  paymentTerms={null}
                  closeModal={closeModal}
                  creating={true}

                />
              </ModalForm>
            )}
{/* 
            {selectedPaymentOfTerm !== null && createWarehouseReceipt && (
              <ModalForm isOpen={isOpenReceiptCreation} closeModal={closeModalReceiptCreation}>
                <ReceiptCreationForm
                  paymentTerms={selectedPaymentOfTerm}
                  closeModal={closeModalReceiptCreation}
                  creating={true}
                  onpaymentTermDataChange={handlePickupOrdersDataChange}
                  currentPickUpNumber={currentPickupNumber}
                  setcurrentPickUpNumber={setcurrentPickupNumber}
                  fromPickUp={true}
                />
              </ModalForm>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentTerms ;
