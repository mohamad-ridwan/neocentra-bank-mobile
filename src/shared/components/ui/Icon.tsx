'use client';
import React from 'react';
import { UIIcon } from '@gluestack-ui/core/icon/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from 'nativewind';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

cssInterop(UIIcon, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: 'classNameColor',
      stroke: true,
    } as any,
  } as any,
});

const iconStyle = tva({
  base: 'items-center justify-center text-foreground fill-none',
  variants: {
    size: {
      '2xs': 'h-3 w-3',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-4.5 w-4.5',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
      '2xl': 'h-7 w-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconPropType =
  | React.ComponentType<{ size?: number; color?: string; className?: string; strokeWidth?: number }>
  | React.ReactNode;

export function renderIcon(
  icon: IconPropType,
  defaultSize?: number,
  defaultColor?: string
) {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || typeof icon === 'object') {
    const IconComponent = icon as React.ComponentType<{
      size?: number;
      color?: string;
    }>;
    return <IconComponent size={defaultSize} color={defaultColor} />;
  }
  return null;
}

export type IIconProps = React.ComponentProps<typeof UIIcon> &
  VariantProps<typeof iconStyle> & {
    className?: string;
    as?: React.ElementType;
    height?: number;
    width?: number;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
    color?: string;
  };

const Icon = React.forwardRef<any, IIconProps>(function Icon(
  { className, as: AsComp, size = 'md', color, ...props },
  ref
) {
  if (typeof size === 'number') {
    if (AsComp) {
      return (
        <AsComp
          ref={ref}
          size={size}
          color={color}
          className={className}
          {...props}
        />
      );
    }
    return (
      <UIIcon
        ref={ref}
        size={size}
        color={color}
        className={className}
        {...props}
      />
    );
  }

  if (AsComp) {
    return (
      <AsComp
        ref={ref}
        color={color}
        className={iconStyle({ size, class: className })}
        {...props}
      />
    );
  }

  return (
    <UIIcon
      ref={ref}
      color={color}
      className={iconStyle({ size, class: className })}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

export { Icon, UIIcon };
