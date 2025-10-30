import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS class names safely.
 * Example: cn("px-2", condition && "bg-green-500")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
