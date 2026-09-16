import { create } from "zustand";
import { BankAccount, ProductType } from "../../domain/entities/account.entity";

export type WizardStep = 1 | 2 | 3;

interface OpenAccountState {
  currentStep: WizardStep;
  productType: ProductType;
  occupation: string;
  monthlyIncome: string;
  sourceOfFunds: string;
  agreedToTerms: boolean;
  pin: string;
  confirmPin: string;
  errorMessage: string | null;
  createdAccount: BankAccount | null;

  // Actions
  setCurrentStep: (step: WizardStep) => void;
  setProductType: (productType: ProductType) => void;
  setEmploymentData: (data: { occupation: string; monthlyIncome: string; sourceOfFunds: string }) => void;
  setAgreedToTerms: (agreed: boolean) => void;
  appendPinDigit: (digit: string) => void;
  deletePinDigit: () => void;
  appendConfirmPinDigit: (digit: string) => void;
  deleteConfirmPinDigit: () => void;
  clearPins: () => void;
  setErrorMessage: (msg: string | null) => void;
  setCreatedAccount: (account: BankAccount | null) => void;
  resetWizard: () => void;
}

const initialState = {
  currentStep: 1 as WizardStep,
  productType: "REGULAR_SAVINGS" as ProductType,
  occupation: "Karyawan Swasta",
  monthlyIncome: "10000000_20000000",
  sourceOfFunds: "Gaji",
  agreedToTerms: true,
  pin: "",
  confirmPin: "",
  errorMessage: null,
  createdAccount: null,
};

export const useOpenAccountStore = create<OpenAccountState>((set) => ({
  ...initialState,

  setCurrentStep: (currentStep) => set({ currentStep, errorMessage: null }),
  setProductType: (productType) => set({ productType }),
  setEmploymentData: (data) => set({ ...data }),
  setAgreedToTerms: (agreedToTerms) => set({ agreedToTerms }),

  appendPinDigit: (digit) =>
    set((state) => {
      if (state.pin.length >= 6) return state;
      return { pin: state.pin + digit, errorMessage: null };
    }),

  deletePinDigit: () =>
    set((state) => ({
      pin: state.pin.slice(0, -1),
      errorMessage: null,
    })),

  appendConfirmPinDigit: (digit) =>
    set((state) => {
      if (state.confirmPin.length >= 6) return state;
      return { confirmPin: state.confirmPin + digit, errorMessage: null };
    }),

  deleteConfirmPinDigit: () =>
    set((state) => ({
      confirmPin: state.confirmPin.slice(0, -1),
      errorMessage: null,
    })),

  clearPins: () => set({ pin: "", confirmPin: "", errorMessage: null }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  setCreatedAccount: (createdAccount) => set({ createdAccount }),
  resetWizard: () => set({ ...initialState }),
}));
