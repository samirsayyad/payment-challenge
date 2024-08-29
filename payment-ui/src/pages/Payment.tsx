import React, { useEffect, useState } from "react";
import { generateToken, payment } from "../integrations/api/PaymentApi";
import { useNavigate } from "react-router-dom";

declare var braintree: any;

const PaymentPage: React.FC = () => {
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const [clientToken, setClientToken] = useState<string | null>(null);
  const [dropinInstance, setDropinInstance] = useState<any>(null);
  const [subscriptionType, setSubscriptionType] = useState<string>("monthly");
  const [includeThermometer, setIncludeThermometer] = useState<boolean>(false);

  useEffect(() => {
    const getClientToken = async () => {
      try {
        const response = await generateToken();
        setClientToken(response.clientToken);
      } catch (error) {
        console.error("Error fetching client token:", error);
      }
    };

    getClientToken();
  }, []);

  useEffect(() => {
    if (clientToken) {
      const initializeDropin = async () => {
        try {
          const instance = await braintree.dropin.create({
            authorization: clientToken,
            container: "#dropin-container",
          });
          setDropinInstance(instance);
        } catch (error) {
          console.error("Error initializing Braintree Drop-in:", error);
        }
      };

      initializeDropin();
    }
  }, [clientToken]);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (dropinInstance) {
      try {
        const payload = await dropinInstance.requestPaymentMethod();
        // Create payment data
        const paymentData = {
          paymentMethodNonce: payload.nonce,
          subscriptionType,
          includeThermometer,
          email: userEmail,
        };

        await payment(paymentData);
        alert("done");
        navigate("/status");
      } catch (error) {
        console.error("Payment processing error:", error);
      }
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <form id="payment-form" onSubmit={handlePayment}>
        <div>
          <label>
            <input
              type="radio"
              value="monthly"
              checked={subscriptionType === "monthly"}
              onChange={() => setSubscriptionType("monthly")}
            />
            Monthly Subscription - 9.90 EUR/month
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="yearly"
              checked={subscriptionType === "yearly"}
              onChange={() => setSubscriptionType("yearly")}
            />
            Yearly Subscription - 79.90 EUR/year
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={includeThermometer}
              onChange={() => setIncludeThermometer(!includeThermometer)}
            />
            Include Thermometer - 14.90 EUR (one-time)
          </label>
        </div>
        <div id="dropin-container"></div>
        <button type="submit" disabled={!clientToken}>
          Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
