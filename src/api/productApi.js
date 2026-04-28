import axiosClient from './axiosClient';

export async function getProductsApi() {
  const response = await axiosClient.get('/products');
  return response.data;
}

export async function addProductApi(productData) {
  const response = await axiosClient.post('/products', productData);
  return response.data;
}

export async function deleteProductApi(id) {
  const response = await axiosClient.delete(`/products/${id}`);
  return response.data;
}

export async function editProductApi(id, productData) {
  const response = await axiosClient.put(`/products/${id}`, productData);
  return response.data;
}
