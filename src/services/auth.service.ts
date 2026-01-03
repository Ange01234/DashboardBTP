import { api } from '../lib/api';
import { RegisterDto, LoginDto, AuthResponse } from '../types';

export const authService = {
    async login(loginDto: LoginDto): Promise<AuthResponse> {
        return api.post<AuthResponse>('/auth/login', loginDto);
    },

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        return api.post<AuthResponse>('/auth/register', registerDto);
    },
};
