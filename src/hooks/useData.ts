"use client";

import { useAuth } from "@/context/AuthContext";
import { MOCK_CHANTIERS, MOCK_EXPENSES, MOCK_PAYMENTS, MOCK_DEVIS } from "@/lib/mockData";
import { useState, useEffect } from "react";
import { Chantier, Expense, Payment, Devis } from "@/types";

export function useData() {
  const { isDemoMode } = useAuth();
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);

  useEffect(() => {
    if (isDemoMode) {
      setChantiers(MOCK_CHANTIERS);
      setExpenses(MOCK_EXPENSES);
      setPayments(MOCK_PAYMENTS);
      setDevis(MOCK_DEVIS);
    } else {
      // Load user data from localStorage for "real" mode
      const savedChantiers = localStorage.getItem('user_chantiers');
      const savedExpenses = localStorage.getItem('user_expenses');
      const savedPayments = localStorage.getItem('user_payments');
      const savedDevis = localStorage.getItem('user_devis');

      setChantiers(savedChantiers ? JSON.parse(savedChantiers) : []);
      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
      setPayments(savedPayments ? JSON.parse(savedPayments) : []);
      setDevis(savedDevis ? JSON.parse(savedDevis) : []);
    }
  }, [isDemoMode]);

  // Functions to add data (only for real mode)
  const addChantier = (chantier: Chantier) => {
    if (isDemoMode) return;
    const newChantiers = [...chantiers, chantier];
    setChantiers(newChantiers);
    localStorage.setItem('user_chantiers', JSON.stringify(newChantiers));
  };

  const addExpense = (expense: Expense) => {
    if (isDemoMode) return;
    const newExpenses = [...expenses, expense];
    setExpenses(newExpenses);
    localStorage.setItem('user_expenses', JSON.stringify(newExpenses));
  };

  const addPayment = (payment: Payment) => {
    if (isDemoMode) return;
    const newPayments = [...payments, payment];
    setPayments(newPayments);
    localStorage.setItem('user_payments', JSON.stringify(newPayments));
  };

  const addDevis = (newItem: Devis) => {
    if (isDemoMode) return;
    const newList = [...devis, newItem];
    setDevis(newList);
    localStorage.setItem('user_devis', JSON.stringify(newList));
  };

  return {
    chantiers,
    expenses,
    payments,
    devis,
    addChantier,
    addExpense,
    addPayment,
    addDevis
  };
}
