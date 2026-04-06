import api from './api';

export const getAllOrders = async () => {
    const res = await api.get('/orders');
    return res.data;
};

export const getMyOrders = async () => {
    const res = await api.get('/orders/myorders');
    return res.data;
};

export const updateOrderStatus = async ({ id, status }) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res.data;
};
