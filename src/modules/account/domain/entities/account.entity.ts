export type AccountStatus =
  | "ACTIVE"
  | "PENDING_KYC"
  | "PENDING"
  | "SUSPENDED"
  | "FROZEN"
  | "CLOSED";

export type ProductType = "REGULAR_SAVINGS" | "PRIORITY_SAVINGS" | "STUDENT_SAVINGS";

export interface BankAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  productType: ProductType;
  branchCode: string;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmploymentData {
  occupation: string;
  monthlyIncome: string;
  sourceOfFunds: string;
}

export interface OpenAccountPayload {
  productType: ProductType;
  branchCode: string;
  pin: string;
  employmentData: EmploymentData;
}
