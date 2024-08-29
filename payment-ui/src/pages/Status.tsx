import React, { useEffect, useState } from "react";
import { getStatus } from "../integrations/api/StatusApi";
interface PaymentInfo {
  subscriptionType: "monthly" | "yearly";
  subscriptionEnd: string;
  thermometerIncluded: boolean;
}

const StatusPage: React.FC = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
          setError("User is not logged in.");
          return;
        }

        const response = await getStatus(userEmail);
        setPaymentInfo(response.data);
      } catch (err) {
        setError("Failed to fetch payment status.");
      }
    };

    fetchPaymentInfo();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!paymentInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Status Page</h1>
      <p>
        <strong>Subscription Type:</strong> {paymentInfo.subscriptionType}
      </p>
      <p>
        <strong>Expiration Date:</strong>{" "}
        {new Date(paymentInfo.subscriptionEnd).toLocaleDateString()}
      </p>
      <p>
        <strong>Thermometer Included:</strong>{" "}
        {paymentInfo.thermometerIncluded ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default StatusPage;
