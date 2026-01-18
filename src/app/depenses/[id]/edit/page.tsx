'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useData } from '@/hooks/useData';
import ExpenseForm from '@/components/forms/ExpenseForm';
import LoadingState from '@/components/ui/LoadingState';

export default function EditExpensePage() {
    const router = useRouter();
    const params = useParams();
    const { expenses, chantiers, updateExpense, loading } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expenseId = params.id as string;
    const expense = expenses.find(e => e.id === expenseId);

    if (loading) {
        return <LoadingState />;
    }

    if (!expense) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-slate-800">Dépense introuvable</h2>
                <button
                    onClick={() => router.push('/depenses')}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold"
                >
                    Retour aux dépenses
                </button>
            </div>
        );
    }

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await updateExpense(expenseId, data);
            router.push('/depenses');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ExpenseForm
            initialData={expense}
            chantiers={chantiers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            title="Modifier la Dépense"
            subtitle="Mettre à jour les informations de la dépense."
            submitLabel="Mettre à jour"
        />
    );
}
