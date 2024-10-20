const ContextMenu = ({ x, y, onClose, options }) => {
  const handleAndClose = (option) => {
    option();
    onClose();
  };

  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        top: `20vw`, // Establece 15vw como valor para la propiedad top
      }}
    >
      <ul>
        {options.map((option, index) => (
          <li
            disabled={option.disabled}
            key={index}
            className="ne"
            onClick={() => {
              handleAndClose(option.handler);
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
