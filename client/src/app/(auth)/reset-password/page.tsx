import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/components/reset-password.form";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Reset password",
  robots: noIndexRobots,
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
