import "../styles/pages/Dashboard.scss";
import Sidebar from "./shared/components/SideBar"
import { useState, useEffect } from "react";
import TRMService from "../services/TRMService";
import HeaderDashboard from "./shared/components/HeaderDashboard";
import DashboardReport from "./shared/components/DashboardReport";
const Dashboard = () => {

  const [TRM, setTRM] = useState(0);
  const getTRM = async () => {
    const response = await TRMService.getTRMToday();
    
    setTRM(response.data[0].valor);
  }
  useEffect(() => {
    getTRM();
  }, [])
  
  return (
    <div className="dashboard__layout sombra">
      <div className="dashboard__sidebar sombra">
        <Sidebar />
        <HeaderDashboard />
        <DashboardReport />
      </div>
    </div>
  );
};

export default Dashboard;
