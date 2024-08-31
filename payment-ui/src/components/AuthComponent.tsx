import React from "react";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const AuthComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useAuthRedirect();

  return <>{children}</>;
};

export default AuthComponent;
