"use client";
import React from "react";
import { createToastHook } from "@gluestack-ui/core/toast/creator";
import {
  View,
  Text as RNText,
  Pressable,
  AccessibilityInfo,
} from "react-native";
import Animated, { SlideInUp } from "react-native-reanimated";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/utils/nativewind-utils";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

const SCOPE = "TOAST";

const AnimatedView = Animated.createAnimatedComponent(View);
cssInterop(AnimatedView, { className: "style" });

const toastStyle = tva({
  base: "flex-row items-start p-3.5 sm:p-4 rounded-2xl border shadow-lg shadow-black/5 dark:shadow-black/20 w-full max-w-[94%] sm:max-w-md mx-auto my-1.5",
  variants: {
    action: {
      error:
        "bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800",
      warning:
        "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
      success:
        "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800",
      info: "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800",
      attention:
        "bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800",
    },
    variant: {
      solid: "",
      outline: "bg-transparent border",
    },
  },
  defaultVariants: {
    action: "info",
    variant: "solid",
  },
});

const toastTitleStyle = tva({
  base: "font-semibold text-sm leading-5 mb-0.5 flex-shrink",
  parentVariants: {
    action: {
      error: "text-rose-900 dark:text-rose-200",
      warning: "text-amber-900 dark:text-amber-200",
      success: "text-emerald-900 dark:text-emerald-200",
      info: "text-blue-900 dark:text-blue-200",
      attention: "text-amber-900 dark:text-amber-200",
    },
  },
});

const toastDescriptionStyle = tva({
  base: "text-xs leading-relaxed flex-shrink font-normal",
  parentVariants: {
    action: {
      error: "text-rose-700 dark:text-rose-300",
      warning: "text-amber-700 dark:text-amber-300",
      success: "text-emerald-700 dark:text-emerald-300",
      info: "text-blue-700 dark:text-blue-300",
      attention: "text-amber-700 dark:text-amber-300",
    },
  },
});

const Root = withStyleContext(AnimatedView, SCOPE);

type IToastProps = Omit<React.ComponentProps<typeof Root>, "children"> & {
  className?: string;
  type?: "error" | "warning" | "success" | "info" | "attention";
  title?: string;
  message?: string;
  onDismiss?: () => void;
  children?: React.ReactNode;
} & VariantProps<typeof toastStyle>;

const Toast = React.forwardRef<React.ComponentRef<typeof Root>, IToastProps>(
  function Toast(
    {
      className,
      action,
      type,
      variant = "solid",
      title,
      message,
      onDismiss,
      children,
      ...props
    },
    ref,
  ) {
    const computedAction = (type || action || "info") as
      | "error"
      | "warning"
      | "success"
      | "info"
      | "attention";

    const getIcon = () => {
      switch (computedAction) {
        case "success":
          return <CheckCircle2 size={20} color="#10B981" />;
        case "error":
          return <XCircle size={20} color="#EF4444" />;
        case "warning":
        case "attention":
          return <AlertCircle size={20} color="#F59E0B" />;
        case "info":
        default:
          return <Info size={20} color="#0066FF" />;
      }
    };

    return (
      <Root
        ref={ref}
        entering={SlideInUp}
        className={toastStyle({
          variant: variant ?? "solid",
          action: computedAction,
          class: className,
        })}
        context={{ variant: variant ?? "solid", action: computedAction }}
        {...props}
      >
        <View className="flex-col gap-2">
          <View className="flex-row gap-2 justify-between items-center flex-1">
            <View className="flex-row items-center gap-2 mr-3 mt-0.5 shrink-0">
              <RNText>
                {getIcon()} {title ? <ToastTitle>{title}</ToastTitle> : null}
              </RNText>
            </View>

            {onDismiss ? (
              <Pressable
                onPress={onDismiss}
                className="p-1 -mr-1 -mt-0.5 ml-2 rounded-lg active:bg-black/5 dark:active:bg-white/10 shrink-0 self-start"
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close toast"
              >
                <X size={16} color="#94A3B8" />
              </Pressable>
            ) : null}
          </View>
          {message ? <ToastDescription>{message}</ToastDescription> : null}
          {children}
        </View>
      </Root>
    );
  },
);

type IToastTitleProps = React.ComponentProps<typeof RNText> & {
  className?: string;
  size?: "sm" | "md" | "lg";
} & VariantProps<typeof toastTitleStyle>;

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  IToastTitleProps
>(function ToastTitle({ className, size = "md", children, ...props }, ref) {
  const { action: parentAction } = useStyleContext(SCOPE);

  React.useEffect(() => {
    if (typeof children === "string" && children.trim()) {
      AccessibilityInfo.announceForAccessibility(children);
    }
  }, [children]);

  return (
    <RNText
      {...props}
      ref={ref}
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      className={toastTitleStyle({
        class: className,
        parentVariants: {
          action: parentAction || "info",
        },
      })}
    >
      {children}
    </RNText>
  );
});

type IToastDescriptionProps = React.ComponentProps<typeof RNText> & {
  className?: string;
  size?: "2xs" | "xs" | "sm";
} & VariantProps<typeof toastDescriptionStyle>;

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  IToastDescriptionProps
>(function ToastDescription({ className, children, ...props }, ref) {
  const { action: parentAction } = useStyleContext(SCOPE);

  return (
    <RNText
      {...props}
      ref={ref}
      className={toastDescriptionStyle({
        class: className,
        parentVariants: {
          action: parentAction || "info",
        },
      })}
    >
      {children}
    </RNText>
  );
});

const useToast = createToastHook(View);

Toast.displayName = "Toast";
ToastTitle.displayName = "ToastTitle";
ToastDescription.displayName = "ToastDescription";

export { Toast, ToastTitle, ToastDescription, useToast };
export type { IToastProps, IToastTitleProps, IToastDescriptionProps };
