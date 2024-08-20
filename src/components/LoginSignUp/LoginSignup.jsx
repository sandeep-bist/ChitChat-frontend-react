import React, { useState } from "react";
import axios from "axios";
import "./LoginSignup.css";
import { assets } from "../../assets/assets";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import DashBoard from "../DashBoard";

function LoginSignup() {
  const navigate = useNavigate();
  const [action, setAction] = useState("Sign Up");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (actions) => {
    setAction(actions);
    if (actions === "Sign Up") {
      axios
        .post("http://127.0.0.1:8001/register/", {
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
        })
        .then((res) => {
          console.log(res.status);
          console.log(res.data);
          // const token=
        });
    }
    if ((actions === "Log In") & (email != "") & (password !== "")) {
      axios
        .post("http://127.0.0.1:8000/login/", {
          email: email,
          password: password,
        })
        .then((res) => {
          console.log(res.status);
          console.log(res.data);

          const token = res.data.token;
          const user_id = res.data.user.id;
          localStorage.setItem("user_id", user_id);
          document.cookie = `token=${token};path=/`;
          if (res.status == 200) {
            navigate("/chat");
          }
        })
        .catch((error) => {
          console.error(error, "error while login");
        });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" ? (
          <>
            <div className="input">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="First Name"
              />
            </div>
            <div className="input">
              <img src={assets.person_icon} alt="" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </>
        ) : (
          <div></div>
        )}

        <div className="input">
          <img src={assets.email_icon} alt="" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Id"
          />
        </div>

        <div className="input">
          <img src={assets.password_icon} alt="" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
      </div>
      {action === "Log In" ? (
        <div className="forgot-password">
          Lost Password? <span>Click Here</span>
        </div>
      ) : (
        " "
      )}

      <div className="submit-container">
        <div
          className={action == "Log In" ? "submit gray" : "submit"}
          onClick={() => {
            handleFormSubmit("Sign Up");
          }}
        >
          Sign Up
        </div>
        <div
          className={action == "Sign Up" ? "submit gray" : "submit"}
          onClick={() => {
            handleFormSubmit("Log In");
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
