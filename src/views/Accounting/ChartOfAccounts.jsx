import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import ModalForm from "../shared/components/ModalForm";
import ChartOfAccountsCreationForm from "../forms/ChartOfAccountsCreationForm";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import ChartOfAccountsService from "../../services/ChartOfAccountsService";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const ChartOfAccounts = () => {
  const [chartofAccounts, setChartOfAccounts] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedChartOfAccounts, setSelectedChartOfAccounts] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nextPageURL, setNextPageURL] = useState("");
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = [
    "Name",
    "Type Chart",
    "Account Number",
    "Currency",
    "Note",

  ];

  const { hideShowSlider } = useContext(GlobalContext);

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

  const updateChartOfAccounts = (url = null) => {
    ChartOfAccountsService.getChartOfAccounts(url)
      .then((response) => {
        const newChartOfAccounts = response.data.results.filter((chartOfAccounts) => {
          const ChartAccountId = chartOfAccounts.id;
          return !chartofAccounts.some(
            (existingPickupOrder) => existingPickupOrder.id === ChartAccountId
          );
        });

        setChartOfAccounts([...response.data.results].reverse());


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
      updateChartOfAccounts();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {
        updateChartOfAccounts(nextPageURL);
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

  const handleChartOfAccountDataChange = () => {
    updateChartOfAccounts();
  };

  const handleSelectChartOfAccounts = (PickupOrder) => {
    setSelectedChartOfAccounts(PickupOrder);
  };

  const handleEditChartOfAccounts = () => {
    if (selectedChartOfAccounts) {
      setIsEdit(true);
      openModal();
    } else {
      alert("Please select a Chart Of Accounts to edit.");
    }
  };

  const handleAddChartOfAccounts = () => {
    openModal();
  };

  const handleDeleteChartOfAccounts = () => {
    if (selectedChartOfAccounts) {
      ChartOfAccountsService.deleteChartOfAccounts(selectedChartOfAccounts.id)
        .then((response) => {
          if (response.status == 204) {
            setShowSuccessAlert(true);
            setTimeout(() => {
              setShowSuccessAlert(false);
            }, 1000);
          } else {
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 1000);
          }
        })
        .catch((error) => {
          console.error(error)
        });
    } else {
      alert("Please select a Chart Of Accounts   Order to delete.");
    }
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      const clickedElement = event.target;
      const isPickupOrdersButton = clickedElement.classList.contains("ne");
      const isTableRow = clickedElement.closest(".table-row");
      if (!isPickupOrdersButton && !isTableRow && !isEdit) {
        setSelectedChartOfAccounts(null);
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {

      window.removeEventListener("click", handleWindowClick);
    };
  },);

  return (
    <>
      <div className="dashboard__layout">
        <div className="dashboard__sidebar sombra">
          <Sidebar />
          <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
            <Table
              id='table1'
              data={chartofAccounts}
              columns={columns}
              onSelect={handleSelectChartOfAccounts} // Make sure this line is correct
              selectedRow={selectedChartOfAccounts}
              onDelete={handleDeleteChartOfAccounts}
              onEdit={handleEditChartOfAccounts}
              onAdd={handleAddChartOfAccounts}
              title="Chart Of Accounts"
              setData={setChartOfAccounts}
              showContextMenu={showContextMenu}
              setShowContextMenu={setShowContextMenu}
              importEnabled={false}
              importLabel={false}
              
            >
              {selectedChartOfAccounts === null && (
                <ChartOfAccountsCreationForm
                  chartOfAccounts={null}
                  closeModal={closeModal}
                  creating={true}
                  onDataChange={handleChartOfAccountDataChange}
                />
              )}

              {selectedChartOfAccounts !== null && (
                <ChartOfAccountsCreationForm
                  chartOfAccounts={selectedChartOfAccounts}
                  closeModal={closeModal}
                  creating={false}
                  onDataChange={handleChartOfAccountDataChange}
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
                <strong>Chart Of Account deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Chart Of Account. Please try again</strong>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartOfAccounts;
