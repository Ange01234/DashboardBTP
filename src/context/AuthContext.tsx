"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isDemoMode: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    enterDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const authStatus = localStorage.getItem('btp_auth');
        const demoStatus = localStorage.getItem('btp_demo');

        if (authStatus === 'true') {
            setIsAuthenticated(true);
        } else if (demoStatus === 'true') {
            setIsDemoMode(true);
        } else if (pathname !== '/login') {
            router.push('/login');
        }
    }, [pathname, router]);

    const login = async (email: string, password: string) => {
        // Mock login logic - in a real app, this would be an API call
        if (email && password) {
            localStorage.setItem('btp_auth', 'true');
            localStorage.removeItem('btp_demo');
            setIsAuthenticated(true);
            setIsDemoMode(false);
            router.push('/');
        }
    };

    const logout = () => {
        localStorage.removeItem('btp_auth');
        localStorage.removeItem('btp_demo');
        setIsAuthenticated(false);
        setIsDemoMode(false);
        router.push('/login');
    };

    const enterDemoMode = () => {
        localStorage.setItem('btp_demo', 'true');
        localStorage.removeItem('btp_auth');
        setIsDemoMode(true);
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isDemoMode, login, logout, enterDemoMode }}>
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
