import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SubscriptionSelection from "./pages/SubscriptionSelection";
import Payment from "./pages/PaymentWrapper";
import Status from "./pages/Status";
import { logout } from "./utils/logout";
import AuthComponent from "./components/AuthComponent";
const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  return (
    <Router>
      <div>
        <header>
          {userEmail && (
            <button onClick={logout} className="logout">
              Logout
            </button>
          )}
        </header>
        <main>
          <AuthComponent>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/subscription" element={<SubscriptionSelection />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/status" element={<Status />} />
            </Routes>
          </AuthComponent>
        </main>
      </div>
    </Router>
  );
};

export default App;
