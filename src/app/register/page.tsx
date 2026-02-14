"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HardHat, Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(name, email, password, company); // adapte si besoin selon ton contexte
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/50 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 mb-4 transform transition-transform hover:rotate-6">
                        <HardHat className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">BTPDash</h1>
                    <p className="text-slate-500 mt-2 text-center text-sm font-medium">
                        Créez votre compte professionnel
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-white">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Inscription</h2>
                        <p className="text-slate-500 text-sm mt-1">Rejoignez BTPDash pour gérer vos chantiers.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Nom complet */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Nom complet
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none transition-all"
                                    placeholder="Jean Dupont"
                                    required
                                />
                            </div>
                        </div>

                        {/* Nom de l'entreprise */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Nom de l’entreprise
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Briefcase size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none transition-all"
                                    placeholder="Entreprise BTP SA"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none transition-all"
                                    placeholder="nom@entreprise.fr"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                Mot de passe
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-primary-500 rounded-xl py-3 pl-11 pr-11 text-slate-900 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>S'inscrire</span>
                                    <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/login" className="text-primary-600 font-bold hover:text-primary-700">
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
