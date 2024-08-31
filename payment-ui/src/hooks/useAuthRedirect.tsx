import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../integrations/api/LoginApi";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      navigate("/");
      return;
    }

    const checkUser = async () => {
      try {
        const response = await loginUser(userEmail);
        const { email } = response.user;

        if (!email) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Session check failed", error);
        navigate("/");
      }
    };

    checkUser();
  }, [navigate, userEmail]);
};
