import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login.form";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: noIndexRobots,
};

export default function LoginPage() {
  return <LoginForm />;
}
