"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const reset = useAuthStore((state) => state.reset);

  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then((response) => {
        if (!cancelled) {
          setUser(response.data);
        }
      })
      .catch(() =>
        authApi.refresh().then((response) => {
          if (!cancelled) {
            setUser(response.data.user);
            router.refresh();
          }
        }),
      )
      .catch(() => {
        if (!cancelled && !useAuthStore.getState().user) {
          reset();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, reset, router]);

  return <>{children}</>;
}
