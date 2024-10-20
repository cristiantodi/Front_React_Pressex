import "../../../styles/components/NavBar.scss";
const NavBar = () => {
  return (
    <div className="navbar__layout">
      <div className="profile__card">
        <h3 className="profile__username">username</h3>
        <i className="profile__icon fa-regular fa-address-card"></i>
      </div>
    </div>
  );
};

export default NavBar;
