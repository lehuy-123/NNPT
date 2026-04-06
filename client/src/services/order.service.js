import api from './api';

export const getAllOrders = async () => {
    const res = await api.get('/api/orders');
    return res;
};

export const getOrderStats = async () => {
    const res = await api.get('/api/orders/stats');
    return res;
};

export const getMyOrders = async () => {
    const res = await api.get('/api/orders/myorders');
    return res;
};

export const updateOrderStatus = async ({ id, status }) => {
    const res = await api.put(`/api/orders/${id}/status`, { status });
    return res;
};
