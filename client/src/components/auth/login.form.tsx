"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuthStore } from "@/lib/auth/store";
import { getErrorMessage } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = await login(form.email.trim(), form.password.trim());

      toast.success(`Welcome back, ${user.name}!`);
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg rounded-md overflow-hidden">
      <CardHeader className="space-y-1 text-center pb-6">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="pl-10 h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>

              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="pl-10 pr-10 h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-md font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 mt-2"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/*<div className="mt-6 text-center text-sm text-muted-foreground">*/}
        {/*  Don&apos;t have an account?{" "}*/}
        {/*  <Link*/}
        {/*    href="/register"*/}
        {/*    className="font-medium text-primary hover:underline underline-offset-4 transition-colors"*/}
        {/*  >*/}
        {/*    Register*/}
        {/*  </Link>*/}
        {/*</div>*/}
      </CardContent>
    </Card>
  );
}