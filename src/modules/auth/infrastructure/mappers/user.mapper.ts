import { CustomerStatus, User } from "@/modules/auth/domain/entities/user.entity";

export interface BackendCustomerDTO {
  customer_id?: string;
  id?: string;
  nik?: string;
  full_name?: string;
  fullName?: string;
  email?: string;
  phone_number?: string;
  phoneNumber?: string;
  address?: string;
  status?: string;
  account_number?: string;
  accountNumber?: string;
  balance?: number;
  created_at?: string;
  createdAt?: string;
}

export class UserMapper {
  /**
   * Transforms raw backend DTO to domain User entity
   */
  public static toDomain(dto: BackendCustomerDTO, fallbackData?: Partial<User>): User {
    const rawStatus = (dto.status || "PENDING_VERIFICATION").toUpperCase();
    let status: CustomerStatus = "PENDING_VERIFICATION";

    if (rawStatus === "ACTIVE") status = "ACTIVE";
    else if (rawStatus === "BLOCKED") status = "BLOCKED";
    else if (rawStatus === "SUSPENDED") status = "SUSPENDED";

    return {
      id: dto.customer_id || dto.id || fallbackData?.id || `cust_${Date.now()}`,
      nik: dto.nik || fallbackData?.nik || "3201010101010001",
      fullName: dto.full_name || dto.fullName || fallbackData?.fullName || "Nasabah Neocentra",
      email: dto.email || fallbackData?.email || "nasabah@neocentra.bank",
      phoneNumber: dto.phone_number || dto.phoneNumber || fallbackData?.phoneNumber || "+6281234567890",
      address: dto.address || fallbackData?.address,
      status,
      accountNumber: dto.account_number || dto.accountNumber || "8809 1234 5678",
      balance: dto.balance ?? fallbackData?.balance ?? 25000000,
      createdAt: dto.created_at || dto.createdAt || fallbackData?.createdAt || new Date().toISOString(),
    };
  }
}
