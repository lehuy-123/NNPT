import api from './api';

export const getCart = async () => {
    const res = await api.get('/api/carts');
    return res;
};

export const addToCart = async (data) => {
    const res = await api.post('/api/carts', data);
    return res;
};

export const removeFromCart = async (itemId) => {
    const res = await api.delete(`/api/carts/${itemId}`);
    return res;
};

export const checkoutCart = async () => {
    const res = await api.post('/api/carts/checkout');
    return res;
};
