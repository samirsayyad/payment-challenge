import React from "react";
import { useLocation } from "react-router-dom";
import PaymentPage from "./Payment";
import { useNavigate } from "react-router-dom";

const PaymentWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionType, includeThermometer, email } = location.state || {};

  if (!subscriptionType || !email) {
    return (
      <div>
        Error: Missing subscription information. Please go back and select your
        subscription.
        <p>
          <input
            type="button"
            value="Select Subscriptions"
            onClick={() => navigate("/subscription")}
          />
        </p>
      </div>
    );
  }

  return (
    <PaymentPage
      subscriptionType={subscriptionType}
      includeThermometer={includeThermometer}
      email={email}
    />
  );
};

export default PaymentWrapper;
