import { useMutation } from "@tanstack/react-query";
import { AccountApi, VerifyPinResponse } from "../../infrastructure/api/account.api";

interface VerifyPinPayload {
  accountId: string;
  pin: string;
}

export const useVerifyPinMutation = () => {
  return useMutation<VerifyPinResponse, Error, VerifyPinPayload>({
    mutationFn: ({ accountId, pin }) => AccountApi.verifyPin(accountId, pin),
  });
};
