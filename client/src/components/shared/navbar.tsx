import { NavbarClient } from "@/components/shared/navbar.client";
import { getMe } from "@/features/auth/api/server";
import type { User } from "@/types";

import { cookies } from "next/headers";

export async function Navbar() {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let user: User | null = null;

  if (accessToken) {
    try {
      const result = await getMe();
      user = result ?? null;
    } catch (error) {
      console.error("getMe error:", error);
    }
  }

  return <NavbarClient user={user} />;
}