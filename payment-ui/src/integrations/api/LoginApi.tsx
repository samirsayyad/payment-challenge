import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to login: ${error}`);
  }
};
