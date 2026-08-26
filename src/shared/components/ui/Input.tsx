"use client";
import React, { useState } from "react";
import { createInput } from "@gluestack-ui/core/input/creator";
import {
  View,
  Pressable,
  TextInput,
  TextInputProps,
  Text as RNText,
} from "react-native";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { withStyleContext } from "@gluestack-ui/utils/nativewind-utils";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { Eye, EyeOff } from "lucide-react-native";
import { UIIcon, IconPropType, renderIcon } from "./Icon";
import { Label } from "./Typography";
import { useColorScheme } from "@/shared/hooks/useColorScheme";

const SCOPE = "INPUT";

const UIInput = createInput({
  Root: withStyleContext(View, SCOPE),
  Icon: UIIcon,
  Slot: Pressable,
  Input: TextInput,
});

const inputStyle = tva({
  base: "w-full flex-row items-center rounded-xl border border-border bg-white dark:bg-card shadow-xs transition-[color,box-shadow] overflow-hidden data-[focus=true]:border-ring dark:data-[focus=true]:border-ring data-[invalid=true]:border-destructive/80 dark:data-[invalid=true]:border-destructive/80 data-[invalid=true]:bg-destructive/10 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 px-3.5",
  variants: {
    size: {
      xl: "h-13 px-4",
      lg: "h-12 px-4",
      md: "h-11 px-3.5",
      sm: "h-9 px-2.5",
    },
    variant: {
      underlined:
        "rounded-none border-b border-t-0 border-l-0 border-r-0 border-border bg-transparent shadow-none px-0",
      outline: "rounded-xl border border-border bg-white dark:bg-card",
      rounded: "rounded-full border border-border bg-white dark:bg-card",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

const inputIconStyle = tva({
  base: "justify-center items-center text-muted-foreground fill-none h-4 w-4",
});

const inputSlotStyle = tva({
  base: "justify-center items-center web:disabled:cursor-not-allowed",
});

const inputFieldStyle = tva({
  base: "flex-1 text-foreground text-sm md:text-base py-1 h-full placeholder:text-muted-foreground web:outline-none ios:leading-[0px] web:cursor-text web:data-[disabled=true]:cursor-not-allowed",
  parentVariants: {
    size: {
      xl: "text-lg",
      lg: "text-base",
      md: "text-sm",
      sm: "text-xs",
    },
  },
});

export type IInputProps = Omit<
  React.ComponentProps<typeof UIInput>,
  "context"
> &
  Omit<TextInputProps, "children"> &
  VariantProps<typeof inputStyle> & {
    className?: string;
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: IconPropType;
    rightIcon?: IconPropType;
    isPassword?: boolean;
    containerClassName?: string;
    inputClassName?: string;
    placeholderTextColor?: string;
    preventPaste?: boolean;
    onPasteBlocked?: () => void;
    children?: React.ReactNode;
  };

const Input = React.forwardRef<any, IInputProps>(function Input(
  {
    // Custom container & wrapper props
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    isPassword = false,
    containerClassName,
    inputClassName,
    placeholderTextColor,
    preventPaste = false,
    onPasteBlocked,

    // Gluestack styling & state props
    size = "md",
    variant = "outline",
    className,
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,

    // Focus/Blur wrappers
    onFocus,
    onBlur,

    // TextInput props to handle explicitly for paste prevention
    value,
    onChangeText,
    contextMenuHidden,

    // Children for compound component usage
    children,

    // Spread the rest to standard TextInputProps
    ...props
  },
  ref,
) {
  const { isDark } = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const lastValueRef = React.useRef<string>(value ? String(value) : "");
  React.useEffect(() => {
    lastValueRef.current = value ? String(value) : "";
  }, [value]);

  const handleTextChange = (val: string) => {
    if (preventPaste) {
      const prevVal = lastValueRef.current || "";
      const diff = val.length - prevVal.length;
      if (diff > 1) {
        onPasteBlocked?.();
        return;
      }
    }
    lastValueRef.current = val;
    onChangeText?.(val);
  };

  const hasError = Boolean(error) || isInvalid;
  const isSecure = isPassword && !showPassword;

  const iconDefaultSize =
    size === "xl" ? 22 : size === "lg" ? 20 : size === "sm" ? 16 : 18;
  const iconDefaultColor = isDark ? "#94A3B8" : "#64748B";

  const containerRef = React.useRef<View>(null);
  const inputRef = React.useRef<TextInput>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    isFocused: () => {
      return inputRef.current?.isFocused?.() ?? false;
    },
    clear: () => {
      inputRef.current?.clear?.();
    },
    measureLayout: (
      relativeToNativeComponentRef: any,
      onSuccess: (
        left: number,
        top: number,
        width: number,
        height: number,
      ) => void,
      onFail?: () => void,
    ) => {
      if (containerRef.current?.measureLayout) {
        containerRef.current.measureLayout(
          relativeToNativeComponentRef,
          onSuccess,
          onFail || (() => {}),
        );
      } else if (inputRef.current?.measureLayout) {
        inputRef.current.measureLayout(
          relativeToNativeComponentRef,
          onSuccess,
          onFail || (() => {}),
        );
      }
    },
    measure: (
      callback: (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => void,
    ) => {
      if (containerRef.current?.measure) {
        containerRef.current.measure(callback);
      } else if (inputRef.current?.measure) {
        inputRef.current.measure(callback);
      }
    },
    getNativeInput: () => inputRef.current,
    getContainer: () => containerRef.current,
  }));

  // Compound component mode
  if (children) {
    return (
      <UIInput
        ref={ref}
        isInvalid={hasError}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        className={inputStyle({ size, variant, class: className })}
        context={{ size, variant }}
      >
        {children}
      </UIInput>
    );
  }

  // High-level wrapper mode
  return (
    <View ref={containerRef} className={containerClassName || "w-full mb-4"}>
      {label && <Label>{label}</Label>}

      <UIInput
        isInvalid={hasError}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isRequired={isRequired}
        className={inputStyle({
          size,
          variant,
          class: `${isFocused ? "border-primary dark:border-primary" : ""} ${className || ""}`,
        })}
        context={{ size, variant }}
      >
        {leftIcon && (
          <View className="mr-2.5">
            {renderIcon(leftIcon, iconDefaultSize, iconDefaultColor)}
          </View>
        )}

        <InputField
          ref={inputRef}
          className={inputClassName}
          placeholderTextColor={
            placeholderTextColor || (isDark ? "#64748B" : "#94A3B8")
          }
          secureTextEntry={isSecure}
          value={value}
          onChangeText={handleTextChange}
          contextMenuHidden={preventPaste || contextMenuHidden}
          onFocus={(e: any) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e: any) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {isPassword ? (
          <InputSlot
            onPress={() => setShowPassword(!showPassword)}
            className="p-1 -mr-1"
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            ) : (
              <Eye size={18} color={isDark ? "#94A3B8" : "#64748B"} />
            )}
          </InputSlot>
        ) : (
          rightIcon && (
            <View className="ml-2">
              {renderIcon(rightIcon, iconDefaultSize, iconDefaultColor)}
            </View>
          )
        )}
      </UIInput>

      {error ? (
        <RNText className="text-xs text-destructive font-medium mt-1 ml-1">
          {error}
        </RNText>
      ) : helperText ? (
        <RNText className="text-xs text-muted-foreground mt-1 ml-1">
          {helperText}
        </RNText>
      ) : null}
    </View>
  );
});

export type IInputIconProps = React.ComponentProps<typeof UIInput.Icon> &
  VariantProps<typeof inputIconStyle> & {
    className?: string;
    height?: number;
    width?: number;
    as?: React.ElementType;
  };

const InputIcon = React.forwardRef<any, IInputIconProps>(function InputIcon(
  { className, as: AsComp, children, ...props },
  ref,
) {
  if (AsComp) {
    return <AsComp className={className} {...props} />;
  }

  return (
    <UIInput.Icon
      ref={ref}
      {...props}
      className={inputIconStyle({ class: className })}
    >
      {children}
    </UIInput.Icon>
  );
});

export type IInputSlotProps = React.ComponentProps<typeof UIInput.Slot> &
  VariantProps<typeof inputSlotStyle> & { className?: string };

const InputSlot = React.forwardRef<any, IInputSlotProps>(function InputSlot(
  { className, ...props },
  ref,
) {
  return (
    <UIInput.Slot
      ref={ref}
      {...props}
      className={inputSlotStyle({
        class: className,
      })}
    />
  );
});

export type IInputFieldProps = React.ComponentProps<typeof UIInput.Input> &
  VariantProps<typeof inputFieldStyle> & { className?: string };

const InputField = React.forwardRef<any, IInputFieldProps>(function InputField(
  { className, ...props },
  ref,
) {
  return (
    <UIInput.Input
      ref={ref}
      {...props}
      className={inputFieldStyle({
        class: className,
      })}
    />
  );
});

Input.displayName = "Input";
InputIcon.displayName = "InputIcon";
InputSlot.displayName = "InputSlot";
InputField.displayName = "InputField";

export { Input, InputField, InputIcon, InputSlot };
