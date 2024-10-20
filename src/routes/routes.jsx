import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../views/Login";
import Home from "../views/Home";
import Dashboard from "../views/Dashboard";
import Maintenance from "../views/Manteinance/Maintenance";
import Carriers from "../views/Manteinance/Carriers";
import WarehouseProviders from "../views/Manteinance/WarehouseProviders";
import ForwardingAgents from "../views/Manteinance/ForwardingAgents";
import Customers from "../views/Manteinance/Customers";
import Vendors from "../views/Manteinance/Vendors";
import Employees from "../views/Manteinance/Employees";
import PackageType from "../views/Manteinance/PackageType";
import Ports from "../views/Manteinance/Ports";
import Countries from "../views/Manteinance/Countries";
import Locations from "../views/Manteinance/Locations";
import Pickup from "../views/Warehouse/Pickup";
import ItemsAndServices from "../views/Accounting/ItemsAndServices";
import Receipt from "../views/Warehouse/Receipt";
import Release from "../views/Warehouse/Release";
import MeasurementUnits from "../views/Configuration/MeasurementUnits";
import ChartOfAccounts from "../views/Accounting/ChartOfAccounts";
import Invoices from "../views/Accounting/Invoices";
import PaymentTerms from "../views/Configuration/PaymentTerms";
import Payments from "../views/Accounting/Payments";
import Bills from "../views/Accounting/Bills";
import Deposits from "../views/Accounting/Deposits";
import Repacking from "../views/Warehouse/Repacking";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthProvider } from "../hooks/useAuth";
import PreAlerts from "../views/Warehouse/PreAlerts";
export const RoutesConfiguration = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/carriers"
            element={
              <ProtectedRoute>
                <Carriers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/warehouseProviders"
            element={
              <ProtectedRoute>
                <WarehouseProviders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/forwardingAgents"
            element={
              <ProtectedRoute>
                <ForwardingAgents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/vendors"
            element={
              <ProtectedRoute>
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/packageTypes"
            element={
              <ProtectedRoute>
                <PackageType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/ports"
            element={
              <ProtectedRoute>
                <Ports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/countries"
            element={
              <ProtectedRoute>
                <Countries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance/locations"
            element={
              <ProtectedRoute>
                <Locations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/pickup"
            element={
              <ProtectedRoute>
                <Pickup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/receipt"
            element={
              <ProtectedRoute>
                <Receipt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/release"
            element={
              <ProtectedRoute>
                <Release />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/repacking"
            element={
              <ProtectedRoute>
                <Repacking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/prealerts"
            element={
              <ProtectedRoute>
                <PreAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/itemsandservices"
            element={
              <ProtectedRoute>
                <ItemsAndServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuration/measurementunits"
            element={
              <ProtectedRoute>
                <MeasurementUnits />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/chartofaccounts"
            element={
              <ProtectedRoute>
                <ChartOfAccounts />
              </ProtectedRoute>
            }
          />
          <Route path="/accounting/Invoices" element={<Invoices />} />
          <Route
            path="/Configuration/PaymentTerms"
            element={
              <ProtectedRoute>
                <PaymentTerms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/Payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/Payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/Bills"
            element={
              <ProtectedRoute>
                <Bills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting/Deposits"
            element={
              <ProtectedRoute>
                <Deposits />
              </ProtectedRoute>
            }
          />
      </Routes>
      </AuthProvider>
    </Router>
  );
};
