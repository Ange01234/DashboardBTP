import { api } from '../lib/api';
import { Chantier } from '../types';

const mapId = (item: any) => ({
    ...item,
    id: item.id || item._id
});

export const chantierService = {
    async findAll(): Promise<Chantier[]> {
        const data = await api.get<Chantier[]>('/chantiers');
        return data.map(mapId);
    },

    async findOne(id: string): Promise<Chantier> {
        const data = await api.get<Chantier>(`/chantiers/${id}`);
        return mapId(data);
    },

    async create(data: Omit<Chantier, 'id'>): Promise<Chantier> {
        const result = await api.post<Chantier>('/chantiers', data);
        return mapId(result);
    },

    async update(id: string, data: Partial<Chantier>): Promise<Chantier> {
        const result = await api.put<Chantier>(`/chantiers/${id}`, data);
        return mapId(result);
    },

    async remove(id: string): Promise<void> {
        return api.delete<void>(`/chantiers/${id}`);
    },
};
