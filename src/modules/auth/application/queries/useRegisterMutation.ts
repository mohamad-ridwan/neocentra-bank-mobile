import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AuthApi,
  RegisterResponse,
} from "@/modules/auth/infrastructure/api/auth.api";
import { RegisterFormData } from "@/modules/auth/domain/schemas/register.schema";

export function useRegisterMutation(options?: {
  onSuccess?: (data: RegisterResponse) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (data: RegisterFormData) => {
      return await AuthApi.register(data);
    },
    onSuccess: (data: RegisterResponse) => {
      // Bersihkan seluruh cache aplikasi untuk keamanan perbankan
      queryClient.clear();
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
    gcTime: 0,
  });
}
