import axiosClient from './axiosClient';

export async function getDashboardApi() {
  const response = await axiosClient.get('/dashboard');
  return response.data;
}
