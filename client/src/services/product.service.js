import api from './api';

export const getProducts = async (categorySlug) => {
    const url = categorySlug && categorySlug !== 'deals' 
        ? `/api/products?category=${categorySlug}` 
        : `/api/products`;
    const res = await api.get(url);
    return res;
};

export const getProductById = async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res;
};

export const createProduct = async (productData) => {
    const res = await api.post(`/api/products`, productData);
    return res;
};

export const updateProduct = async ({ id, data }) => {
    const res = await api.put(`/api/products/${id}`, data);
    return res;
};

export const deleteProduct = async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res;
};
