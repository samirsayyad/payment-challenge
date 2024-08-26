import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("userEmail", email);
    navigate("/payment");
  };

  return (
    <center>
      <h2>Login</h2>
      <div className="container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <button onClick={handleLogin}>Next</button>
      </div>
    </center>
  );
};

export default Login;
