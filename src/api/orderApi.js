import axiosClient from './axiosClient';

export async function createOrderApi(orderData) {
  const response = await axiosClient.post('/orders', orderData);
  return response.data;
}

export async function getAllOrdersApi(params = {}) {
  const response = await axiosClient.get('/orders', { params });
  return response.data;
}

export async function getOrderByIdApi(orderId) {
  const response = await axiosClient.get(`/orders/${orderId}`);
  return response.data;
}

export async function updateOrderStatusApi(orderId, status) {
  const response = await axiosClient.patch(`/orders/${orderId}/status`, { status });
  return response.data;
}

export async function editOrderApi(orderId, orderData) {
  const response = await axiosClient.put(`/orders/${orderId}`, orderData);
  return response.data;
}

export async function refundOrderApi(orderId, reason) {
  const response = await axiosClient.post(`/orders/${orderId}/refund`, { reason });
  return response.data;
}

export async function deleteOrderApi(orderId) {
  const response = await axiosClient.delete(`/orders/${orderId}`);
  return response.data;
}
