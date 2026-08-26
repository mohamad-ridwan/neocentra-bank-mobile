"use client";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";

const headingStyle = tva({
  base: "text-slate-900 dark:text-white tracking-tight",
  variants: {
    size: {
      "2xs": "text-xs font-bold",
      xs: "text-sm font-bold",
      sm: "text-base font-bold",
      md: "text-lg font-bold",
      lg: "text-xl font-bold",
      xl: "text-2xl font-bold",
      "2xl": "text-3xl font-extrabold",
      "3xl": "text-4xl font-extrabold",
      "4xl": "text-5xl font-extrabold",
      "5xl": "text-6xl font-extrabold",
      "6xl": "text-7xl font-extrabold",
    },
    bold: {
      true: "font-bold",
    },
  },
  defaultVariants: {
    size: "xl",
    bold: true,
  },
});

const textStyle = tva({
  base: "text-slate-700 dark:text-slate-200 font-normal",
  variants: {
    size: {
      "2xs": "text-[10px]",
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
    bold: {
      true: "font-bold",
    },
    highlight: {
      true: "bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type IHeadingProps = RNTextProps &
  VariantProps<typeof headingStyle> & {
    className?: string;
    isTruncated?: boolean;
    children?: React.ReactNode;
  };

const Heading = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  IHeadingProps
>(function Heading(
  { className, size = "xl", bold = true, isTruncated = false, ...props },
  ref,
) {
  return (
    <RNText
      ref={ref}
      numberOfLines={isTruncated ? 1 : undefined}
      className={headingStyle({ size, bold, class: className })}
      {...props}
    />
  );
});

type ITextProps = RNTextProps &
  VariantProps<typeof textStyle> & {
    className?: string;
    isTruncated?: boolean;
    children?: React.ReactNode;
  };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, ITextProps>(
  function Text(
    {
      className,
      size = "md",
      bold = false,
      highlight = false,
      isTruncated = false,
      ...props
    },
    ref,
  ) {
    return (
      <RNText
        ref={ref}
        numberOfLines={isTruncated ? 1 : undefined}
        className={textStyle({ size, bold, highlight, class: className })}
        {...props}
      />
    );
  },
);

type ISubheadingProps = RNTextProps & {
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

const Subheading = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  ISubheadingProps
>(function Subheading({ className, size = "md", ...props }, ref) {
  const sizeClass =
    size === "sm"
      ? "text-base font-semibold"
      : size === "lg"
        ? "text-xl font-semibold"
        : "text-lg font-semibold";
  return (
    <RNText
      ref={ref}
      className={`text-slate-900 dark:text-white ${sizeClass} ${className || ""}`}
      {...props}
    />
  );
});

type ICaptionProps = RNTextProps & {
  size?: "2xs" | "xs" | "sm";
  className?: string;
  children?: React.ReactNode;
};

const Caption = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  ICaptionProps
>(function Caption({ className, size = "xs", ...props }, ref) {
  const sizeClass =
    size === "2xs" ? "text-[10px]" : size === "sm" ? "text-sm" : "text-xs";
  return (
    <RNText
      ref={ref}
      className={`text-slate-500 dark:text-slate-400 font-medium ${sizeClass} ${className || ""}`}
      {...props}
    />
  );
});

type ILabelProps = RNTextProps & {
  className?: string;
  children?: React.ReactNode;
};

const Label = React.forwardRef<React.ComponentRef<typeof RNText>, ILabelProps>(
  function Label({ className, ...props }, ref) {
    return (
      <RNText
        ref={ref}
        className={`text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 ${className || ""}`}
        {...props}
      />
    );
  },
);

Heading.displayName = "Heading";
Text.displayName = "Text";
Subheading.displayName = "Subheading";
Caption.displayName = "Caption";
Label.displayName = "Label";

export { Heading, Text, Subheading, Caption, Label };
