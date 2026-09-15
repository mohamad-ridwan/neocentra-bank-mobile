import { useState } from "react";
import { loginSchema } from "@/modules/auth/domain/schemas/login.schema";
import { useLoginMutation } from "@/modules/auth/application/queries/useLoginMutation";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";

export interface UseLoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps = {}) {
  const rememberedIdentifier = useAuthStore((state) => state.rememberedIdentifier);

  const [identifier, setIdentifier] = useState(rememberedIdentifier || "nasabah@neocentra.bank");
  const [password, setPassword] = useState("Password123#");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      setErrorMessage(null);
      onSuccess?.();
    },
    onError: (err) => {
      setErrorMessage(err.message || "Gagal masuk. Periksa kembali data akun Anda.");
    },
  });

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);
    if (errors.identifier) {
      setErrors((prev) => ({ ...prev, identifier: "" }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleToggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  const handleValidationAndSubmit = () => {
    setErrorMessage(null);
    const result = loginSchema.safeParse({
      identifier: identifier.trim(),
      password: password.trim(),
      rememberMe,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate(result.data);
  };

  const handleFillDemo = () => {
    setIdentifier("nasabah@neocentra.bank");
    setPassword("Neocentra2026!");
    setErrors({});
    setErrorMessage(null);
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    errorMessage,
    setErrorMessage,
    loginMutation,
    handleIdentifierChange,
    handlePasswordChange,
    handleToggleRememberMe,
    handleValidationAndSubmit,
    handleFillDemo,
  };
}
