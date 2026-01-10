'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    HardHat,
    FileText,
    CreditCard,
    Receipt,
    Settings,
    Menu,
    X,
    UserCircle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Sparkles } from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Chantiers', href: '/chantiers', icon: HardHat },
    { name: 'Devis', href: '/devis', icon: FileText },
    { name: 'Paiements', href: '/paiements', icon: CreditCard },
    { name: 'Dépenses', href: '/depenses', icon: Receipt },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, isDemoMode, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            {/* <div className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong lg:hidden flex items-center justify-between px-4 border-b border-slate-200/50">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600/10 rounded-lg flex items-center justify-center">
                        <HardHat size={18} className="text-primary-600" />
                    </div>
                    <span className="font-black text-slate-900 tracking-tight">
                        BTP<span className="text-primary-600">Dash</span>
                    </span>
                </div>

                <div className="relative">
                    <button
                        className="p-1 rounded-full border-2 border-primary-100 p-0.5 hover:border-primary-300 transition-all active:scale-95"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            <UserCircle size={28} className="text-slate-400" />
                        </div>
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50"
                                >
                                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {user?.name || 'Utilisateur'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Déconnexion</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div> */}

            {/* Sidebar (Desktop Only) */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 flex-col">
                <div className="flex flex-col h-full h-screen">
                    {/* Logo */}
                    <div className="p-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                                <HardHat className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                BTP<span className="text-primary-600">Dash</span>
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "sidebar-link",
                                        isActive && "active"
                                    )}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="p-4 border-t border-slate-200 space-y-2">
                        {isDemoMode && (
                            <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                                <div className="flex items-center space-x-2 text-amber-700">
                                    <Sparkles size={16} className="animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Mode Démo</span>
                                </div>
                                <p className="text-[10px] text-amber-600 mt-1 leading-tight">
                                    Données statiques pour démo.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center space-x-3 px-2 py-2 mb-2 bg-slate-100 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <UserCircle size={20} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                    {user?.name || 'Utilisateur'}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="sidebar-link w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                            <LogOut size={20} />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 h-20 glass-strong lg:hidden border-t border-slate-200/50 pb-safe">
                <nav className="h-full flex items-center justify-around px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center space-y-1 p-2 rounded-xl transition-all duration-300 w-16 relative",
                                    isActive ? "text-primary-600" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
