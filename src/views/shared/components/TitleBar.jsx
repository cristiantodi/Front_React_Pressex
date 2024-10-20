import { useNavigate } from "react-router-dom";

const TitleBar = ({title}) => {
  const history = useNavigate();

  return (
    <>
      <div className="title_bar">
        <div className="_marco">
          <a onClick={() => history.goBack()}>
            <i className="fas fa-arrow-left"></i>
          </a>
          <h3>{title}</h3>

          <div className="_tools"></div>
        </div>
      </div>
    </>
  );
};

export default TitleBar;
