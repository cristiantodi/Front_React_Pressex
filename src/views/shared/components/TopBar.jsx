import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
import TitleBar from "./TitleBar";

const Topbar = ({
  changeTheme,
  changeSidebarVisibility,
  title
}) => (
  <div className="topbar">
    <TitleBar title={title}/>

    <div className="topbar__wrapper">
      <div className="topbar__left">
        <TopbarSidebarButton
          changeSidebarVisibility={changeSidebarVisibility}
        />
        <Link className="topbar__logo" to="/dashboard" />
      </div>
      <div className="topbar__right">
        <TopbarProfile changeTheme={changeTheme} />
      </div>
    </div>
  </div>
);

Topbar.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
  changeSidebarVisibility: PropTypes.func.isRequired,
  changeTheme: PropTypes.func,
  title: PropTypes.string
};

Topbar.defaultProps = {
  changeMobileSidebarVisibility: () => "No changeMobileSidebarVisibility function defined",
  changeSidebarVisibility: () => "No changeSidebarVisibility function defined",
  changeTheme: () => "No changeTheme function defined",
  title: ""
};

export default Topbar;
