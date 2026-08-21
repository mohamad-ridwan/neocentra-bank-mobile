import React from "react";
import { Pressable, Text, View } from "react-native";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react-native";
import clsx from "clsx";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function Toast({
  type = "info",
  title,
  message,
  onDismiss,
  className,
}: ToastProps) {
  const typeConfig: Record<
    ToastType,
    {
      container: string;
      titleColor: string;
      messageColor: string;
      icon: React.ReactNode;
    }
  > = {
    success: {
      container: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
      titleColor: "text-emerald-800 dark:text-emerald-300",
      messageColor: "text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle2 size={20} color="#10B981" />,
    },
    error: {
      container: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
      titleColor: "text-rose-800 dark:text-rose-300",
      messageColor: "text-rose-700 dark:text-rose-400",
      icon: <XCircle size={20} color="#EF4444" />,
    },
    warning: {
      container: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      titleColor: "text-amber-800 dark:text-amber-300",
      messageColor: "text-amber-700 dark:text-amber-400",
      icon: <AlertCircle size={20} color="#F59E0B" />,
    },
    info: {
      container: "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      titleColor: "text-blue-800 dark:text-blue-300",
      messageColor: "text-blue-700 dark:text-blue-400",
      icon: <Info size={20} color="#0066FF" />,
    },
  };

  const config = typeConfig[type];

  return (
    <View
      className={clsx(
        "flex-row items-start p-4 rounded-xl border shadow-sm mb-4",
        config.container,
        className
      )}
    >
      <View className="mr-3 mt-0.5">{config.icon}</View>

      <View className="flex-1">
        {title && (
          <Text className={clsx("font-semibold text-sm mb-0.5", config.titleColor)}>
            {title}
          </Text>
        )}
        <Text className={clsx("text-xs leading-relaxed", config.messageColor)}>
          {message}
        </Text>
      </View>

      {onDismiss && (
        <Pressable onPress={onDismiss} className="p-1 -mr-1" hitSlop={8}>
          <X size={16} color="#94A3B8" />
        </Pressable>
      )}
    </View>
  );
}
