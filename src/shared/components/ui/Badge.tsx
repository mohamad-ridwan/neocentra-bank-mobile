'use client';
import React from 'react';
import { View, Text as RNText } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { withStyleContext, useStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { UIIcon, IconPropType, renderIcon } from './Icon';

const SCOPE = 'BADGE';

const UIBadge = withStyleContext(View, SCOPE);

export type BadgeAction =
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'muted'
  | 'neutral'
  | 'danger';

export type BadgeVariant =
  | 'solid'
  | 'outline'
  | 'subtle'
  | BadgeAction;

const badgeStyle = tva({
  base: 'flex-row items-center rounded-full self-start',
  variants: {
    action: {
      error:
        'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80',
      warning:
        'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/80',
      success:
        'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/80',
      info:
        'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/80',
      muted:
        'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      neutral:
        'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      danger:
        'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/80',
    },
    variant: {
      solid: 'border-0',
      outline: 'bg-transparent border',
      subtle: 'border',
    },
    size: {
      sm: 'px-2 py-0.5',
      md: 'px-2.5 py-1',
      lg: 'px-3 py-1.5',
    },
  },
  compoundVariants: [
    {
      action: 'success',
      variant: 'solid',
      class: 'bg-emerald-600 border-emerald-600',
    },
    {
      action: 'warning',
      variant: 'solid',
      class: 'bg-amber-500 border-amber-500',
    },
    {
      action: 'info',
      variant: 'solid',
      class: 'bg-blue-600 border-blue-600',
    },
    {
      action: 'error',
      variant: 'solid',
      class: 'bg-rose-600 border-rose-600',
    },
    {
      action: 'danger',
      variant: 'solid',
      class: 'bg-rose-600 border-rose-600',
    },
    {
      action: 'muted',
      variant: 'solid',
      class: 'bg-slate-700 border-slate-700',
    },
  ],
  defaultVariants: {
    action: 'info',
    variant: 'subtle',
    size: 'md',
  },
});

const badgeTextStyle = tva({
  base: 'font-semibold tracking-wide',
  parentVariants: {
    action: {
      error: 'text-rose-700 dark:text-rose-400',
      warning: 'text-amber-700 dark:text-amber-400',
      success: 'text-emerald-700 dark:text-emerald-400',
      info: 'text-blue-700 dark:text-blue-400',
      muted: 'text-slate-700 dark:text-slate-300',
      neutral: 'text-slate-700 dark:text-slate-300',
      danger: 'text-rose-700 dark:text-rose-400',
    },
    variant: {
      solid: 'text-white',
      outline: '',
      subtle: '',
    },
    size: {
      sm: 'text-[10px]',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
});

const badgeIconStyle = tva({
  base: 'mr-1.5 justify-center items-center',
  parentVariants: {
    size: {
      sm: 'h-3 w-3',
      md: 'h-3.5 w-3.5',
      lg: 'h-4 w-4',
    },
  },
});

export type IBadgeProps = React.ComponentProps<typeof UIBadge> & {
  action?: BadgeAction;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  textClassName?: string;
  label?: string;
  icon?: IconPropType;
  children?: React.ReactNode;
};

const actionIconColors: Record<BadgeAction, string> = {
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0066FF',
  error: '#EF4444',
  danger: '#EF4444',
  muted: '#64748B',
  neutral: '#64748B',
};

const Badge = React.forwardRef<any, IBadgeProps>(
  function Badge(
    {
      className,
      textClassName,
      action = 'info',
      variant = 'subtle',
      size = 'md',
      label,
      icon,
      children,
      ...props
    },
    ref
  ) {
    let computedAction: BadgeAction = action;
    let computedVariant: 'solid' | 'outline' | 'subtle' = 'subtle';

    if (
      variant === 'success' ||
      variant === 'warning' ||
      variant === 'info' ||
      variant === 'error' ||
      variant === 'danger' ||
      variant === 'muted' ||
      variant === 'neutral'
    ) {
      computedAction = variant;
      computedVariant = 'subtle';
    } else if (variant === 'solid' || variant === 'outline' || variant === 'subtle') {
      computedVariant = variant;
    }

    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
    const iconColor =
      computedVariant === 'solid' ? '#FFFFFF' : actionIconColors[computedAction] || '#0066FF';

    return (
      <UIBadge
        ref={ref}
        {...props}
        className={badgeStyle({
          action: computedAction,
          variant: computedVariant,
          size,
          class: className,
        })}
        context={{ action: computedAction, variant: computedVariant, size }}
      >
        {icon && (
          <View className="mr-1.5">
            {renderIcon(icon, iconSize, iconColor)}
          </View>
        )}
        {label ? (
          <BadgeText className={textClassName}>{label}</BadgeText>
        ) : (
          children
        )}
      </UIBadge>
    );
  }
);

export type IBadgeTextProps = React.ComponentProps<typeof RNText> &
  VariantProps<typeof badgeTextStyle> & { className?: string };

const BadgeText = React.forwardRef<any, IBadgeTextProps>(
  function BadgeText({ className, ...props }, ref) {
    const { action, variant, size } = useStyleContext(SCOPE);

    return (
      <RNText
        ref={ref}
        {...props}
        className={badgeTextStyle({
          parentVariants: { action, variant, size },
          class: className,
        })}
      />
    );
  }
);

export type IBadgeIconProps = React.ComponentProps<typeof UIIcon> &
  VariantProps<typeof badgeIconStyle> & {
    className?: string;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const BadgeIcon = React.forwardRef<any, IBadgeIconProps>(
  function BadgeIcon({ className, as: AsComp, children, ...props }, ref) {
    const { size } = useStyleContext(SCOPE);

    if (AsComp) {
      return <AsComp className={className} {...props} />;
    }

    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({
          parentVariants: { size },
          class: className,
        })}
      >
        {children}
      </UIIcon>
    );
  }
);

Badge.displayName = 'Badge';
BadgeText.displayName = 'BadgeText';
BadgeIcon.displayName = 'BadgeIcon';

export { Badge, BadgeText, BadgeIcon };
