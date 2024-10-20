import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import InvoicesCreationForm from "../forms/InvoicesCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import InvoicesService from "../../services/InvoicesService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedInvoices, setSelectedInvoices] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const { hideShowSlider } = useContext(GlobalContext);
  const [isEdit, setIsEdit] = useState(false);
  const columns = [
    "Number",
    "Account Type",
    "Transaction Date",
    "Due Date",
    "Apply",
    "Payment Temse",
    "Amt Due",
    "Invoice PDF",
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  const updateInvoices = (url = null) => {
    InvoicesService.getInvoices(url)
      .then((response) => {
        const newInvoices = response.data.results.filter((invoice) => {
          const InvoiceId = invoice.id;
          return !invoices.some(
            (existingPickupOrder) => existingPickupOrder.id === InvoiceId
          );
        });

        setInvoices([...response.data.results].reverse());

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
      updateInvoices();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateInvoices(nextPageURL);
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

  const handleInvoicesDataChange = () => {
    updateInvoices();
  };

  const handleSelectInvoices = (invoice) => {
    setSelectedInvoices(invoice);
  };

  const handleEditInvoices = () => {
    if (selectedInvoices) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Invoice to edit.");
    }
  };

  useEffect(() => {

  }, [isEdit])


  const handleAddInvoices = () => {
    openModal();
  };

  const handleDeleteInvoices = () => {
    if (selectedInvoices) {
      InvoicesService.deleteInvoice(selectedInvoices.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);

            const newInvoices = invoices.filter((order) => order.id !== selectedInvoices.id);
            setInvoices(newInvoices);
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
      alert("Please select a Invoice to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {
      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      if (!isPickupOrdersButton && !isTableRow && !isEdit) {

        setSelectedInvoices(null);
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
              data={invoices}
              columns={columns}
              onSelect={handleSelectInvoices} // Make sure this line is correct
              selectedRow={selectedInvoices}
              onDelete={handleDeleteInvoices}
              onEdit={handleEditInvoices}
              onAdd={handleAddInvoices}
              importEnabled={false}
              title="Invoices"
              importLabel={false}
            >
              {selectedInvoices === null && (
                <InvoicesCreationForm
                  invoice={null}
                  closeModal={closeModal}
                  creating={true}
                  onInvoicesDataChange={handleInvoicesDataChange}
                />
              )}

              {selectedInvoices !== null && (
                <InvoicesCreationForm
                  invoice={selectedInvoices}
                  closeModal={closeModal}
                  creating={false}
                  onInvoicesDataChange={handleInvoicesDataChange}
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
                <strong>Invoices deleted successfully!</strong>
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
                  Error deleting Invoices. Please try again
                </strong>
              </Alert>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Invoices;
