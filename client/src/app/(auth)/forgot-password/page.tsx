import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password.form";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: noIndexRobots,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
