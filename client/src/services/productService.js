import api from './api';

export const productService = {
  // Hàm lấy danh sách thiết bị di động
  getProducts: async () => {
    return await api.get('/api/products');
  },

  // Hàm lấy chi tiết một thiết bị cụ thể
  getProductById: async (productId) => {
    return await api.get(`/api/products/${productId}`);
  }
};
