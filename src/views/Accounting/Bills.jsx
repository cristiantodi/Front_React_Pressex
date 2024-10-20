import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import Sidebar from "../shared/components/SideBar";
import { useModal } from "../../hooks/useModal";
import { GlobalContext } from "../../context/global";

import BillsCreationForm from "../forms/BillsCreationForm";
import BillsService from "../../services/BillsService";

import BillsPayForm from "../forms/BillsPayForm";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedBills, setSelectedBills] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const {hideShowSlider} = useContext(GlobalContext);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [createWarehouseReceipt, setCreateWarehouseReceipt] = useState(false); /////////
  const [currentPickupNumber, setcurrentPickupNumber] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [
    isOpenReceiptCreation,
    openModalReceiptCreation,
    closeModalReceiptCreation,
  ] = useModal(false);

  const columns = [
    "Number",
    // "Payment Terms",
    // "Type",
    "Applied to",
    "Transaction Date",
    "Due Date",
    "Employee",
    "Account Name",
    // "Exported",
    // "Amt. Paid(USD)",
    "Amt Due",
    "Currency",
    "Bill PDF",
  ];

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the browser's default context menu
    const clickX = e.clientX;
    const clickY = e.clientY;
    setContextMenuPosition({ x: clickX, y: clickY });
    setShowContextMenu(true);
  };

  const updateBill = (url = null) => {
    BillsService.getBills(url)
      .then((response) => {
        const newBill = response.data.results.filter((bill) => {
          const BillId = bill.id;
          return !bills.some(
            (existingPickupOrder) => existingPickupOrder.id === BillId
          );
        });

        setBills([...response.data.results].reverse());
        
        

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
      updateBill();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateBill(nextPageURL);
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

  const handleBillsDataChange = () => {
    updateBill();
  };

  const handleSelectBills = (bill) => {
    setSelectedBills(bill);
  };

  const handleEditBills = () => {
    if (selectedBills) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Bills to edit.");
    }
  };

  const handleAddBills = () => {
    openModal();
  };

  const handleDeleteBills = () => {
    if (selectedBills) {
      BillsService.deleteBill(selectedBills.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);

            const newBill = bills.filter(
              (order) => order.id !== selectedBills.id
            );
            setBills(newBill);
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
      alert("Please select a Bills to delete.");
    }
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
  }, [showContextMenu]);

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      if (!isPickupOrdersButton && !isTableRow && !createWarehouseReceipt && !isEdit) {
        
        setSelectedBills(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  },);

  const handlePayBills = () => {
    if (selectedBills) {
      openModal();
    } else {
      alert("Please select a Bills to edit.");
    }
  };


  useEffect(() => {
    if (createWarehouseReceipt) {
      
      openModalReceiptCreation();
    }
  }, [createWarehouseReceipt]);










  const contextMenuOptions = [
    {
      label: "Pay Bill",
      handler: () => setCreateWarehouseReceipt(true),
    },








  ];

  const handleClose = () => {
    window.location.reload();
  };

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
              data={bills}
              columns={columns}
              onSelect={handleSelectBills} // Make sure this line is correct
              selectedRow={selectedBills}
              onDelete={handleDeleteBills}
              onEdit={handleEditBills}
              onAdd={handleAddBills}
              contextMenuPosition={contextMenuPosition}
              contextMenuOptions={contextMenuOptions}
              handleContextMenu={handleContextMenu}
              showContextMenu={showContextMenu}
              setShowContextMenu={setShowContextMenu}
              importEnabled={false}
              importLabel={false}
              title="Bills"
            >
              {selectedBills === null && (
                <BillsCreationForm
                  bill={null}
                  closeModal={handleClose}
                  creating={true}
                  onbillDataChange={handleBillsDataChange}
                />
              )}

              {selectedBills !== null && (
                <BillsCreationForm
                  bill={selectedBills}
                  closeModal={handleClose}
                  creating={false}
                  onbillDataChange={handleBillsDataChange}
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
                <strong>Bills deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Bills. Please try again</strong>
              </Alert>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Bills;
