import { BankAccount, ProductType, AccountStatus } from "../../domain/entities/account.entity";

export interface AccountApiResponseDTO {
  account_id: string;
  customer_id?: string;
  account_number: string;
  balance: number;
  currency: string;
  product_type?: string;
  branch_code?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export class AccountMapper {
  public static toDomain(dto: AccountApiResponseDTO, customerId = ""): BankAccount {
    return {
      id: dto.account_id,
      customerId: dto.customer_id || customerId,
      accountNumber: dto.account_number,
      balance: Number(dto.balance) || 0,
      currency: dto.currency || "IDR",
      productType: (dto.product_type as ProductType) || "REGULAR_SAVINGS",
      branchCode: dto.branch_code || "001",
      status: (dto.status as AccountStatus) || "ACTIVE",
      createdAt: dto.created_at,
      updatedAt: dto.updated_at || dto.created_at,
    };
  }
}
