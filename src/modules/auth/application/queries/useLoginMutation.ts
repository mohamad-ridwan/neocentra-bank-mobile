import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthApi,
  LoginResponse,
} from "@/modules/auth/infrastructure/api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { RequestCustomerLoginPayload } from "../../infrastructure/mappers/user.mapper";

export function useLoginMutation(options?: {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  const setSession = useAuthStore((state) => state.setSession);
  const setRememberedIdentifier = useAuthStore(
    (state) => state.setRememberedIdentifier,
  );

  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (data: RequestCustomerLoginPayload) => {
      const result = await AuthApi.login(data);
      return { result, data };
    },
    onSuccess: ({ result, data }) => {
      setSession(result.user, result.token);
      if (data.rememberMe) {
        setRememberedIdentifier(data.identifier);
      }
      queryClient.clear();
      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
    gcTime: 0,
  });
}
