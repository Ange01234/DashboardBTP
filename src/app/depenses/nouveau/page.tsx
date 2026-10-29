'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/context/AuthContext';
import ExpenseForm from '@/components/forms/ExpenseForm';

export default function NewExpensePage() {
    const router = useRouter();
    const { chantiers, addExpense } = useData();
    const { user: currentUser, isDemoMode } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only chantiers where the user is owner can receive expenses
    const ownedChantiers = useMemo(() => {
        return chantiers.filter(c => {
            if (isDemoMode) return c.userId === 'demo-user' || !c.userId;
            if (!currentUser?.id) return true;
            if (!c.userId) return true;
            const ownerId = typeof c.userId === 'object' 
                ? (c.userId as any)._id || (c.userId as any).id 
                : c.userId;
            return ownerId === currentUser.id;
        });
    }, [chantiers, currentUser?.id, isDemoMode]);

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
            chantiers={ownedChantiers}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            title="Nouvelle Dépense"
            subtitle="Enregistrer un achat ou un coût de chantier (réservé aux propriétaires)."
            submitLabel="Enregistrer"
        />
    );
}
