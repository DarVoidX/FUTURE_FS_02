import api from './axios';

export const getLeads = async (params = {}) => {
  const { data } = await api.get('/api/leads', { params });
  return data;
};

export const getLead = async (id) => {
  const { data } = await api.get(`/api/leads/${id}`);
  return data;
};

export const createLead = async (leadData) => {
  const { data } = await api.post('/api/leads', leadData);
  return data;
};

export const updateLead = async (id, leadData) => {
  const { data } = await api.put(`/api/leads/${id}`, leadData);
  return data;
};

export const deleteLead = async (id) => {
  const { data } = await api.delete(`/api/leads/${id}`);
  return data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/api/leads/analytics/summary');
  return data;
};
