import { useState, useEffect, useContext } from "react";
import Table from "../shared/components/Table"
import CountriesService from "../../services/CountriesService"
import Sidebar from "../shared/components/SideBar";
import { GlobalContext } from "../../context/global";


const Countries = () => {
  const [countries, setcountries] = useState([]);
  const {hideShowSlider} = useContext(GlobalContext);
  
  const fetchcountriesData = () => {
    CountriesService.fetchCountries()
    .then((response) => {
        setcountries(response.data);
    })
    .catch((error) => {
        
    })
    };

  useEffect(() => {
    fetchcountriesData();
  }, []);

  return (
    <>
    <div className="dashboard__layout">
      <div className="dashboard__sidebar sombra">
        <Sidebar />
    <div className="content-page" style={!hideShowSlider ? { marginLeft: "22rem", width: "calc(100vw - 250px)" } : { marginInline: "auto" }}>
      <Table
        data={countries}
        columns={["Name", "Code"]}
        onSelect={()=>{return ''}}
        selectedRow={null}
        onDelete={()=>{return ''}}
        onEdit={()=>{return ''}}
        onAdd={()=>{return ''}}
        title="Countries"
      />
        </div>
      </div>
    </div>
    </>
  );
};

export default Countries;
