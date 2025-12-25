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

const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Chantiers', href: '/chantiers', icon: HardHat },
    { name: 'Devis', href: '/devis', icon: FileText },
    { name: 'Paiements', href: '/paiements', icon: CreditCard },
    { name: 'Dépenses', href: '/depenses', icon: Receipt },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong lg:hidden flex items-center justify-between px-4 border-b border-slate-200/50">
                <button
                    className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 active:scale-95"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-600/10 rounded-lg flex items-center justify-center">
                        <HardHat size={18} className="text-primary-600" />
                    </div>
                    <span className="font-black text-slate-900 tracking-tight">
                        BTP<span className="text-primary-600">Dash</span>
                    </span>
                </div>

                <button className="p-1 rounded-full border-2 border-primary-100 p-0.5 hover:border-primary-300 transition-all active:scale-95">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <UserCircle size={28} className="text-slate-400" />
                    </div>
                </button>
            </div>

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-72 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
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
                                    onClick={() => setIsOpen(false)}
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
                    <div className="p-4 border-t border-slate-200">
                        <button className="sidebar-link w-full">
                            <Settings size={20} />
                            <span>Réglages</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
