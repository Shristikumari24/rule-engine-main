import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const createRule = async (ruleData) => {
  const response = await api.post('/rules', ruleData);
  return response.data;
};

export const evaluateRule = async (ruleId, data) => {
  const response = await api.post(`/rules/${ruleId}/evaluate`, { data });
  return response.data;
};

export default api;
