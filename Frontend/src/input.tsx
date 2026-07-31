import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-surface px-4 text-sm text-ink-primary placeholder:text-ink-secondary/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
          hasError ? "border-danger-500" : "border-line",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
