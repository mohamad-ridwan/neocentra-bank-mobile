import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormData,
} from "@/modules/auth/domain/schemas/login.schema";
import { useLoginMutation } from "@/modules/auth/application/queries/useLoginMutation";
import { useAuthStore } from "@/modules/auth/application/store/useAuthStore";
import { HybridCryptoService } from "@/shared/security/hybridCryptoService";
import UseToast from "@/shared/hooks/UseToast";
import useScreenCapture from "@/shared/hooks/useScreenCapture";
import Reactotron from "reactotron-react-native";

export interface UseLoginFormProps {
  scrollRef?: React.RefObject<ScrollView | null>;
  onSuccess?: () => void;
}

const FIELD_ORDER: (keyof LoginFormData)[] = ["identifier", "password"];

export function useLoginForm({
  scrollRef,
  onSuccess,
}: UseLoginFormProps = {}) {
  useScreenCapture();

  const { handleToast } = UseToast();
  const rememberedIdentifier = useAuthStore(
    (state) => state.rememberedIdentifier,
  );

  const inputRefs = useRef<Record<string, any>>({});

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: rememberedIdentifier || "",
      password: "",
      rememberMe: true,
    },
    mode: "onBlur",
  });

  const allValues = watch();

  useEffect(() => {
    if (__DEV__) {
      Reactotron.display({
        name: "React Hook Form (Login)",
        preview: "Login Form Values & State Update",
        value: {
          values: allValues,
          errors: errors,
          isDirty: isDirty,
          isSubmitting: isSubmitting,
        },
      });
    }
  }, [allValues, errors, isDirty, isSubmitting]);

  const loginMutation = useLoginMutation({
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err) => {
      handleToast({
        message: err.message || "Gagal masuk. Periksa kembali data akun Anda.",
        title: "Login Gagal",
        type: "error",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    const loginJSON = JSON.stringify({
      identifier: data.identifier.trim(),
      password: data.password.trim(),
    });

    const hybridPayload =
      HybridCryptoService.encryptPayloadWithKey(loginJSON);

    loginMutation.mutate({
      ...hybridPayload,
      identifier: data.identifier.trim(),
      rememberMe: !!data.rememberMe,
    });
  };

  const onError = (formErrors: FieldErrors<LoginFormData>) => {
    const firstError = FIELD_ORDER.find((field) => formErrors[field]);
    if (!firstError) return;

    const targetElement = inputRefs.current[firstError];
    if (targetElement) {
      targetElement.focus?.();

      if (scrollRef?.current && targetElement.measureLayout) {
        targetElement.measureLayout(
          scrollRef.current,
          (_x: number, y: number) => {
            scrollRef.current?.scrollTo({
              y: Math.max(0, y - 24),
              animated: true,
            });
          },
          () => {},
        );
      }
    }
  };

  const handleFillDemo = () => {
    reset({
      identifier: "nasabah@neocentra.bank",
      password: "Password123#",
      rememberMe: true,
    });
  };

  const handlePasteBlocked = () => {
    handleToast({
      message:
        "Demi keamanan perbankan, pengisian data dari papan klip (paste) tidak diperbolehkan.",
      title: "Keamanan Perbankan",
      type: "warning",
    });
  };

  return {
    control,
    errors,
    inputRefs,
    isPending: loginMutation.isPending,
    handleSubmit: handleSubmit(onSubmit, onError),
    handleFillDemo,
    handlePasteBlocked,
    watch,
    setValue,
  };
}
