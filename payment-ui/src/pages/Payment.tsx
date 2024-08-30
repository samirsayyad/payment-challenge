import React, { useEffect, useState } from "react";
import { generateToken, payment } from "../integrations/api/PaymentApi";

declare var braintree: any;

interface PaymentPageProps {
  subscriptionType: "monthly" | "yearly";
  includeThermometer: boolean;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  subscriptionType,
  includeThermometer,
}) => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [dropinInstance, setDropinInstance] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await generateToken();
        setClientToken(response.clientToken);
      } catch (error) {
        console.error("Failed to fetch client token", error);
        setErrorMessage("Failed to load payment gateway. Please try again.");
      }
    };

    fetchClientToken();
  }, []);

  useEffect(() => {
    if (clientToken) {
      const dropinContainer = document.getElementById("dropin-container");
      if (dropinContainer) dropinContainer.innerHTML = "";

      braintree.dropin.create(
        {
          authorization: clientToken,
          container: "#dropin-container",
        },
        (error: any, instance: any) => {
          if (error) {
            console.error("Error creating Drop-In UI", error);
            setErrorMessage(
              "Failed to load payment gateway. Please try again."
            );
            return;
          }
          setDropinInstance(instance);
        }
      );
    }
  }, [clientToken]);

  const handlePayment = async () => {
    if (!dropinInstance) return;

    try {
      const payload = await dropinInstance.requestPaymentMethod();
      const paymentData = {
        paymentMethodNonce: payload.nonce,
        subscriptionType,
        includeThermometer,
      };

      const response = await payment(paymentData);

      if (response.success) {
        alert("Payment successful!");
      } else {
        setErrorMessage(
          "Payment failed. Please try again with a different card."
        );
      }
    } catch (error) {
      console.error("Payment error", error);
      setErrorMessage(
        "An error occurred during payment. Please check your details and try again."
      );
    }
  };

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      <div id="dropin-container"></div>
      {errorMessage && (
        <p className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      <button onClick={handlePayment} disabled={!dropinInstance}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
