'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/hooks/useData';
import ExpenseForm from '@/components/forms/ExpenseForm';

export default function NewExpensePage() {
    const router = useRouter();
    const { chantiers, addExpense } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await addExpense(data);
            router.push('/depenses');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ExpenseForm
            chantiers={chantiers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            title="Nouvelle Dépense"
            subtitle="Enregistrer un achat ou un coût de chantier."
            submitLabel="Enregistrer"
        />
    );
}
