import { api } from '../lib/api';
import { Chantier } from '../types';

const mapId = (item: any): Chantier => {
    const ownerObj = typeof item.userId === 'object' && item.userId !== null ? item.userId : undefined;
    const userId = ownerObj ? (ownerObj.id || ownerObj._id) : item.userId;

    const spectators = Array.isArray(item.spectators)
        ? item.spectators.map((s: any) => ({
            ...s,
            userId: typeof s.userId === 'object' && s.userId !== null ? (s.userId.id || s.userId._id) : s.userId
        }))
        : [];

    return {
        ...item,
        id: item.id || item._id,
        userId: userId ? String(userId) : undefined,
        owner: ownerObj ? {
            id: String(ownerObj.id || ownerObj._id),
            name: ownerObj.name,
            email: ownerObj.email,
            company: ownerObj.company,
        } : undefined,
        spectators,
    };
};

export const chantierService = {
    async findAll(): Promise<Chantier[]> {
        const data = await api.get<Chantier[]>('/chantiers');
        return data.map(mapId);
    },

    async findOne(id: string): Promise<Chantier> {
        const data = await api.get<Chantier>(`/chantiers/${id}`);
        return mapId(data);
    },

    async create(data: Omit<Chantier, 'id'> & { spectatorIds?: string[] }): Promise<Chantier> {
        const result = await api.post<Chantier>('/chantiers', data);
        return mapId(result);
    },

    async update(id: string, data: Partial<Chantier> & { spectatorIds?: string[] }): Promise<Chantier> {
        const result = await api.put<Chantier>(`/chantiers/${id}`, data);
        return mapId(result);
    },

    async remove(id: string): Promise<void> {
        return api.delete<void>(`/chantiers/${id}`);
    },

    async addSpectator(id: string, userId: string): Promise<Chantier> {
        const result = await api.post<Chantier>(`/chantiers/${id}/spectators`, { userId });
        return mapId(result);
    },

    async removeSpectator(id: string, spectatorId: string): Promise<Chantier> {
        const result = await api.delete<Chantier>(`/chantiers/${id}/spectators/${spectatorId}`);
        return mapId(result);
    },
};
