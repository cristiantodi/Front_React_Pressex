import { useState, useEffect, useContext } from "react";
import ModalForm from "../shared/components/ModalForm";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useModal } from "../../hooks/useModal"; // Import the useModal hook
import CustomersCreationForm from "../forms/CustomerCreationForm";
import CustomerService from "../../services/CustomerService";
import Table from "../shared/components/Table";
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";

const Customers = () => {
  const [customers, setcustomers] = useState([]);
  const [isOpen, openModal, closeModal] = useModal(false);
  const [selectedCustomer, setselectedCustomer] = useState(null);
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
    // "Type ID",
    // "System ID",
    "Street & Number",
    "City",
    "State",
    "Country",
    "Zip-Code",
  ];
  const { hideShowSlider } = useContext(GlobalContext);
  const fetchCustomersData = (url = null) => {
    CustomerService.getCustomers(url)
      .then((response) => {
        if (customers !== response.data.results) {
          setcustomers([...customers, ...response.data.results].reverse());
        }
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
      fetchCustomersData();
      setInitialDataFetched(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPageURL) {

        fetchCustomersData(nextPageURL);
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
    fetchCustomersData();
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      openModal();
    } else {
      alert("Please select a Customer to edit.");
    }
  };

  const handleSelectCustomer = (wp) => {
    setselectedCustomer(wp);
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      CustomerService.deleteCustomer(selectedCustomer.id).then((response) => {
        if (response.status == 204) {
          setShowSuccessAlert(true);
          setTimeout(() => {
            setShowSuccessAlert(false);
          }, 1000);
          const newreceipts = customers.filter((order) => order.id !== selectedCustomer.id);
          setcustomers(newreceipts);
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
      alert("Please select a Employee to delete.");
    }
  };

  const handleAddCustomer = () => {
    openModal();
  };

  useEffect(() => {
    const handleWindowClick = (event) => {

      // const clickedElement = event.target;
      // const isWPButton = clickedElement.classList.contains("ne");
      // const isTableRow = clickedElement.closest(".table-row");

      // if (!isWPButton && !isTableRow) {
      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {
        setselectedCustomer(null);
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
              data={customers}
              columns={columns}
              onSelect={handleSelectCustomer} // Make sure this line is correct
              selectedRow={selectedCustomer}
              onDelete={handleDeleteCustomer}
              onEdit={handleEditCustomer}
              onAdd={handleAddCustomer}
              contextService={CustomerService}
              title="Customers"
            >
              {/* <CustomersCreationForm
              customer={selectedCustomer}
              closeModal={closeModal}
              creating={false}
              onCustomerDataChange={handleWarehouseProviderDataChange}
            /> */}
              {selectedCustomer !== null && (
                <CustomersCreationForm
                  customer={selectedCustomer}
                  closeModal={closeModal}
                  creating={false}
                  onCustomerDataChange={handleWarehouseProviderDataChange}
                />
              )}
              {selectedCustomer === null && (
                <CustomersCreationForm
                  customer={null}
                  closeModal={closeModal}
                  creating={true}
                  onCustomerDataChange={handleWarehouseProviderDataChange}
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
                <strong>Customer deleted successfully!</strong>
              </Alert>
            )}
            {showErrorAlert && (
              <Alert
                severity="error"
                onClose={() => setShowErrorAlert(false)}
                className="alert-notification"
              >
                <AlertTitle>Error</AlertTitle>
                <strong>Error deleting Customer. Please try again</strong>
              </Alert>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
