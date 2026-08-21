import { create } from "zustand";
import { User } from "@/modules/auth/domain/entities/user.entity";
import { httpClient } from "@/shared/infrastructure/http-client";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  rememberedIdentifier: string | null;

  // Actions
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  toggleBiometric: (enabled?: boolean) => void;
  setRememberedIdentifier: (identifier: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isBiometricEnabled: false,
  rememberedIdentifier: "nasabah@neocentra.bank",

  setSession: (user, token) => {
    httpClient.setAuthToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    httpClient.setAuthToken(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  toggleBiometric: (enabled) => {
    set((state) => ({
      isBiometricEnabled: enabled !== undefined ? enabled : !state.isBiometricEnabled,
    }));
  },

  setRememberedIdentifier: (identifier) => {
    set({ rememberedIdentifier: identifier });
  },
}));
