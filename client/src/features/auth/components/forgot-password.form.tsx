"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

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

import { authApi } from "@/features/auth/api/auth";
import { getErrorMessage } from "@/lib/api/client/client-fetch";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSent(true);
      toast.success("A password reset link has been sent to your email.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-md border-border/50 bg-card/60 shadow-lg backdrop-blur-xl">
      <CardHeader className="space-y-1 pb-6 text-center">
        <CardTitle className="font-display text-2xl font-bold tracking-tight">
          Forgot your password?
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {sent
            ? "Check your inbox for a reset link. It expires in 60 minutes."
            : "Enter the email on your account and we will send a reset link."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
              <Mail className="h-7 w-7 text-accent" />
            </div>
            <p className="break-words text-sm text-muted-foreground">
              A reset link was sent to <strong>{email}</strong>. Check your inbox
              and spam folder.
            </p>
            <Button asChild variant="outline" className="h-11">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-11 rounded-xl border-border/80 bg-background/50 pl-10 transition-all focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 h-11 w-full rounded-md font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
