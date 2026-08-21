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
      "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm",
    elevated:
      "bg-white dark:bg-slate-900 shadow-md shadow-slate-900/5 dark:shadow-black/40 border border-slate-100 dark:border-slate-800",
    outlined:
      "bg-transparent border border-slate-200 dark:border-slate-800",
    glass:
      "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/40 shadow-lg",
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
