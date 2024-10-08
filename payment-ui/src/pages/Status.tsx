import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStatus } from "../integrations/api/StatusApi";
import "./styles/Status.css";

interface StatusData {
  subscriptionType: "monthly" | "yearly";
  expirationDate: string;
  daysRemaining: number;
  includeThermometer: boolean;
}

const StatusPage: React.FC = () => {
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");
  useEffect(() => {
    if (!userEmail) {
      navigate("/");
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getStatus(userEmail);

        setStatusData(data);
      } catch (error) {
        console.error("Failed to fetch status", error);
      }
    };

    fetchData();
  }, [navigate, userEmail]);

  if (!statusData) {
    return (
      <div
        className="status-page"
        style={{ fontSize: "20px", textAlign: "center" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="status-page">
      <h1>Subscription Status</h1>
      <p>
        <strong>Subscription Type:</strong>{" "}
        {statusData.subscriptionType === "monthly" ? "Monthly" : "Yearly"}
      </p>
      <p>
        <strong>Expiration Date:</strong>{" "}
        {new Date(statusData.expirationDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Days Remaining:</strong> {statusData.daysRemaining}
      </p>
      <p>
        <strong>Thermometer Purchased:</strong>{" "}
        {statusData.includeThermometer ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default StatusPage;
