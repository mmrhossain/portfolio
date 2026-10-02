import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password.form";

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
