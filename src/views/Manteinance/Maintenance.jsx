import Sidebar from "../shared/components/SideBar";
import ModalForm from "../shared/components/ModalForm";
import { useModal } from "../../hooks/useModal";
import { Link } from "react-router-dom";
import "../../styles/pages/Maintenance.scss"


const Maintenance = () => {
  const [isOpenStartupWizard, openStartupWizard, closeStartupWizard] =
    useModal(false);

  return (
    <div className="maintenance__layout">
      <aside className="maintenance__aside">
        <div className="maintenance__logo"></div>
        <Sidebar />
      </aside>
      <main className="maintenance__content">
        <Sidebar />
        <h3 className="maintenance__title">Maintenance</h3>

        <div className="maintenance__section">
          <div className="maintenance__option">
            <Link to={"/maintenance/carriers"}>
              <div className="">Carriers</div>
              <i className="maintenance__icon fa-solid fa-truck-ramp-box"></i>
            </Link>
          </div>

          <div className="maintenance__option">
            <Link to={"/maintenance/forwardingAgents"}>
              <div className="maintenance__subtitle">Agents</div>
              <i className=" maintenance__icon fa-solid fa-user-tie"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/vendors"}>
              <div className="maintenance__subtitle">Vendors</div>
              <i className=" maintenance__icon fa-solid fa-suitcase"> </i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/customers"}>
              <div className="maintenance__subtitle">Customers</div>
              <i className=" maintenance__icon fa-regular fa-address-card"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/employees"}>
              <div className="maintenance__subtitle">Employee</div>
              <i className=" maintenance__icon fa-solid fa-user-gear"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/ports"}>
              <div className="maintenance__subtitle">Ports</div>
              <i className=" maintenance__icon fa-solid fa-anchor"></i>
            </Link>
          </div>
          <div className="maintenance__option" onClick={openStartupWizard}>
            <div className="maintenance__subtitle">Company</div>
            <ModalForm
              isOpen={isOpenStartupWizard}
              closeModal={closeStartupWizard}
            >
              <div>HOLA MUNDO</div>
            </ModalForm>
            <i className=" maintenance__icon fa-solid fa-building"></i>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/packageTypes"}>
              <div className="maintenance__subtitle">Package Type</div>
              <i className=" maintenance__icon fa-solid fa-boxes-packing"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/countries"}>
              <div className="maintenance__subtitle">Countries</div>
              <i className=" maintenance__icon fa-solid fa-earth-americas"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/warehouseProviders"}>
              <div className="maintenance__subtitle">Warehouse Providers</div>
              <i className=" maintenance__icon fa-solid fa-industry"></i>
            </Link>
          </div>
          <div className="maintenance__option">
            <Link to={"/maintenance/locations"}>
              <div className="maintenance__subtitle">Locations</div>
              <i className=" maintenance__icon fa-solid fa-location"></i>
            </Link>
          </div>
        </div>
        <h3 className="maintenance__title">Configuration</h3>
        <div className="maintenance__section">
          <div className="maintenance__option">
            <div className="maintenance__subtitle">Option</div>
            <i className=" maintenance__icon fa-regular fa-address-card"></i>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Maintenance;
