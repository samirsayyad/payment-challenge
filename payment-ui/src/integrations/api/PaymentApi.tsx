import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface PaymentData {
  paymentMethodNonce: string;
  subscriptionType: string;
  includeThermometer: boolean;
}

export const generateToken = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payment/token`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to login: ${error}`);
  }
};
export const payment = async (paymentData: PaymentData): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payment`, paymentData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to process payment: ${error.response?.data?.message || error.message}`
    );
  }
};
