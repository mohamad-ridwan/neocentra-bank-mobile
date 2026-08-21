/**
 * Domain Models for Authentication & Customer Context
 * Pure TypeScript interfaces, UI-agnostic
 */

export type CustomerStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "BLOCKED"
  | "SUSPENDED";

export interface User {
  id: string;
  nik: string; // 16 digit National Identity Number
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  status: CustomerStatus;
  avatarUrl?: string;
  accountNumber?: string;
  balance?: number;
  createdAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
}
