import { useContext } from "react"
import NavigationButtons from "./NavigationButtons"
import BUTTONS_LIST from "../../../constants/dashboard"
import "../../../styles/components/HeaderDashboard.scss"
import { GlobalContext } from "../../../context/global"

const HeaderDashboard = () => {
    const { hideShowSlider } = useContext(GlobalContext)

    return (<div className="header-dashboard__container" style={!hideShowSlider ? { marginLeft: "32rem" } : { marginInline: "auto" }}>
        <header>
            <div>
                <h1>HOME</h1>
                <h3>Welcome to Integral</h3>
            </div>
            <div>
                <input type="search" placeholder="Search" />
                <div className="aviso">Tasa Representativa del mercado: $4761.64</div>
            </div>

        </header>


        <article>
            {BUTTONS_LIST.map((options) => (
                <NavigationButtons icon={options.icon} text={options.name} />
            ))}



        </article>
    </div>)
}

export default HeaderDashboard