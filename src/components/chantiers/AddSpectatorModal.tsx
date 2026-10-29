'use client';

import { useState } from 'react';
import { X, UserPlus, Eye, AlertCircle } from 'lucide-react';
import UserSelector from './UserSelector';

interface AddSpectatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userIds: string[]) => Promise<void>;
    existingSpectatorIds: string[];
}

export default function AddSpectatorModal({
    isOpen,
    onClose,
    onAdd,
    existingSpectatorIds,
}: AddSpectatorModalProps) {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (selectedUserIds.length === 0) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await onAdd(selectedUserIds);
            setSelectedUserIds([]);
            onClose();
        } catch (err: any) {
            setError(err?.message || "Erreur lors de l'ajout des spectateurs");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div 
                className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Ajouter des spectateurs</h2>
                            <p className="text-xs text-slate-500">Donnez un accès en consultation à ce projet.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info Notice */}
                <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-800 text-xs">
                    <Eye size={16} className="shrink-0 mt-0.5 text-blue-600" />
                    <span>
                        Les spectateurs peuvent voir l'ensemble du chantier (indicateurs, dépenses, encaissements, devis, synthèse PDF), mais <strong>ne peuvent ni modifier ni ajouter</strong> de données.
                    </span>
                </div>

                {error && (
                    <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-100">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Selector */}
                <UserSelector
                    selectedUserIds={selectedUserIds}
                    onChange={setSelectedUserIds}
                    excludedUserIds={existingSpectatorIds}
                    title="Choisir parmi les utilisateurs"
                    description="Sélectionnez un ou plusieurs utilisateurs inscrits à ajouter"
                />

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedUserIds.length === 0}
                        className="btn-primary text-xs flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{isSubmitting ? 'Ajout en cours...' : `Confirmer (${selectedUserIds.length})`}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
