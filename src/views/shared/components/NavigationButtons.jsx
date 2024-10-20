import "../../../styles/components/NavigationButtons.scss"
const NavigationButtons = ({ icon, text }) => {
    return (<div className="navigation-buttons__container">
        <div>
            {icon && (<img src={icon} alt="New Reception" />)}
            {text && (<p>{text}</p>)}
        </div>
    </div>)
}

export default NavigationButtons

