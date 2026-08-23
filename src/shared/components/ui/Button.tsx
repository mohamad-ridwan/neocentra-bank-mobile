import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from "react-native";
import clsx from "clsx";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "emerald";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const isActionDisabled = disabled || isLoading;

  // Base container styles
  const baseContainerStyles =
    "flex-row items-center justify-center rounded-xl font-medium active:opacity-80";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "py-2 px-3.5",
    md: "py-3.5 px-5",
    lg: "py-4 px-6",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#0066FF] shadow-sm active:bg-blue-700",
    secondary:
      "bg-slate-100 dark:bg-slate-800/90 active:bg-slate-200 dark:active:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60",
    outline:
      "border border-slate-300 dark:border-slate-700 bg-transparent active:bg-slate-100/70 dark:active:bg-slate-800/50",
    ghost: "bg-transparent active:bg-slate-100 dark:active:bg-slate-800/80",
    danger: "bg-rose-600 active:bg-rose-700 shadow-sm",
    emerald: "bg-emerald-600 active:bg-emerald-700 shadow-sm",
  };

  const textVariantStyles: Record<ButtonVariant, string> = {
    primary: "text-white font-semibold",
    secondary: "text-slate-800 dark:text-slate-100 font-semibold",
    outline: "text-slate-800 dark:text-slate-200 font-semibold",
    ghost: "text-[#0066FF] dark:text-blue-400 font-semibold",
    danger: "text-white font-semibold",
    emerald: "text-white font-semibold",
  };

  const textSizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <Pressable
      disabled={isActionDisabled}
      className={clsx(
        baseContainerStyles,
        sizeStyles[size],
        variantStyles[variant],
        isActionDisabled && "opacity-50",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost" || variant === "secondary"
              ? "#0066FF"
              : "#FFFFFF"
          }
          className="mr-2"
        />
      ) : (
        leftIcon && <View className="mr-2">{leftIcon}</View>
      )}

      {title ? (
        <Text
          className={clsx(
            textSizeStyles[size],
            textVariantStyles[variant],
            textClassName
          )}
        >
          {title}
        </Text>
      ) : (
        children
      )}

      {!isLoading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </Pressable>
  );
}
