import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
enum SubscriptionType {
  Monthly = "monthly",
  Yearly = "yearly",
}
const RadioButton: React.FC<{
  label: string;
  value: SubscriptionType;
  checked: boolean;
  onChange: () => void;
}> = ({ label, value, checked, onChange }) => (
  <label>
    <input type="radio" value={value} checked={checked} onChange={onChange} />
    {label}
  </label>
);
const SubscriptionSelection: React.FC = () => {
  const [subscriptionType, setSubscriptionType] = useState<
    "monthly" | "yearly"
  >("monthly");
  const [includeThermometer, setIncludeThermometer] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        subscriptionType,
        includeThermometer,
        email: localStorage.getItem("userEmail"),
      },
    });
  };

  return (
    <div className="subscription-selection">
      <h1>Select Your Subscription</h1>
      <div>
        <label>
          <RadioButton
            label="Monthly"
            value={SubscriptionType.Monthly}
            checked={subscriptionType === SubscriptionType.Monthly}
            onChange={() => setSubscriptionType(SubscriptionType.Monthly)}
          />
          Monthly
        </label>
        <label>
          <RadioButton
            label="Yearly"
            value={SubscriptionType.Yearly}
            checked={subscriptionType === SubscriptionType.Yearly}
            onChange={() => setSubscriptionType(SubscriptionType.Yearly)}
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
