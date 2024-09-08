import React, { useEffect, useState } from "react";
import { generateToken, payment } from "../integrations/api/PaymentApi";
import { useNavigate } from "react-router-dom";
import "./styles/Payment.css";

declare var braintree: any;

interface PaymentPageProps {
  subscriptionType: "monthly" | "yearly";
  includeThermometer: boolean;
  email: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  subscriptionType,
  includeThermometer,
  email,
}) => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [dropinInstance, setDropinInstance] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean | null>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await generateToken(email);
        setClientToken(response.clientToken);
      } catch (error) {
        console.error("Failed to fetch client token", error);
        setErrorMessage("Failed to load payment gateway. Please try again.");
      }
    };

    fetchClientToken();
  }, [email]);

  useEffect(() => {
    const dropinContainer = document.getElementById("dropin-container");
    if (clientToken && dropinContainer) {
      dropinContainer.innerHTML = "";

      braintree.dropin.create(
        {
          authorization: clientToken,
          container: "#dropin-container",
        },
        (_error: any, instance: any) => {
          setDropinInstance(instance);
        }
      );
    }
  }, [clientToken]);

  const handlePayment = async () => {
    const paymentData = {
      paymentMethodNonce: nonce || "",
      subscriptionType,
      includeThermometer,
      email,
    };
    setPaymentLoading(true);
    const response = await payment(paymentData);
    setPaymentLoading(false);
    if (response.success) {
      alert("Payment successful!");
      navigate("/status");
    } else {
      setErrorMessage(
        "Payment failed. Please try again with a different card."
      );
    }
  };
  const handlePaymentMethod = async () => {
    if (!dropinInstance) return;

    try {
      const { nonce } = await dropinInstance.requestPaymentMethod();
      setNonce(nonce);
    } catch (error) {
      console.error("Payment error", error);
      setErrorMessage(
        "An error occurred during payment. Please check your details and try again."
      );
    }
  };

  return paymentLoading || !clientToken ? (
    <div
      className="payment-page"
      style={{ fontSize: "20px", textAlign: "center" }}
    >
      Loading...
    </div>
  ) : (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      <div id="dropin-container"></div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button
        onClick={nonce ? handlePayment : handlePaymentMethod}
        disabled={!dropinInstance}
      >
        {nonce ? "Pay" : "Next"}
      </button>
    </div>
  );
};

export default PaymentPage;
