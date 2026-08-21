import React from "react";
import { View, ViewProps } from "react-native";
import clsx from "clsx";

export type CardVariant = "default" | "elevated" | "outlined" | "glass";

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default:
      "bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none",
    elevated:
      "bg-white dark:bg-[#131B2E] shadow-md shadow-slate-300/40 dark:shadow-black/50 border border-slate-200/60 dark:border-slate-800",
    outlined:
      "bg-transparent border border-slate-200 dark:border-slate-800",
    glass:
      "bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 shadow-lg",
  };

  return (
    <View
      className={clsx("rounded-2xl p-5", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </View>
  );
}
