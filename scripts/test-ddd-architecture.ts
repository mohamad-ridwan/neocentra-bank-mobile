import { loginSchema } from "../src/modules/auth/domain/schemas/login.schema";
import { registerSchema } from "../src/modules/auth/domain/schemas/register.schema";
import { UserMapper } from "../src/modules/auth/infrastructure/mappers/user.mapper";
import { formatCurrencyIDR, formatNIK, formatPhoneDisplay, maskNIK, normalizePhoneNumber } from "../src/shared/utils/formatters";
import { generateIdempotencyKey } from "../src/shared/utils/idempotency";
import { useAuthStore } from "../src/modules/auth/application/store/useAuthStore";

console.log("==================================================");
console.log("  NEOCENTRA BANK MOBILE ARCHITECTURE VERIFICATION ");
console.log("==================================================");

let testsPassed = 0;
let testsTotal = 0;

function assert(condition: boolean, testName: string) {
  testsTotal++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Test Login Schema
console.log("\n--- 1. Testing Domain: Login Schema ---");
const validLogin = loginSchema.safeParse({
  identifier: "nasabah@neocentra.bank",
  password: "Password123#",
  rememberMe: true,
});
assert(validLogin.success === true, "Valid email & password parses successfully");

const invalidLoginShortPass = loginSchema.safeParse({
  identifier: "nasabah@neocentra.bank",
  password: "123",
});
assert(invalidLoginShortPass.success === false, "Fails on password < 6 characters");

const validNIKLogin = loginSchema.safeParse({
  identifier: "3201010101990001",
  password: "Password123#",
});
assert(validNIKLogin.success === true, "Valid 16-digit NIK identifier passes");

// 2. Test Register Schema
console.log("\n--- 2. Testing Domain: Register Schema ---");
const validRegister = registerSchema.safeParse({
  nik: "3201010101990001",
  fullName: "Budi Santoso",
  email: "budi@neocentra.bank",
  phoneNumber: "081234567890",
  address: "Jl. Sudirman No 10, Jakarta",
  password: "Password123#",
  confirmPassword: "Password123#",
  agreeTerms: true,
});
assert(validRegister.success === true, "Valid full registration payload passes");

const invalidNIKRegister = registerSchema.safeParse({
  nik: "12345", // too short
  fullName: "Budi Santoso",
  email: "budi@neocentra.bank",
  phoneNumber: "081234567890",
  address: "Jl. Sudirman No 10, Jakarta",
  password: "Password123#",
  confirmPassword: "Password123#",
  agreeTerms: true,
});
assert(invalidNIKRegister.success === false, "Rejects NIK shorter than 16 digits");

const passwordMismatchRegister = registerSchema.safeParse({
  nik: "3201010101990001",
  fullName: "Budi Santoso",
  email: "budi@neocentra.bank",
  phoneNumber: "081234567890",
  address: "Jl. Sudirman No 10, Jakarta",
  password: "Password123#",
  confirmPassword: "DifferentPassword123#",
  agreeTerms: true,
});
assert(passwordMismatchRegister.success === false, "Rejects password mismatch");

const termsDisagreeRegister = registerSchema.safeParse({
  nik: "3201010101990001",
  fullName: "Budi Santoso",
  email: "budi@neocentra.bank",
  phoneNumber: "081234567890",
  address: "Jl. Sudirman No 10, Jakarta",
  password: "Password123#",
  confirmPassword: "Password123#",
  agreeTerms: false,
});
assert(termsDisagreeRegister.success === false, "Rejects when agreeTerms is false");

// 3. Test Infrastructure: UserMapper
console.log("\n--- 3. Testing Infrastructure: UserMapper ---");
const domainUser = UserMapper.toDomain({
  customer_id: "cust_998877",
  nik: "3201010101990001",
  full_name: "Siti Aminah",
  email: "siti@neocentra.bank",
  status: "PENDING_VERIFICATION",
});
assert(domainUser.id === "cust_998877", "Maps customer_id correctly");
assert(domainUser.status === "PENDING_VERIFICATION", "Maps PENDING_VERIFICATION status");
assert(domainUser.fullName === "Siti Aminah", "Maps fullName correctly");

// 4. Test Shared Utils: Formatters & Idempotency
console.log("\n--- 4. Testing Shared Utils: Formatters & Idempotency ---");
assert(formatNIK("3201010101990001") === "3201 0101 0199 0001", "formatNIK chunks into 4 digits");
assert(maskNIK("3201010101990001") === "3201 •••• •••• 0001", "maskNIK properly masks middle digits");
assert(normalizePhoneNumber("08123456789") === "+628123456789", "normalizePhoneNumber converts 08 to +62");
assert(formatCurrencyIDR(15000000).includes("15.000.000"), "formatCurrencyIDR formats Indonesian Rupiah");

const key1 = generateIdempotencyKey();
const key2 = generateIdempotencyKey();
assert(key1.length === 36 && key1 !== key2, "generateIdempotencyKey creates unique UUID v4");

// 5. Test Application: Zustand AuthStore
console.log("\n--- 5. Testing Application: Zustand AuthStore ---");
useAuthStore.getState().setSession(domainUser, "mock_token_jwt_123");
assert(useAuthStore.getState().isAuthenticated === true, "setSession sets isAuthenticated to true");
assert(useAuthStore.getState().user?.id === "cust_998877", "AuthStore holds current user");

useAuthStore.getState().logout();
assert(useAuthStore.getState().isAuthenticated === false, "logout resets isAuthenticated to false");
assert(useAuthStore.getState().user === null, "logout clears user state");

console.log("\n==================================================");
console.log(`  RESULT: ${testsPassed}/${testsTotal} TESTS PASSED!`);
console.log("==================================================");
