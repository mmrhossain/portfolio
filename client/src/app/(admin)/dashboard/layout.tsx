import { AdminSidebar } from "@/features/dashboard/components/sidebar";
import { getMe } from "@/features/auth/api/server";
import {User} from "@/types";
import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: noIndexRobots,
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const user: User | undefined = await getMe();

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar user = {user} />
      <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  );
}
