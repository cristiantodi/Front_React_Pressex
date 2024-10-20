import { useContext } from "react";
import "../../../styles/components/DashboardReport.scss";
import alerta from "../../../img/alerta.png";
import mensaje from "../../../img/mensaje.png";
import paquete from "../../../img/paquete.png";
import graficaBarra from "../../../img/graficaBarras.png";
import graficaCircular from "../../../img/graficaCircular.png";
import iconoTrend from "../../../img/icons8-grafico-64.png";
import { GlobalContext } from "../../../context/global";

const DashboardReport = () => {
  const { hideShowSlider } = useContext(GlobalContext);
  return (
    <div
      className="dashboard-container"
      style={
        !hideShowSlider ? { marginLeft: "32rem" } : { marginInline: "auto" }
      }
    >
      <header>
        <div>
          <h2>Reporte de casilleros</h2>
        </div>

        <div className="reporte-casilleros mb-3">
          <div>
            <div>Total casilleros</div>
            <div>
              <p>
                883 <span>Creados</span>
              </p>
            </div>
          </div>

          <div>
            <div>Nuevos</div>
            <div>
              <p>
                {" "}
                1 <span>Este mes</span>
              </p>
            </div>
          </div>
        </div>
        <div className="reporte-casilleros">
          <div>
            <div>Nuevos</div>
            <div>
              <p>
                {" "}
                1 <span>Este mes</span>
              </p>
            </div>
          </div>

          <div>
            <div>Creados</div>
            <div>
              <p>
                {" "}
                0 <span>Hoy</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <article>
        <div>
          <div>
            <div>
              <h3>Paquetes en bodega</h3> 
            </div>
            <div>
              <p>146.000</p>
              <img src={paquete} alt="" />
            </div>
            <div>
              <p>
                <img src={iconoTrend} alt="Nada" />
                17% <span>Since last week</span>
              </p>
            </div>
          </div>

          <div>
            <div>
              <h3>Solicitudes de envio</h3> 
            </div>
            <div>
              <p>150.700</p>
              <img src={mensaje} alt="" />
            </div>
            <div>
              <p>
                <img src={iconoTrend} alt="Nada" />
                17% <span>Since last week</span>
              </p>
            </div>
          </div>
        </div>

        {/* <div>
          <div>
            <div>
              <h3>Pre-alertas</h3> <img src={alerta} alt="" />
            </div>
            <div>
              <p>1.400</p>
            </div>
            <div>
              <p>
                <img src={iconoTrend} alt="Nada" />
                17% <span>Since last week</span>
              </p>
            </div>
          </div>
        </div> */}

        <div>
          <div>
            <div>
              <h3>Recent Workflow</h3>
            </div>
            <div>
              <p>
                <img src={iconoTrend} alt="" />
                17% <img src={graficaCircular} alt="" />
              </p>
            </div>
          </div>

          <div>
            <div>
              <h3>Recent Marketing</h3>
            </div>
            <div>
              <p>
                <img src={iconoTrend} alt="" />
                17% <img className="grafica-barras" src={graficaBarra} alt="" />
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default DashboardReport;
