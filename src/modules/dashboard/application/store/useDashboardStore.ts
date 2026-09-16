import { create } from "zustand";
import { BankAccount } from "../../domain/entities/account.entity";

interface DashboardState {
  accounts: BankAccount[];
  activeAccount: BankAccount | null;
  isLoadingAccounts: boolean;
  setAccounts: (accounts: BankAccount[]) => void;
  setActiveAccount: (account: BankAccount | null) => void;
  setIsLoadingAccounts: (isLoading: boolean) => void;
  resetDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  accounts: [],
  activeAccount: null,
  isLoadingAccounts: false,
  setAccounts: (accounts) => {
    const active = accounts.find((a) => a.status === "ACTIVE") || null;
    set({ accounts, activeAccount: active });
  },
  setActiveAccount: (activeAccount) => set({ activeAccount }),
  setIsLoadingAccounts: (isLoadingAccounts) => set({ isLoadingAccounts }),
  resetDashboard: () => set({ accounts: [], activeAccount: null, isLoadingAccounts: false }),
}));
