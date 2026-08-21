import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import clsx from "clsx";
import { Label } from "./Typography";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerClassName,
  inputClassName,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword && !showPassword;

  return (
    <View className={clsx("w-full mb-4", containerClassName)}>
      {label && <Label>{label}</Label>}

      <View
        className={clsx(
          "flex-row items-center w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-900 transition-all",
          isFocused
            ? "border-[#0066FF] shadow-sm shadow-blue-500/10"
            : error
            ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/10"
            : "border-slate-200 dark:border-slate-800"
        )}
      >
        {leftIcon && <View className="mr-2.5 text-slate-400">{leftIcon}</View>}

        <TextInput
          className={clsx(
            "flex-1 text-base text-slate-900 dark:text-white py-1",
            inputClassName
          )}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="p-1 -mr-1"
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={18} color="#64748B" />
            ) : (
              <Eye size={18} color="#64748B" />
            )}
          </Pressable>
        ) : (
          rightIcon && <View className="ml-2">{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text className="text-xs text-rose-500 font-medium mt-1 ml-1">
          {error}
        </Text>
      ) : helperText ? (
        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-1">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
