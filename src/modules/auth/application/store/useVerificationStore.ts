import { create } from "zustand";

export interface VerificationSession {
  email: string;
  verificationToken: string;
}

export interface VerificationState {
  session: VerificationSession | null;
  setVerificationSession: (session: VerificationSession) => void;
  clearVerificationSession: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  session: null,
  setVerificationSession: (session) => set({ session }),
  clearVerificationSession: () => set({ session: null }),
}));
