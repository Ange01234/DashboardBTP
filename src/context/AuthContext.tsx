"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface AuthContextType {
    isAuthenticated: boolean;
    isDemoMode: boolean;
    user: { name: string; email: string; id: string } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string; id: string } | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const authStatus = localStorage.getItem('btp_auth');
        const demoStatus = localStorage.getItem('btp_demo');
        const token = localStorage.getItem('btp_token');
        const savedUser = localStorage.getItem('btp_user');

        if (authStatus === 'true' && token) {
            setIsAuthenticated(true);
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } else if (demoStatus === 'true') {
            setIsDemoMode(true);
        } else if (pathname !== '/login' && !pathname.startsWith('/register')) {
            router.push('/login');
        }
    }, [pathname, router]);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            console.log(response);
            localStorage.setItem('btp_token', response.access_token);
            localStorage.setItem('btp_auth', 'true');
            localStorage.setItem('btp_user', JSON.stringify(response.user));
            localStorage.removeItem('btp_demo');
            setIsAuthenticated(true);
            setUser(response.user);
            setIsDemoMode(false);
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('btp_token');
        localStorage.removeItem('btp_auth');
        localStorage.removeItem('btp_user');
        localStorage.removeItem('btp_demo');
        setIsAuthenticated(false);
        setUser(null);
        setIsDemoMode(false);
        router.push('/login');
    };

    const enterDemoMode = () => {
        localStorage.setItem('btp_demo', 'true');
        localStorage.removeItem('btp_auth');
        localStorage.removeItem('btp_user');
        setIsDemoMode(true);
        setIsAuthenticated(false);
        setUser({ name: 'Utilisateur Démo', email: 'demo@btpdash.com', id: 'demo-user' });
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isDemoMode, user, login, logout, enterDemoMode }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
