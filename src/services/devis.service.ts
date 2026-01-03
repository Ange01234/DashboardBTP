import { api } from '../lib/api';
import { Devis } from '../types';

const mapId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

export const devisService = {
    async findAll(): Promise<Devis[]> {
        const data = await api.get<Devis[]>('/devis');
        return data.map(mapId);
    },

    async findOne(id: string): Promise<Devis> {
        const data = await api.get<Devis>(`/devis/${id}`);
        return mapId(data);
    },

    async create(data: Omit<Devis, 'id'>): Promise<Devis> {
        const result = await api.post<Devis>('/devis', data);
        return mapId(result);
    },

    async update(id: string, data: Partial<Devis>): Promise<Devis> {
        const result = await api.put<Devis>(`/devis/${id}`, data);
        return mapId(result);
    },

    async remove(id: string): Promise<void> {
        return api.delete<void>(`/devis/${id}`);
    },
};
