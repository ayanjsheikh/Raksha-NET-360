import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white shadow-card hover:bg-primary-600",
        emergency:
          "bg-emergency-500 text-white shadow-card hover:bg-emergency-600",
        danger: "bg-danger-500 text-white shadow-card hover:bg-danger-600",
        outline:
          "border border-line bg-transparent text-ink-primary hover:bg-surface-muted",
        ghost: "text-ink-primary hover:bg-surface-muted",
        link: "text-primary-500 underline-offset-4 hover:underline p-0 h-auto",
        subtle: "bg-primary-50 text-primary-600 hover:bg-primary-100",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
