import { BankAccount, AccountStatus } from "../../domain/entities/account.entity";

export interface AccountBackendDTO {
  account_id: string;
  customer_id: string;
  account_number: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const mapAccountDtoToEntity = (dto: AccountBackendDTO): BankAccount => {
  return {
    id: dto.account_id,
    customerId: dto.customer_id,
    accountNumber: dto.account_number,
    balance: dto.balance,
    currency: dto.currency || "IDR",
    status: (dto.status as AccountStatus) || "PENDING",
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
};
