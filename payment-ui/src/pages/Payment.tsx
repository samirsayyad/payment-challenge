import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const Payment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("monthly");
  const [includeThermometer, setIncludeThermometer] = useState(false);
  const navigate = useNavigate();
  const handlePayment = () => {};
  return (
    <div className="container">
      <h2>Choose Subscription</h2>
      <div>
        <input
          type="radio"
          id="monthly"
          name="subscription"
          value="monthly"
          checked={subscriptionType === "monthly"}
          onChange={() => setSubscriptionType("monthly")}
        />
        <label htmlFor="monthly">Monthly (9.90 EUR)</label>
      </div>
      <div>
        <input
          type="radio"
          id="yearly"
          name="subscription"
          value="yearly"
          checked={subscriptionType === "yearly"}
          onChange={() => setSubscriptionType("yearly")}
        />
        <label htmlFor="yearly">Yearly (79.90 EUR)</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="thermometer"
          checked={includeThermometer}
          onChange={(e) => setIncludeThermometer(e.target.checked)}
        />
        <label htmlFor="thermometer">Include Thermometer (14.90 EUR)</label>
      </div>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
    </div>
  );
};

export default Payment;
