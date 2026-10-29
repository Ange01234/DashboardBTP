'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Users, X, Eye, Building2, Check } from 'lucide-react';
import { UserSummary } from '@/types';
import { userService } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';

interface UserSelectorProps {
    selectedUserIds: string[];
    onChange: (userIds: string[]) => void;
    excludedUserIds?: string[];
    title?: string;
    description?: string;
}

const DEFAULT_EXCLUDED_USER_IDS: string[] = [];

export default function UserSelector({
    selectedUserIds,
    onChange,
    excludedUserIds = DEFAULT_EXCLUDED_USER_IDS,
    title = 'Collaborateurs & Spectateurs',
    description = 'Sélectionnez les personnes ayant un accès en lecture seule à ce projet.',
}: UserSelectorProps) {
    const { isDemoMode, user: currentUser } = useAuth();
    const [rawUsers, setRawUsers] = useState<UserSummary[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        userService.getRegisteredUsers(isDemoMode)
            .then(users => {
                if (isMounted) {
                    setRawUsers(users);
                }
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, [isDemoMode]);

    const excludedIdsKey = excludedUserIds.join(',');

    const availableUsers = useMemo(() => {
        const excludedSet = new Set(excludedUserIds);
        return rawUsers.filter(u => 
            u.id !== currentUser?.id && 
            !excludedSet.has(u.id)
        );
    }, [rawUsers, currentUser?.id, excludedIdsKey]);

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return availableUsers;
        const q = search.toLowerCase();
        return availableUsers.filter(u => 
            u.name?.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.company?.toLowerCase().includes(q)
        );
    }, [availableUsers, search]);

    const selectedUsers = useMemo(() => {
        return rawUsers.filter(u => selectedUserIds.includes(u.id));
    }, [rawUsers, selectedUserIds]);

    const toggleUser = (userId: string) => {
        if (selectedUserIds.includes(userId)) {
            onChange(selectedUserIds.filter(id => id !== userId));
        } else {
            onChange([...selectedUserIds, userId]);
        }
    };

    const removeUser = (userId: string) => {
        onChange(selectedUserIds.filter(id => id !== userId));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center space-x-2 text-slate-900 font-bold">
                        <Users size={18} className="text-primary-600" />
                        <h3>{title}</h3>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                            <Eye size={12} className="mr-1" />
                            Lecture seule
                        </span>
                    </div>
                    {description && (
                        <p className="text-xs text-slate-500 mt-1">{description}</p>
                    )}
                </div>
                <div className="text-xs font-medium text-slate-500">
                    {selectedUserIds.length} sélectionné{selectedUserIds.length > 1 ? 's' : ''}
                </div>
            </div>

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {selectedUsers.map(u => (
                        <div
                            key={u.id}
                            className="flex items-center space-x-2 pl-2 pr-1.5 py-1 bg-white border border-slate-200 rounded-lg shadow-sm text-xs text-slate-700"
                        >
                            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                                {(u.name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-900">{u.name || u.email}</span>
                            <span className="text-slate-400 text-[11px]">({u.email})</span>
                            <button
                                type="button"
                                onClick={() => removeUser(u.id)}
                                className="p-0.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                                title="Retirer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none text-sm bg-white transition-all"
                />
            </div>

            {/* Users List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-slate-200 p-2 bg-slate-50/50">
                {isLoading ? (
                    <div className="p-4 text-center text-xs text-slate-400">Chargement des utilisateurs...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                        {availableUsers.length === 0
                            ? "Aucun autre utilisateur enregistré sur la plateforme."
                            : "Aucun utilisateur ne correspond à votre recherche."}
                    </div>
                ) : (
                    filteredUsers.map(u => {
                        const isSelected = selectedUserIds.includes(u.id);
                        return (
                            <div
                                key={u.id}
                                onClick={() => toggleUser(u.id)}
                                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border ${
                                    isSelected
                                        ? 'bg-primary-50/80 border-primary-200 text-primary-900'
                                        : 'bg-white hover:bg-slate-100 border-slate-100 text-slate-800'
                                }`}
                            >
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                        isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {(u.name || u.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {u.name || 'Utilisateur'}
                                        </p>
                                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                                            <span className="truncate">{u.email}</span>
                                            {u.company && (
                                                <span className="flex items-center space-x-0.5 text-slate-400 truncate">
                                                    <Building2 size={10} className="shrink-0" />
                                                    <span>{u.company}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                    isSelected
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'border-slate-300 bg-white'
                                }`}>
                                    {isSelected && <Check size={14} />}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
