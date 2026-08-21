import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import clsx from "clsx";

export interface TypographyProps extends RNTextProps {
  className?: string;
  children: React.ReactNode;
}

export function Heading({ className, children, ...props }: TypographyProps) {
  return (
    <RNText
      className={clsx(
        "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}

export function Subheading({ className, children, ...props }: TypographyProps) {
  return (
    <RNText
      className={clsx(
        "text-lg font-semibold text-slate-800 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}

export function Text({ className, children, ...props }: TypographyProps) {
  return (
    <RNText
      className={clsx(
        "text-base font-normal text-slate-700 dark:text-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}

export function Caption({ className, children, ...props }: TypographyProps) {
  return (
    <RNText
      className={clsx(
        "text-xs font-medium text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}

export function Label({ className, children, ...props }: TypographyProps) {
  return (
    <RNText
      className={clsx(
        "text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </RNText>
  );
}
