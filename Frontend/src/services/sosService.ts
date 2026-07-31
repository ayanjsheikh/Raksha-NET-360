import api from "./api";

export const sendSOS = async (data: {
  user_id: number;
  latitude: number;
  longitude: number;
  emergency_type: string;
}) => {
  const response = await api.post("/api/sos/send", data);
  return response.data;
};

export const getSOSHistory = async () => {
  const response = await api.get("/api/sos");
  return response.data;
};