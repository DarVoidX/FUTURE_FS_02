import api from './axios';

export const getFollowUps = async (leadId) => {
  const { data } = await api.get(`/api/followups/${leadId}`);
  return data;
};

export const createFollowUp = async (followUpData) => {
  const { data } = await api.post('/api/followups', followUpData);
  return data;
};

export const updateFollowUp = async (id, updateData) => {
  const { data } = await api.put(`/api/followups/${id}`, updateData);
  return data;
};
