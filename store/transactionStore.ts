import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransactionRecord } from '@/types';

interface TransactionState {
  transactions: TransactionRecord[];
  currentTx: TransactionRecord | null;

  addTransaction: (tx: TransactionRecord) => void;
  updateTransaction: (hash: string, updates: Partial<TransactionRecord>) => void;
  setCurrentTx: (tx: TransactionRecord | null) => void;
  clearTransactions: () => void;
  getRecentTransactions: (limit?: number) => TransactionRecord[];
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      currentTx: null,

      addTransaction: (tx: TransactionRecord) => {
        set((state) => ({
          transactions: [tx, ...state.transactions],
          currentTx: tx,
        }));
      },

      updateTransaction: (hash: string, updates: Partial<TransactionRecord>) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.hash === hash ? { ...tx, ...updates } : tx,
          ),
          currentTx:
            state.currentTx?.hash === hash
              ? { ...state.currentTx, ...updates }
              : state.currentTx,
        }));
      },

      setCurrentTx: (tx: TransactionRecord | null) => {
        set({ currentTx: tx });
      },

      clearTransactions: () => {
        set({ transactions: [], currentTx: null });
      },

      getRecentTransactions: (limit?: number) => {
        const { transactions } = get();
        const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
        return limit ? sorted.slice(0, limit) : sorted;
      },
    }),
    { name: 'transaction-store' },
  ),
);
