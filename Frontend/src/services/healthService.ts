import api from "./api";

export const getHealthData = async (userId: number) => {
    const response = await api.get(`/api/health/${userId}`);
    return response.data;
};

export const addHealthData = async (data: any) => {
    const response = await api.post("/api/health/add", data);
    return response.data;
};

export const getRecommendation = async (userId: number) => {
    const response = await api.get(`/api/health/recommendation/${userId}`);
    return response.data;
};

export const getAIHealthAnalysis = async (userId: number) => {
    const response = await api.get(`/api/health/ai-analysis/${userId}`);
    return response.data;
};

export const putHealthIndex = async (userId: number, healthIndex: number, payload: any = {}) => {
    const response = await api.put(`/api/health/update-index/${userId}`, {
        health_index: healthIndex,
        ...payload
    });
    return response.data;
};
