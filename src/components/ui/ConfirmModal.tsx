'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
    error?: string | null;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    isLoading = false,
    error = null,
}: ConfirmModalProps) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    const iconConfig = {
        danger: {
            bg: 'bg-rose-100 text-rose-600',
            button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
            icon: Trash2,
        },
        warning: {
            bg: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
            icon: AlertTriangle,
        },
        primary: {
            bg: 'bg-primary-100 text-primary-600',
            button: 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20',
            icon: AlertCircle,
        },
    }[variant];

    const IconComponent = iconConfig.icon;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => {
                if (!isLoading) onClose();
            }}
        >
            <div 
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 relative animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconConfig.bg}`}>
                            <IconComponent size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                        title="Fermer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Message */}
                <div className="text-sm text-slate-600 leading-relaxed">
                    {message}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-100">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 ${iconConfig.button}`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>En cours...</span>
                            </>
                        ) : (
                            <span>{confirmText}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

