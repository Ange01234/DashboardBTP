'use client';

import { useState } from 'react';
import {
    Search,
    MapPin,
    User,
    Calendar,
    Plus,
    Filter,
    MoreVertical,
    HardHat
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChantierStatus, Chantier } from '@/types';
import LoadingState from '@/components/ui/LoadingState';

export default function ChantiersPage() {
    const router = useRouter();
    const { chantiers, loading } = useData();

    if (loading) {
        return <LoadingState />;
    }
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ChantierStatus | 'Tous'>('Tous');

    const filteredChantiers = chantiers.filter((c: Chantier) => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.client.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'Tous' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Chantiers</h1>
                    <p className="text-slate-500 mt-1">Gérez et suivez l'avancement de vos projets.</p>
                </div>
                <Link href="/chantiers/nouveau" className="btn-primary flex items-center justify-center space-x-2">
                    <Plus size={20} />
                    <span>Nouveau Chantier</span>
                </Link>
            </div>

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
                {filteredChantiers.map((chantier) => (
                    <div
                        key={chantier.id}
                        onClick={() => router.push(`/chantiers/${chantier.id}`)}
                        className="group block glass p-6 rounded-2xl cursor-pointer card-hover border border-slate-100"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                <HardHat className="text-slate-400 group-hover:text-primary-600 transition-colors" size={24} />
                            </div>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                chantier.status === 'En cours' ? "bg-blue-50 text-blue-700" :
                                    chantier.status === 'Terminé' ? "bg-emerald-50 text-emerald-700" :
                                        "bg-amber-50 text-amber-700"
                            )}>
                                {chantier.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                            {chantier.name}
                        </h3>

                        <div className="space-y-3 mb-6">
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
                            <Link
                                href={`/chantiers/${chantier.id}/modifier`}
                                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 relative z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredChantiers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <HardHat size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Aucun chantier trouvé</h3>
                    <p className="text-slate-500 mt-1">Essayez de modifier vos filtres ou effectuez une nouvelle recherche.</p>
                </div>
            )}
        </div>
    );
}
