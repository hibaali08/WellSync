"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"

    const variants = {
      default:
        "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
      outline:
        "border border-green-600 text-green-700 bg-transparent hover:bg-green-50",
      secondary:
        "bg-green-100 text-green-800 hover:bg-green-200 focus-visible:ring-green-400",
      ghost: "hover:bg-green-50 text-green-700",
      link: "text-green-700 underline-offset-4 hover:underline",
    }

    const sizes = {
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
