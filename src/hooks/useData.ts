"use client";

import { useAuth } from "@/context/AuthContext";
import { MOCK_CHANTIERS, MOCK_EXPENSES, MOCK_PAYMENTS, MOCK_DEVIS } from "@/lib/mockData";
import { useState, useEffect, useCallback } from "react";
import { Chantier, Expense, Payment, Devis } from "@/types";
import { chantierService } from "@/services/chantier.service";
import { expenseService } from "@/services/expense.service";
import { paymentService } from "@/services/payment.service";
import { devisService } from "@/services/devis.service";

export function useData() {
  const { isDemoMode } = useAuth();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isDemoMode) {
      setChantiers(MOCK_CHANTIERS);
      setExpenses(MOCK_EXPENSES);
      setPayments(MOCK_PAYMENTS);
      setDevis(MOCK_DEVIS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [chantiersData, expensesData, paymentsData, devisData] = await Promise.all([
        chantierService.findAll(),
        expenseService.findAll(),
        paymentService.findAll(),
        devisService.findAll(),
      ]);

      setChantiers(chantiersData);
      setExpenses(expensesData);
      setPayments(paymentsData);
      setDevis(devisData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Functions to add data
  const addChantier = async (chantier: Omit<Chantier, 'id'>) => {
    if (isDemoMode) {
        setChantiers(prev => [...prev, { ...chantier, id: Math.random().toString(36).substr(2, 9) }]);
        return;
    };
    try {
        const newChantier = await chantierService.create(chantier);
        setChantiers(prev => [...prev, newChantier]);
    } catch (err) {
        console.error('Failed to add chantier:', err);
        throw err;
    }
  };

  const updateChantier = async (id: string, data: Partial<Chantier>) => {
    if (isDemoMode) {
        setChantiers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
        return;
    };
    try {
        const updated = await chantierService.update(id, data);
        setChantiers(prev => prev.map(c => c.id === id ? updated : c));
    } catch (err) {
        console.error('Failed to update chantier:', err);
        throw err;
    }
  };

  const deleteChantier = async (id: string) => {
    if (isDemoMode) {
        setChantiers(prev => prev.filter(c => c.id !== id));
        return;
    };
    try {
        await chantierService.remove(id);
        setChantiers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
        console.error('Failed to delete chantier:', err);
        throw err;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (isDemoMode) {
        setExpenses(prev => [...prev, { ...expense, id: Math.random().toString(36).substr(2, 9) }]);
        return;
    };
    try {
        const newExpense = await expenseService.create(expense);
        setExpenses(prev => [...prev, newExpense]);
    } catch (err) {
        console.error('Failed to add expense:', err);
        throw err;
    }
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    if (isDemoMode) {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
        return;
    };
    try {
        const updated = await expenseService.update(id, data);
        setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    } catch (err) {
        console.error('Failed to update expense:', err);
        throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    if (isDemoMode) {
        setExpenses(prev => prev.filter(e => e.id !== id));
        return;
    };
    try {
        await expenseService.remove(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
        console.error('Failed to delete expense:', err);
        throw err;
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    if (isDemoMode) {
        setPayments(prev => [...prev, { ...payment, id: Math.random().toString(36).substr(2, 9) }]);
        return;
    };
    try {
        const newPayment = await paymentService.create(payment);
        setPayments(prev => [...prev, newPayment]);
    } catch (err) {
        console.error('Failed to add payment:', err);
        throw err;
    }
  };

  const updatePayment = async (id: string, data: Partial<Payment>) => {
    if (isDemoMode) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        return;
    };
    try {
        const updated = await paymentService.update(id, data);
        setPayments(prev => prev.map(p => p.id === id ? updated : p));
    } catch (err) {
        console.error('Failed to update payment:', err);
        throw err;
    }
  };

  const deletePayment = async (id: string) => {
    if (isDemoMode) {
        setPayments(prev => prev.filter(p => p.id !== id));
        return;
    };
    try {
        await paymentService.remove(id);
        setPayments(prev => prev.filter(p => p.id !== id));
    } catch (err) {
        console.error('Failed to delete payment:', err);
        throw err;
    }
  };

  const addDevis = async (newItem: Omit<Devis, 'id'>) => {
    if (isDemoMode) {
        setDevis(prev => [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]);
        return;
    };
    try {
        const newDevis = await devisService.create(newItem);
        setDevis(prev => [...prev, newDevis]);
    } catch (err) {
        console.error('Failed to add devis:', err);
        throw err;
    }
  };

  const updateDevis = async (id: string, data: Partial<Devis>) => {
    if (isDemoMode) {
        setDevis(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
        return;
    };
    try {
        const updated = await devisService.update(id, data);
        setDevis(prev => prev.map(d => d.id === id ? updated : d));
    } catch (err) {
        console.error('Failed to update devis:', err);
        throw err;
    }
  };

  const deleteDevis = async (id: string) => {
    if (isDemoMode) {
        setDevis(prev => prev.filter(d => d.id !== id));
        return;
    };
    try {
        await devisService.remove(id);
        setDevis(prev => prev.filter(d => d.id !== id));
    } catch (err) {
        console.error('Failed to delete devis:', err);
        throw err;
    }
  };

  return {
    chantiers,
    expenses,
    payments,
    devis,
    loading,
    error,
    refreshData: fetchData,
    addChantier,
    updateChantier,
    deleteChantier,
    addExpense,
    updateExpense,
    deleteExpense,
    addPayment,
    updatePayment,
    deletePayment,
    addDevis,
    updateDevis,
    deleteDevis
  };
}
