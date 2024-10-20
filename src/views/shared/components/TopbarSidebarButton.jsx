import PropTypes from "prop-types";

const TopbarSidebarButton = ({ changeSidebarVisibility }) => (
  <div>
    <button
      type="button"
      className="topbar__button topbar__button--desktop"
      onClick={changeSidebarVisibility}
    >
      <i className="fas fa-bars"></i>
    </button>
  </div>
);

TopbarSidebarButton.propTypes = {
  changeSidebarVisibility: PropTypes.func.isRequired,
};

TopbarSidebarButton.defaultProps = {
  changeSidebarVisibility: () => "No changeSidebarVisibility function defined",
};

export default TopbarSidebarButton;
