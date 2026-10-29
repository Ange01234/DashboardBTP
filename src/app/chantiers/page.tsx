'use client';

import { useState, useMemo } from 'react';
import {
    Search,
    MapPin,
    User,
    Calendar,
    Plus,
    Filter,
    MoreVertical,
    HardHat,
    Users,
    Eye,
    ShieldAlert
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChantierStatus, Chantier } from '@/types';
import LoadingState from '@/components/ui/LoadingState';

export default function ChantiersPage() {
    const router = useRouter();
    const { chantiers, loading } = useData();
    const { user: currentUser, isDemoMode } = useAuth();
    
    // Tab state: 'mes-chantiers' | 'partages'
    const [activeTab, setActiveTab] = useState<'mes-chantiers' | 'partages'>('mes-chantiers');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ChantierStatus | 'Tous'>('Tous');

    // Helper to determine if current user owns the chantier
    const isOwner = (chantier: Chantier) => {
        if (isDemoMode) {
            return chantier.userId === 'demo-user' || !chantier.userId;
        }
        if (!currentUser?.id) return true;
        if (!chantier.userId) return true;
        
        const ownerId = typeof chantier.userId === 'object' 
            ? (chantier.userId as any)._id || (chantier.userId as any).id 
            : chantier.userId;
            
        return ownerId === currentUser.id;
    };

    // Separate chantiers into owned and shared
    const myChantiers = useMemo(() => {
        return chantiers.filter(c => isOwner(c));
    }, [chantiers, currentUser?.id, isDemoMode]);

    const sharedChantiers = useMemo(() => {
        return chantiers.filter(c => !isOwner(c));
    }, [chantiers, currentUser?.id, isDemoMode]);

    // Active list based on tab
    const currentList = activeTab === 'mes-chantiers' ? myChantiers : sharedChantiers;

    const filteredChantiers = useMemo(() => {
        return currentList.filter((c: Chantier) => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.client.toLowerCase().includes(search.toLowerCase()) ||
                (c.owner?.name && c.owner.name.toLowerCase().includes(search.toLowerCase()));
            const matchesStatus = statusFilter === 'Tous' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [currentList, search, statusFilter]);

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chantiers</h1>
                    <p className="text-slate-500 mt-1">Gérez vos chantiers et consultez les projets partagés avec vous.</p>
                </div>
                {activeTab === 'mes-chantiers' && (
                    <Link href="/chantiers/nouveau" className="btn-primary flex items-center justify-center space-x-2">
                        <Plus size={20} />
                        <span>Nouveau Chantier</span>
                    </Link>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4">
                <button
                    onClick={() => setActiveTab('mes-chantiers')}
                    className={cn(
                        "flex items-center space-x-2.5 pb-4 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer",
                        activeTab === 'mes-chantiers'
                            ? "border-primary-600 text-primary-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <HardHat size={18} />
                    <span>Mes chantiers</span>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeTab === 'mes-chantiers'
                            ? "bg-primary-100 text-primary-700"
                            : "bg-slate-100 text-slate-600"
                    )}>
                        {myChantiers.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('partages')}
                    className={cn(
                        "flex items-center space-x-2.5 pb-4 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer",
                        activeTab === 'partages'
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Eye size={18} />
                    <span>Chantiers partagés</span>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeTab === 'partages'
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                    )}>
                        {sharedChantiers.length}
                    </span>
                </button>
            </div>

            {/* Info notice for Shared Tab */}
            {activeTab === 'partages' && (
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-sm">
                    <Eye size={20} className="shrink-0 text-indigo-600" />
                    <div>
                        <span className="font-bold">Espace de consultation (Lecture seule) : </span>
                        <span>Vous pouvez consulter les détails, chiffres, dépenses et encaissements de ces chantiers partagés par leurs propriétaires.</span>
                    </div>
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un chantier ou un client..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 min-w-[200px]">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="w-full py-2 bg-transparent border-none focus:ring-0 text-slate-600 font-medium cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="Tous">Tous les statuts</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Suspendu">Suspendu</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChantiers.map((chantier) => {
                    const chantierIsOwned = isOwner(chantier);
                    const spectatorCount = chantier.spectators?.length || 0;

                    return (
                        <div
                            key={chantier.id}
                            onClick={() => router.push(`/chantiers/${chantier.id}`)}
                            className="group block glass p-6 rounded-2xl cursor-pointer card-hover border border-slate-100 relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                    <HardHat className="text-slate-400 group-hover:text-primary-600 transition-colors" size={24} />
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                        chantier.status === 'En cours' ? "bg-blue-50 text-blue-700" :
                                            chantier.status === 'Terminé' ? "bg-emerald-50 text-emerald-700" :
                                                "bg-amber-50 text-amber-700"
                                    )}>
                                        {chantier.status}
                                    </span>
                                    {!chantierIsOwned ? (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            <Eye size={11} className="mr-0.5" />
                                            Spectateur
                                        </span>
                                    ) : spectatorCount > 0 ? (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                            <Users size={11} className="mr-0.5" />
                                            {spectatorCount} spectateur{spectatorCount > 1 ? 's' : ''}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                                {chantier.name}
                            </h3>

                            {!chantierIsOwned && chantier.owner && (
                                <p className="text-xs text-indigo-600 font-medium mb-3">
                                    Propriétaire : {chantier.owner.name || chantier.owner.email}
                                </p>
                            )}

                            <div className="space-y-2.5 mb-6">
                                <div className="flex items-center text-sm text-slate-500 space-x-2">
                                    <User size={16} />
                                    <span>{chantier.client}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 space-x-2">
                                    <MapPin size={16} />
                                    <span>{chantier.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 space-x-2">
                                    <Calendar size={16} />
                                    <span>Début: {formatDate(chantier.startDate)}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Budget Prévu</p>
                                    <p className="text-lg font-bold text-slate-900">{formatCurrency(chantier.budget)}</p>
                                </div>
                                {chantierIsOwned && (
                                    <Link
                                        href={`/chantiers/${chantier.id}/modifier`}
                                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 relative z-10 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Modifier ce chantier"
                                    >
                                        <MoreVertical size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredChantiers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <HardHat size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">
                        {activeTab === 'mes-chantiers' ? "Aucun chantier trouvé" : "Aucun chantier partagé"}
                    </h3>
                    <p className="text-slate-500 mt-1 max-w-md mx-auto text-sm">
                        {activeTab === 'mes-chantiers'
                            ? "Vous n'avez pas encore créé de chantier ou aucun ne correspond à vos critères."
                            : "Aucun chantier n'a été partagé avec vous pour l'instant. Les chantiers auxquels vous serez invité apparaîtront ici en lecture seule."}
                    </p>
                    {activeTab === 'mes-chantiers' && (
                        <Link href="/chantiers/nouveau" className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                            <Plus size={16} />
                            <span>Créer un premier chantier</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
