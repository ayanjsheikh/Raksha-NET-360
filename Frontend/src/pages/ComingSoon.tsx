import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/navigation";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
        <Construction className="h-8 w-8 text-primary-500" />
      </span>
      <h1 className="text-2xl font-bold text-ink-primary">{title}</h1>
      <p className="max-w-sm text-sm text-ink-secondary">
        This part of RakshaNet 360 is being built next. Check back soon.
      </p>
      <Button asChild variant="outline">
        <Link to={ROUTES.landing}>Back to home</Link>
      </Button>
    </div>
  );
}
