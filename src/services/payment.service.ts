import { api } from '../lib/api';
import { Payment } from '../types';

const mapId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

export const paymentService = {
    async findAll(): Promise<Payment[]> {
        const data = await api.get<Payment[]>('/payments');
        return data.map(mapId);
    },

    async findOne(id: string): Promise<Payment> {
        const data = await api.get<Payment>(`/payments/${id}`);
        return mapId(data);
    },

    async create(data: Omit<Payment, 'id'>): Promise<Payment> {
        const result = await api.post<Payment>('/payments', data);
        return mapId(result);
    },

    async update(id: string, data: Partial<Payment>): Promise<Payment> {
        const result = await api.put<Payment>(`/payments/${id}`, data);
        return mapId(result);
    },

    async remove(id: string): Promise<void> {
        return api.delete<void>(`/payments/${id}`);
    },
};
