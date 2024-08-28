import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../integrations/api/LoginApi";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      loginUser(email);
      localStorage.setItem("userEmail", email);
      navigate("/payment");
    } catch (error) {
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <center>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Next"}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </center>
  );
};

export default Login;
