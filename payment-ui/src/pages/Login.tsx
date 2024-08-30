import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../integrations/api/LoginApi";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const Login: React.FC = () => {
  useAuthRedirect();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUserEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(userEmail);
      const { email, subscriptionStatus } = response.user;

      if (!email) {
        navigate("/");
        return;
      }

      localStorage.setItem("userEmail", email);
      navigate(subscriptionStatus === "active" ? "/status" : "/subscription");
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
              value={userEmail}
              onChange={handleUserEmailChange}
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
