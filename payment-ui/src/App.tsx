import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Payment from "./pages/Payment";

const App: React.FC = () => {
  const userEmail = localStorage.getItem("userEmail");
  if (!userEmail) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Payment />} />
      </Routes>
    </Router>
  );
};

export default App;
