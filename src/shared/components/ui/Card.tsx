'use client';
import React from 'react';
import { View, Text as RNText } from 'react-native';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import { withStyleContext, useStyleContext } from '@gluestack-ui/utils/nativewind-utils';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

const SCOPE = 'CARD';

const UICard = withStyleContext(View, SCOPE);

const cardStyle = tva({
  base: 'w-full',
  variants: {
    size: {
      sm: 'p-3 rounded-xl',
      md: 'p-5 rounded-2xl',
      lg: 'p-6 rounded-3xl',
    },
    variant: {
      default:
        'bg-card border border-border/80 shadow-sm shadow-slate-200/50 dark:shadow-none',
      elevated:
        'bg-card shadow-md shadow-slate-300/40 dark:shadow-black/50 border border-border/60',
      outlined: 'bg-transparent border border-border',
      glass:
        'bg-card/90 backdrop-blur-md border border-border/60 shadow-lg',
      filled: 'bg-muted border-transparent',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

type ICardProps = React.ComponentProps<typeof UICard> &
  VariantProps<typeof cardStyle> & { className?: string };

const Card = React.forwardRef<React.ComponentRef<typeof UICard>, ICardProps>(
  function Card(
    { className, size = 'md', variant = 'default', children, ...props },
    ref
  ) {
    return (
      <UICard
        ref={ref}
        {...props}
        className={cardStyle({ size, variant, class: className })}
        context={{ size, variant }}
      >
        {children}
      </UICard>
    );
  }
);

type ICardHeaderProps = React.ComponentProps<typeof View> & {
  className?: string;
};

const CardHeader = React.forwardRef<
  React.ComponentRef<typeof View>,
  ICardHeaderProps
>(function CardHeader({ className, children, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={`flex-row items-center justify-between pb-3 border-b border-border/60 mb-3 ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
});

type ICardBodyProps = React.ComponentProps<typeof View> & {
  className?: string;
};

const CardBody = React.forwardRef<
  React.ComponentRef<typeof View>,
  ICardBodyProps
>(function CardBody({ className, children, ...props }, ref) {
  return (
    <View ref={ref} className={`py-1 ${className || ''}`} {...props}>
      {children}
    </View>
  );
});

type ICardFooterProps = React.ComponentProps<typeof View> & {
  className?: string;
};

const CardFooter = React.forwardRef<
  React.ComponentRef<typeof View>,
  ICardFooterProps
>(function CardFooter({ className, children, ...props }, ref) {
  return (
    <View
      ref={ref}
      className={`pt-3 border-t border-border/60 mt-3 flex-row items-center justify-between ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
});

type ICardTitleProps = React.ComponentProps<typeof RNText> & {
  className?: string;
};

const CardTitle = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  ICardTitleProps
>(function CardTitle({ className, children, ...props }, ref) {
  return (
    <RNText
      ref={ref}
      className={`text-base font-bold text-foreground tracking-tight ${className || ''}`}
      {...props}
    >
      {children}
    </RNText>
  );
});

type ICardDescriptionProps = React.ComponentProps<typeof RNText> & {
  className?: string;
};

const CardDescription = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  ICardDescriptionProps
>(function CardDescription({ className, children, ...props }, ref) {
  return (
    <RNText
      ref={ref}
      className={`text-xs text-muted-foreground mt-0.5 ${className || ''}`}
      {...props}
    >
      {children}
    </RNText>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };
