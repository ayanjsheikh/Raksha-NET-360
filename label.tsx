import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-ink-primary", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
