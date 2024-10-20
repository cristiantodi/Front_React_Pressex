
import Sidebar from "../shared/components/SideBar";
import "../../styles/components/style.scss"
import "../../styles/components/CarrierCreationForm.scss"
import { useNavigate } from "react-router-dom";


const MeasurementUnits = () => {

const navigate = useNavigate();

return (
    <div className="dashboard__layout">
    <div className="dashboard__sidebar sombra">
        <Sidebar />
        <div className="content-page">
        <div className="alin__width">
            <button className="back-button" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left fa-3x"></i>
            </button>
            <div className="title-container">
                <h1 className="title">Measurement Units</h1>
            </div>
        </div>
        
        <div className="company-form meaure">                
            <label htmlFor="" className="form-label">weight </label>
            <div className="alin">
                <select id="" className="form-input__exten">
                    <option value="kilo">Kilogramo(Kg)</option>
                    <option value="gram">Gram(g)</option>
                    <option value="ton">Ton(t)</option>
                    <option value="pound">Pound(ld)</option>
                    <option value="ounce">Ounce(oz)</option>
                    <option value="troy">Troy Ounce(ozt)</option>
                </select>
                <select id="" className="form-input__num">
                    <option value="Land">0</option>
                    <option value="Land">0.0</option>
                    <option value="Land">0.00</option>
                </select>
            </div>
            <div className="linea"></div>
            <label htmlFor="" className="form-label">Volume </label>
            <div className="alin">
                <select id="" className="form-input__exten">
                    <option value="cubic_m">Cubir meter(m3)</option>
                    <option value="cubic_i">Cubic inch(in3)</option>
                    <option value="cubic_f">Cubic foot(ft3)</option>
                    <option value="cubic_c">Cubic centimeter(cm3)</option>
                    <option value="liter">Liter(l)</option>
                </select>
                <select id="" className="form-input__num">
                    <option value="Land">0</option>
                    <option value="Land">0.0</option>
                    <option value="Land">0.00</option>
                </select>
            </div>
            <div className="linea"></div>
                <label htmlFor="" className="form-label">Area</label>
                <div className="alin">
                <select id="" className="form-input__exten">
                    <option value="squared_m">Squared Meter(m2)</option>
                    <option value="squared_i">Squared inch(in2)</option>
                    <option value="squared_f">Squared foot(ft2)</option>
                    <option value="squared_k">Squared Kilometer(km2)</option>
                    <option value="squared_c">Squared Centimeter(cm2)</option>
                    <option value="squared_d">Squared Decimeter(dm2)</option>
                </select>
                <select id="" className="form-input__num">
                    <option value="Land">0</option>
                    <option value="Land">0.0</option>
                    <option value="Land">0.00</option>
                </select>
            </div>
            <div className="linea"></div>
                <label htmlFor="" className="form-label">Volume Weight </label>
            <div className="alin">
                <select id="" className="form-input__exten">
                    <option value="cubic_m">Cubic meter(m3)</option>
                    <option value="cubic_f">Cubic foot(ft3)</option>
                    <option value="volume_p">Volume Pound(Vlb)</option>
                    <option value="volume_k">Volume Kilo(VKg)</option>
                    <option value="volume_g">Volum Gram(Vg)</option>
                    <option value="Volume_t">Volume Ton(Vt)</option>
                    <option value="Volume_o">Volume Ounce(Vt)</option>
                    <option value="Volume_troy">Volume Troy Ounce(Vozt)</option>
                </select>
                <select id="" className="form-input__num">
                    <option value="Land">0</option>
                    <option value="Land">0.0</option>
                    <option value="Land">0.00</option>
                </select>
            </div>
        </div>
        </div>
    </div>
    </div>
);
};

export default MeasurementUnits;
