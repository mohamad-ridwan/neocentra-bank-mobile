export const AAD_CONTEXT = {
  NIK: "customer_nik_aad",
  FULL_NAME: "customer_full_name_aad",
  EMAIL: "customer_email_aad",
  PHONE_NUMBER: "customer_phone_number_aad",
  ADDRESS: "customer_address_aad",
  FALLBACK_PII: "customer_pii",
} as const;

export const FIELD_TAG = {
  NIK: 0x01,
  FULL_NAME: 0x02,
  EMAIL: 0x03,
  PHONE_NUMBER: 0x04,
  ADDRESS: 0x05,
  PASSWORD_HASH: 0x06,
} as const;

