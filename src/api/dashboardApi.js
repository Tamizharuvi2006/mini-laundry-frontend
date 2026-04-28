import axiosClient from './axiosClient';

export async function getDashboardApi(params = {}) {
  const response = await axiosClient.get('/dashboard', { params });
  return response.data;
}
