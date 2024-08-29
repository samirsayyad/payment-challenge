import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Status from "./pages/Status";
import { logout } from "./utils/logout";

const App: React.FC = () => {
  const userEmail = localStorage.getItem("userEmail");

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
          <Routes>
            <Route path="/" element={!userEmail ? <Login /> : <Payment />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
