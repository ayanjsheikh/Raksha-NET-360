import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { AuthLayout } from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/navigation";

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await registerUser(values.name, values.email, values.password);
      navigate(ROUTES.profileSetup);
    } catch {
      setFormError("We couldn't create your account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Two minutes today can mean minutes saved in an emergency tomorrow."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              id="name"
              placeholder="Aarav Sharma"
              className="pl-11"
              hasError={Boolean(errors.name)}
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && <p className="text-xs text-danger-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-11"
              hasError={Boolean(errors.email)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </div>
          {errors.email && <p className="text-xs text-danger-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-11"
              hasError={Boolean(errors.phone)}
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "Enter a valid phone number" },
              })}
            />
          </div>
          {errors.phone && <p className="text-xs text-danger-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="pl-11 pr-11"
              hasError={Boolean(errors.password)}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-danger-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="pl-11"
              hasError={Boolean(errors.confirmPassword)}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-danger-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {formError && (
          <div className="rounded-xl bg-danger-50 px-4 py-3 text-sm text-danger-600">
            {formError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-xs text-ink-secondary">
          By continuing, you agree to RakshaNet's Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        Already protected?{" "}
        <Link to={ROUTES.login} className="font-semibold text-primary-500 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
