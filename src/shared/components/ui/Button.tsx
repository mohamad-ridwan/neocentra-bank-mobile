'use client';
import React from 'react';
import { createButton } from '@gluestack-ui/core/button/creator';
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  View,
} from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { withStyleContext, useStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { UIIcon, IconPropType, renderIcon } from './Icon';
import { useColorScheme } from '@/shared/hooks/useColorScheme';

const SCOPE = 'BUTTON';

const UIButton = createButton({
  Root: withStyleContext(Pressable, SCOPE),
  Text: RNText,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

const buttonStyle = tva({
  base: 'group/button rounded-xl flex-row items-center justify-center font-medium data-[focus-visible=true]:web:ring-2 data-[focus-visible=true]:web:ring-ring data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none active:opacity-85',
  variants: {
    action: {
      primary: 'bg-primary border-primary',
      secondary: 'bg-secondary border-border border',
      positive: 'bg-success border-success',
      negative: 'bg-destructive border-destructive',
      default: 'bg-transparent',
    },
    variant: {
      solid: 'shadow-sm border',
      outline: 'bg-transparent border border-border active:bg-accent/40',
      link: 'bg-transparent p-0 border-0',
      ghost: 'bg-transparent active:bg-accent/40 border-0',
      secondary: 'bg-secondary border-border border',
      danger: 'bg-destructive border-destructive shadow-sm border',
      emerald: 'bg-success border-success shadow-sm border',
      primary: 'bg-primary border-primary shadow-sm border',
    },
    size: {
      xs: 'py-1.5 px-3 rounded-lg',
      sm: 'py-2 px-3.5 rounded-xl',
      md: 'py-3.5 px-5 rounded-xl',
      lg: 'py-4 px-6 rounded-2xl',
      xl: 'py-4.5 px-7 rounded-2xl',
    },
  },
  compoundVariants: [
    {
      action: 'primary',
      variant: 'solid',
      class: 'bg-primary border-primary text-primary-foreground active:bg-primary/90',
    },
    {
      action: 'secondary',
      variant: 'solid',
      class: 'bg-secondary border-border text-secondary-foreground active:bg-secondary/80',
    },
    {
      action: 'positive',
      variant: 'solid',
      class: 'bg-success border-success text-success-foreground active:bg-success/90',
    },
    {
      action: 'negative',
      variant: 'solid',
      class: 'bg-destructive border-destructive text-destructive-foreground active:bg-destructive/90',
    },
    {
      action: 'primary',
      variant: 'outline',
      class: 'border-primary text-primary active:bg-primary/10',
    },
  ],
  defaultVariants: {
    action: 'primary',
    variant: 'solid',
    size: 'md',
  },
});

const buttonTextStyle = tva({
  base: 'font-semibold text-center',
  parentVariants: {
    action: {
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      positive: 'text-success-foreground',
      negative: 'text-destructive-foreground',
      default: 'text-foreground',
    },
    variant: {
      solid: 'text-white',
      outline: 'text-foreground',
      link: 'text-primary underline',
      ghost: 'text-primary',
      secondary: 'text-secondary-foreground',
      danger: 'text-white',
      emerald: 'text-white',
      primary: 'text-white',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    },
  },
});

const buttonIconStyle = tva({
  base: 'justify-center items-center',
  parentVariants: {
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-4.5 w-4.5',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    },
  },
});

const buttonGroupStyle = tva({
  base: 'flex-row items-center',
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
    },
    isAttached: {
      true: 'divide-x divide-border',
    },
  },
  defaultVariants: {
    space: 'md',
  },
});

export type IButtonProps = Omit<React.ComponentProps<typeof UIButton>, 'context'> &
  VariantProps<typeof buttonStyle> & {
    className?: string;
    textClassName?: string;
    title?: string;
    isLoading?: boolean;
    leftIcon?: IconPropType;
    rightIcon?: IconPropType;
    children?: React.ReactNode;
  };

const Button = React.forwardRef<any, IButtonProps>(
  function Button(
    {
      className,
      textClassName,
      variant = 'solid',
      size = 'md',
      action = 'primary',
      title,
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) {
    const { isDark } = useColorScheme();

    let computedAction = action;
    let computedVariant = variant;

    if (variant === 'secondary') {
      computedAction = 'secondary';
      computedVariant = 'solid';
    } else if (variant === 'danger') {
      computedAction = 'negative';
      computedVariant = 'solid';
    } else if (variant === 'emerald') {
      computedAction = 'positive';
      computedVariant = 'solid';
    } else if (variant === 'primary') {
      computedAction = 'primary';
      computedVariant = 'solid';
    }

    const isActionDisabled = disabled || isLoading;

    const iconSize =
      size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 22 : 18;

    const isDangerButton =
      computedAction === 'negative' ||
      computedVariant === 'danger' ||
      (textClassName && textClassName.includes('rose'));

    const defaultIconColor = isDangerButton
      ? '#EF4444'
      : computedVariant === 'outline' ||
        computedVariant === 'ghost' ||
        computedVariant === 'link' ||
        computedAction === 'secondary'
        ? (isDark ? '#60A5FA' : '#0066FF')
        : '#FFFFFF';

    return (
      <UIButton
        ref={ref}
        disabled={isActionDisabled}
        {...props}
        className={buttonStyle({
          variant: computedVariant,
          size,
          action: computedAction,
          class: className,
        })}
        context={{ variant: computedVariant, size, action: computedAction }}
      >
        {isLoading ? (
          <ButtonSpinner
            color={defaultIconColor}
            className="mr-2"
          />
        ) : (
          leftIcon && (
            <View className="mr-2">
              {renderIcon(leftIcon, iconSize, defaultIconColor)}
            </View>
          )
        )}

        {title ? (
          <ButtonText className={textClassName}>{title}</ButtonText>
        ) : (
          children
        )}

        {!isLoading && rightIcon && (
          <View className="ml-2">
            {renderIcon(rightIcon, iconSize, defaultIconColor)}
          </View>
        )}
      </UIButton>
    );
  }
);

export type IButtonTextProps = Omit<
  React.ComponentProps<typeof UIButton.Text>,
  'children'
> &
  VariantProps<typeof buttonTextStyle> & {
    className?: string;
    children?: React.ReactNode;
  };

const ButtonText = React.forwardRef<any, IButtonTextProps>(
  function ButtonText({ className, children, ...props }, ref) {
    const { size, action, variant } = useStyleContext(SCOPE);

    return (
      <UIButton.Text
        ref={ref}
        {...props}
        className={buttonTextStyle({
          parentVariants: { size, action, variant },
          class: className,
        })}
      >
        {children}
      </UIButton.Text>
    );
  }
);

export type IButtonSpinnerProps = React.ComponentProps<
  typeof UIButton.Spinner
> & {
  className?: string;
  color?: string;
};

const ButtonSpinner = React.forwardRef<any, IButtonSpinnerProps>(
  function ButtonSpinner({ className, color, ...props }, ref) {
    return (
      <UIButton.Spinner
        ref={ref}
        color={color || '#FFFFFF'}
        {...props}
        className={className}
      />
    );
  }
);

export type IButtonIconProps = React.ComponentProps<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const ButtonIcon = React.forwardRef<any, IButtonIconProps>(
  function ButtonIcon({ className, as: AsComp, children, ...props }, ref) {
    const { size } = useStyleContext(SCOPE);

    if (AsComp) {
      return <AsComp className={className} {...props} />;
    }

    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({
          parentVariants: { size },
          class: className,
        })}
      >
        {children}
      </UIButton.Icon>
    );
  }
);

export type IButtonGroupProps = React.ComponentProps<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle> & { className?: string };

const ButtonGroup = React.forwardRef<any, IButtonGroupProps>(
  function ButtonGroup(
    { className, space = 'md', isAttached = false, ...props },
    ref
  ) {
    return (
      <UIButton.Group
        ref={ref}
        {...props}
        className={buttonGroupStyle({
          space,
          isAttached,
          class: className,
        })}
      />
    );
  }
);

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonSpinner.displayName = 'ButtonSpinner';
ButtonIcon.displayName = 'ButtonIcon';
ButtonGroup.displayName = 'ButtonGroup';

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
