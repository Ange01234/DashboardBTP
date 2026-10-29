import { api } from '../lib/api';
import { UserSummary } from '../types';
import { MOCK_USERS } from '../lib/mockData';

export const userService = {
    async getRegisteredUsers(isDemoMode = false): Promise<UserSummary[]> {
        if (isDemoMode) {
            return MOCK_USERS;
        }
        try {
            const data = await api.get<any[]>('/auth/users');
            return data.map((u: any) => ({
                id: u.id || u._id,
                name: u.name || u.email,
                email: u.email,
                company: u.company,
                role: u.role,
            }));
        } catch (error) {
            console.warn('Could not fetch registered users from backend (falling back to mock):', error);
            return MOCK_USERS;
        }
    },
};
