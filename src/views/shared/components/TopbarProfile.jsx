import {useState, useEffect} from 'react';
import TopbarMenuLink from './TopbarMenuLink';
import { useNavigate } from 'react-router-dom';
import { Collapse } from "reactstrap";
import PropTypes from "prop-types";


const TopbarProfile = ({ changeTheme }) => {
  const conf = JSON.parse(localStorage.getItem('config'));
  const [currentTheme, setCurrentTheme] = useState(conf === null || conf?.theme === "undefined" ? "theme-light" : conf.theme);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [nombre, setNombre] = useState("");
  const history = useNavigate();

  
  const toggleTheme = () => {
    let theme = currentTheme === "theme-light" ? "theme-dark" : "theme-light";

    setTheme(theme);
    handleToggleCollapse();
  }

  const setTheme = (theme) => {
    changeTheme(theme);
    setCurrentTheme(theme);
  }

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  }

  const BtnTheme = () => (<span className="topbar__link" onClick={() => toggleTheme()}>
    {currentTheme === "theme-light" ?
      <i className="fas fa-moon" style={{color: "#605f7b"}}></i>
      :
      <i className="fas fa-sun" style={{color: "#605f7b"}}></i>
    }
    <p className="topbar__link-title">{currentTheme === "theme-light" ? "profile.theme_dark" : "profile.theme_light"}</p>
  </span>);


  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));

    setTheme(currentTheme);
    setNombre(user ? user.name : "Sign In");
    if (user == null) {

    }
  }, []);

  return (
    <div className="topbar__profile">

      <button type="button" className="topbar__avatar" onClick={handleToggleCollapse}>
      <i className="fas fa-user-circle"></i>
        <p className="topbar__avatar-name">{nombre}</p>
        <i className="fas fa-arrow-down"></i>
      </button>

      {isCollapsed && (
        <button
          type="button"
          aria-label="button collapse"
          className="topbar__back"
          onClick={handleToggleCollapse}
        />
      )}

      <Collapse isOpen={isCollapsed} className="topbar__menu-wrap">
        <div className="topbar__menu">
          <BtnTheme />
          {/* <div className="topbar__menu-divider" /> */}
          {/* <TopbarMenuLink title="Page one" icon="list" path="/dashboard/one" /> */}
          <div className="topbar__menu-divider" />
          <TopbarMenuLink title={"profile.log_out"} icon="exit" path="/" />
        </div>
      </Collapse>

    </div>
  );
};

TopbarProfile.propTypes = {
    changeTheme: PropTypes.func.isRequired,
  };
  
  TopbarProfile.defaultProps = {
    changeTheme: () => "No changeTheme function defined",
  };
  

export default TopbarProfile;
