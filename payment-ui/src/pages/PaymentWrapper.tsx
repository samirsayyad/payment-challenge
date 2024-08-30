import React from "react";
import { useLocation } from "react-router-dom";
import PaymentPage from "./Payment";

const PaymentWrapper: React.FC = () => {
  const location = useLocation();
  const { subscriptionType, includeThermometer } = location.state || {};

  if (!subscriptionType || includeThermometer === undefined) {
    return (
      <div>
        Error: Missing subscription information. Please go back and select your
        subscription.
      </div>
    );
  }

  return (
    <PaymentPage
      subscriptionType={subscriptionType}
      includeThermometer={includeThermometer}
    />
  );
};

export default PaymentWrapper;
