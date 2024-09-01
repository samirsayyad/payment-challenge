import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import { useNavigate } from "react-router-dom";
import { loginUser } from "../integrations/api/LoginApi";
import "./styles/Login.css";

const STATUS_ROUTE = "/status";
const SUBSCRIPTION_ROUTE = "/subscription";

type LoginProps = {
  onLogin: (email: string) => void;
};

const LoginForm: React.FC<{
  onSubmit: (email: string) => void;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [userEmail, setUserEmail] = useState("");

  const handleUserEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(userEmail);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label className="label">
        Email:
        <input
          type="email"
          value={userEmail}
          onChange={handleUserEmailChange}
          required
          className="input"
        />
      </label>
      <button type="submit" disabled={loading} className="button">
        {loading ? "Loading..." : "Next"}
      </button>
    </form>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (userEmail: string) => {
      try {
        const response = await loginUser(userEmail);
        const { email, subscriptionStatus } = response.user;

        if (!email) {
          navigate("/");
          return;
        }

        onLogin(email);
        navigate(
          subscriptionStatus === "active" ? STATUS_ROUTE : SUBSCRIPTION_ROUTE,
        );
      } catch (error) {
        setError(`Failed to login: ${error}`);
      } finally {
        setLoading(false);
      }
    },
    [navigate, onLogin],
  );

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      return;
    }
    navigate(STATUS_ROUTE);
    handleLogin(email);
  }, [handleLogin, navigate]);

  return (
    <div className="container">
      <h1>Login</h1>
      <LoginForm onSubmit={handleLogin} loading={loading} />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
