import PropTypes from "prop-types";
const Input = (props) => {
  let inputElement;
  let labelElement;

  switch (props.type) {
    case "textarea":
      inputElement = (
        <textarea id={props.inputName}
          className="form-textarea"
          name={props.inputName}
          rows="4"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}
        />
      );
      break;
    case "checkbox":
      inputElement = (
        <input id={props.inputName}
          className="form-checkbox form-check-input"
          name={props.inputName}
          type="checkbox"
          checked={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}
        />
      );
      break;
    case "number":
      inputElement = (
        <input id={props.inputName}
          className="form-input"
          name={props.inputName}
          type="number"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}
        />
      );
      break;
    case "email":
      inputElement = (
        <input id={props.inputName}
          className="form-input"
          name={props.inputName}
          type="email"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}
        />
      );
      break;
    case "text":
      inputElement = (
        <input id={props.inputName}
          className="form-input"
          name={props.inputName}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}
        />
      );
      break;
    default:
      inputElement = (
        <input id={props.inputName}
          className="form-input"
          name={props.inputName}
          type="text"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.changeHandler}
          readOnly={props.readOnly || false}

        />
      );
      break;
  }

  if (props.label) {
    labelElement = <label className="form-label">{props.label}: </label>;
  }

  return (
    <div className="form-group">
      {labelElement} {/* Render label element within the JSX structure */}
      {inputElement}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  placeholder: PropTypes.string,

  label: PropTypes.string,
  changeHandler: PropTypes.func.isRequired,
};

Input.defaultProps = {
  type: () => "",
  name: () => "",
  placeholder: "",

  label: "",
  changeHandler: () => "No change handler defined",
};

export default Input;
