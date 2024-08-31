import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Subscription.css";

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
      <h1>Subscription Selection</h1>
      <RadioButton
        label="Monthly"
        value={SubscriptionType.Monthly}
        checked={subscriptionType === SubscriptionType.Monthly}
        onChange={() => setSubscriptionType(SubscriptionType.Monthly)}
      />
      <RadioButton
        label="Yearly"
        value={SubscriptionType.Yearly}
        checked={subscriptionType === SubscriptionType.Yearly}
        onChange={() => setSubscriptionType(SubscriptionType.Yearly)}
      />
      <label>
        <input
          type="checkbox"
          checked={includeThermometer}
          onChange={() => setIncludeThermometer(!includeThermometer)}
        />
        Include Thermometer
      </label>
      <button onClick={handleProceedToPayment}>Proceed to Payment</button>
    </div>
  );
};

export default SubscriptionSelection;
