export type AccountStatus = "ACTIVE" | "PENDING" | "FROZEN" | "CLOSED";

export interface BankAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}
