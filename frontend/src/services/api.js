import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Node backend

export const api = {
    getCustomers: async () => {
        const response = await axios.get(`${API_BASE_URL}/customers`);
        return response.data;
    },
    getRecommendation: async (customerData) => {
        const response = await axios.post(`${API_BASE_URL}/recommend`, customerData);
        return response.data;
    },
    analyzeSentiment: async (text, context = {}) => {
        const response = await axios.post(`${API_BASE_URL}/voice/analyze`, { text, ...context });
        return response.data;
    }
};
