"use client";

import React from "react";

export type BaseButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: string;
  style?: string; // extra custom styles
  variant?: "default" | "danger" | "success"; // semantic variants
  children?: React.ReactNode;
};

export default function BaseButton({
  type = "button",
  onClick,
  disabled = false,
  fullWidth = false,
  rounded = "rounded-xl",
  style = "",
  variant = "default",
  children,
}: BaseButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    onClick?.();
  };

  const variantStyles: Record<string, string> = {
    default: `
      bg-brand
      shadow-[0_4px_0_theme('colors.brand.dark')]
      hover:bg-brand-light hover:shadow-[0_4px_0_theme('colors.brand')]
      focus:bg-brand-dark focus:shadow-none focus:translate-y-1
      active:bg-brand-dark active:shadow-none active:translate-y-1
      text-white
    `,
    danger: `
      bg-danger
      shadow-[0_4px_0_theme('colors.danger-dark')]
      hover:bg-danger-light hover:shadow-[0_4px_0_theme('colors.danger')]
      focus:bg-danger-dark focus:shadow-none focus:translate-y-1
      active:bg-danger-dark active:shadow-none active:translate-y-1
      text-white
    `,
    success: `
      bg-success
      shadow-[0_4px_0_theme('colors.success-dark')]
      hover:bg-success-light hover:shadow-[0_4px_0_theme('colors.success')]
      focus:bg-success-dark focus:shadow-none focus:translate-y-1
      active:bg-success-dark active:shadow-none active:translate-y-1
      text-white
    `,
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant] || variantStyles.default}
        ${rounded}
        ${fullWidth ? "w-full" : ""}
        flex items-center justify-center
        p-2.5 gap-4
        cursor-pointer
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${style}
      `}
    >
      {children}
    </button>
  );
}
