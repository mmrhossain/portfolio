
import { AdminSidebar } from "@/components/admin/layout/sidebar";
import {getMe} from "@/app/actions";
import {User} from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
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
