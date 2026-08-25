'use client';
import React from 'react';
import { createToast, createToastHook } from '@gluestack-ui/core/toast/creator';
import { View, Text as RNText, Pressable } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { withStyleContext, useStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react-native';

const SCOPE = 'TOAST';

const UIToast = createToast({
  Root: withStyleContext(View, SCOPE),
  Title: RNText,
  Description: RNText,
});

const toastStyle = tva({
  base: 'flex-row items-start p-4 rounded-xl border shadow-sm mb-4',
  variants: {
    action: {
      error:
        'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      warning:
        'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      success:
        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      info:
        'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
      attention:
        'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    },
    variant: {
      solid: '',
      outline: 'bg-transparent border',
    },
  },
  defaultVariants: {
    action: 'info',
    variant: 'solid',
  },
});

const toastTitleStyle = tva({
  base: 'font-semibold text-sm mb-0.5',
  parentVariants: {
    action: {
      error: 'text-rose-800 dark:text-rose-300',
      warning: 'text-amber-800 dark:text-amber-300',
      success: 'text-emerald-800 dark:text-emerald-300',
      info: 'text-blue-800 dark:text-blue-300',
      attention: 'text-amber-800 dark:text-amber-300',
    },
  },
});

const toastDescriptionStyle = tva({
  base: 'text-xs leading-relaxed',
  parentVariants: {
    action: {
      error: 'text-rose-700 dark:text-rose-400',
      warning: 'text-amber-700 dark:text-amber-400',
      success: 'text-emerald-700 dark:text-emerald-400',
      info: 'text-blue-700 dark:text-blue-400',
      attention: 'text-amber-700 dark:text-amber-400',
    },
  },
});

type IToastProps = Omit<React.ComponentProps<typeof UIToast>, 'context'> &
  VariantProps<typeof toastStyle> & {
    className?: string;
    type?: 'error' | 'warning' | 'success' | 'info' | 'attention';
    title?: string;
    message?: string;
    onDismiss?: () => void;
  };

const Toast = React.forwardRef<React.ComponentRef<typeof UIToast>, IToastProps>(
  function Toast(
    {
      className,
      action = 'info',
      type,
      variant = 'solid',
      title,
      message,
      onDismiss,
      children,
      ...props
    },
    ref
  ) {
    const computedAction = type || action || 'info';

    const getIcon = () => {
      switch (computedAction) {
        case 'success':
          return <CheckCircle2 size={20} color="#10B981" />;
        case 'error':
          return <XCircle size={20} color="#EF4444" />;
        case 'warning':
        case 'attention':
          return <AlertCircle size={20} color="#F59E0B" />;
        case 'info':
        default:
          return <Info size={20} color="#0066FF" />;
      }
    };

    return (
      <UIToast
        ref={ref}
        {...props}
        className={toastStyle({
          action: computedAction,
          variant,
          class: className,
        })}
        context={{ action: computedAction, variant }}
      >
        <View className="mr-3 mt-0.5">{getIcon()}</View>

        <View className="flex-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {message && <ToastDescription>{message}</ToastDescription>}
          {children}
        </View>

        {onDismiss && (
          <Pressable onPress={onDismiss} className="p-1 -mr-1" hitSlop={8}>
            <X size={16} color="#94A3B8" />
          </Pressable>
        )}
      </UIToast>
    );
  }
);

type IToastTitleProps = React.ComponentProps<typeof UIToast.Title> &
  VariantProps<typeof toastTitleStyle> & { className?: string };

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof UIToast.Title>,
  IToastTitleProps
>(function ToastTitle({ className, ...props }, ref) {
  const { action } = useStyleContext(SCOPE);

  return (
    <UIToast.Title
      ref={ref}
      {...props}
      className={toastTitleStyle({
        parentVariants: { action },
        class: className,
      })}
    />
  );
});

type IToastDescriptionProps = React.ComponentProps<
  typeof UIToast.Description
> &
  VariantProps<typeof toastDescriptionStyle> & { className?: string };

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof UIToast.Description>,
  IToastDescriptionProps
>(function ToastDescription({ className, ...props }, ref) {
  const { action } = useStyleContext(SCOPE);

  return (
    <UIToast.Description
      ref={ref}
      {...props}
      className={toastDescriptionStyle({
        parentVariants: { action },
        class: className,
      })}
    />
  );
});

const useToast = createToastHook(View);

Toast.displayName = 'Toast';
ToastTitle.displayName = 'ToastTitle';
ToastDescription.displayName = 'ToastDescription';

export { Toast, ToastTitle, ToastDescription, useToast };
