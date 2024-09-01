import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Subscription.css";

enum SubscriptionType {
  Monthly = "monthly",
  Yearly = "yearly",
}

const SubscriptionSelection: React.FC = () => {
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.Monthly
  );
  const [includeThermometer, setIncludeThermometer] = useState<boolean>(false);
  const navigate = useNavigate();

  const prices = {
    monthly: 9.9,
    yearly: 79.9,
    thermometer: 14.9,
  };

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        subscriptionType,
        includeThermometer,
        email: localStorage.getItem("userEmail"),
      },
    });
  };

  const totalPrice =
    subscriptionType === SubscriptionType.Monthly
      ? prices.monthly + (includeThermometer ? prices.thermometer : 0)
      : prices.yearly + (includeThermometer ? prices.thermometer : 0);

  return (
    <div className="subscription-selection">
      <h1>Subscription Selection</h1>

      <div className="subscription-option">
        <label>
          <input
            type="radio"
            value={SubscriptionType.Monthly}
            checked={subscriptionType === SubscriptionType.Monthly}
            onChange={() => setSubscriptionType(SubscriptionType.Monthly)}
          />
          Monthly - €{prices.monthly} / month
        </label>
      </div>

      <div className="subscription-option">
        <label>
          <input
            type="radio"
            value={SubscriptionType.Yearly}
            checked={subscriptionType === SubscriptionType.Yearly}
            onChange={() => setSubscriptionType(SubscriptionType.Yearly)}
          />
          Yearly - €{prices.yearly} / year
        </label>
      </div>

      <div className="thermometer-option">
        <label>
          <input
            type="checkbox"
            checked={includeThermometer}
            onChange={() => setIncludeThermometer(!includeThermometer)}
          />
          Include Thermometer (+ €{prices.thermometer})
        </label>
      </div>

      <div className="total-price">
        <p>
          <strong>Total Price:</strong> €{totalPrice.toFixed(2)}
        </p>
      </div>

      <button onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
};

export default SubscriptionSelection;
