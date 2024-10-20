import { useState } from "react";
import "../styles/pages/Login.scss";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import logotext from "../img/logotextcolor.jpg";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setlanguage] = useState("null");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigateTo = useNavigate();

  const handleLogin = () => {
    if (language == "null") {
      alert("Please select a language before loging in");
    } else {
      AuthService.login(username, password)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            navigateTo("/dashboard", { replace: true });
            
            
          } else {
            
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 1000);
          }
        })
        .catch((error) => {
          
            setShowErrorAlert(true);
            setTimeout(() => {
              setShowErrorAlert(false);
            }, 1000);
        });
    }
  };

  return (
    <div id="contenedor">
      <div id="central">
        <div id="login">
          <img className="logo_login" src={logotext} alt="Logo_texto" />
          <form className="login">
            <div className="login__field">
              <p className="text-log">Username</p>
              <input
                type="text"
                className="login__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="login__field">
              <p className="text-log">Password</p>
              <input
                type="password"
                className="login__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <div className="sub-forgot">
                <a href="#">Forgot a password?</a>
              </div>
              <div className="text-log">
                <label htmlFor="language"> </label>
                <select
                  className="select-leng"
                  name="language"
                  id="language"
                  value={language}
                  onChange={(e) => setlanguage(e.target.value)}
                >
                  <option value="null">Select a language</option>
                  <option value="us">English</option>
                  <option value="co">Spanish</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              title="Ingresar"
              name="Ingresar"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </form>
          <div className="sub-text">
            <p>Copyright © 2023 PRESSEX all rights reserved.</p>
          </div>
        </div>
      </div>
      {showErrorAlert && (
        <Alert
          severity="error"
          onClose={() => setShowErrorAlert(false)}
          className="alert-notification"
        >
          <AlertTitle>Error</AlertTitle>
          <strong>Username or password invalid. Please try again.</strong>
        </Alert>
      )}
    </div>
  );
};

export default LoginPage;
