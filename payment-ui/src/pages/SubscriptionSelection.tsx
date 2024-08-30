import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionSelection: React.FC = () => {
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "yearly"
  >("monthly");
  const [includeThermometer, setIncludeThermometer] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: { subscriptionType, includeThermometer },
    });
  };

  return (
    <div className="subscription-selection">
      <h1>Select Your Subscription</h1>
      <div>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={subscriptionType === "monthly"}
            onChange={() => setSubscriptionType("monthly")}
          />
          Monthly
        </label>
        <label>
          <input
            type="radio"
            value="yearly"
            checked={subscriptionType === "yearly"}
            onChange={() => setSubscriptionType("yearly")}
          />
          Yearly
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeThermometer}
            onChange={() => setIncludeThermometer(!includeThermometer)}
          />
          Include Thermometer
        </label>
      </div>
      <button onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
};

export default SubscriptionSelection;
