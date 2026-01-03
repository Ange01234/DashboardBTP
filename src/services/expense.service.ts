import { api } from '../lib/api';
import { Expense } from '../types';

const mapId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

export const expenseService = {
    async findAll(): Promise<Expense[]> {
        const data = await api.get<Expense[]>('/expenses');
        return data.map(mapId);
    },

    async findOne(id: string): Promise<Expense> {
        const data = await api.get<Expense>(`/expenses/${id}`);
        return mapId(data);
    },

    async create(data: Omit<Expense, 'id'>): Promise<Expense> {
        const result = await api.post<Expense>('/expenses', data);
        return mapId(result);
    },

    async update(id: string, data: Partial<Expense>): Promise<Expense> {
        const result = await api.put<Expense>(`/expenses/${id}`, data);
        return mapId(result);
    },

    async remove(id: string): Promise<void> {
        return api.delete<void>(`/expenses/${id}`);
    },
};
