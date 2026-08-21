import React from "react";
import { Text, View } from "react-native";
import clsx from "clsx";

export type BadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "neutral";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Badge({
  label,
  variant = "info",
  icon,
  className,
  textClassName,
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
    success: {
      container: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-400",
    },
    warning: {
      container: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
    },
    info: {
      container: "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-400",
    },
    danger: {
      container: "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-400",
    },
    neutral: {
      container: "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
      text: "text-slate-700 dark:text-slate-300",
    },
  };

  const style = variantStyles[variant];

  return (
    <View
      className={clsx(
        "flex-row items-center self-start px-2.5 py-1 rounded-full",
        style.container,
        className
      )}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text
        className={clsx(
          "text-xs font-semibold tracking-wide",
          style.text,
          textClassName
        )}
      >
        {label}
      </Text>
    </View>
  );
}
