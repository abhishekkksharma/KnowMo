"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthContext";
import AdminNavbar from "./AdminNavbar";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;

    if (!user && !isLoginPage) {
      router.replace("/admin/login");
    } else if (user && isLoginPage) {
      router.replace("/admin");
    }
  }, [user, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-pink-500 dark:border-zinc-700 dark:border-t-pink-400" />
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Checking admin authentication...
          </p>
        </div>
      </div>
    );
  }

  // On login page: allow unauthenticated users, redirect logged-in users
  if (isLoginPage) {
    if (user) {
      return null;
    }
    return <>{children}</>;
  }

  // On protected admin routes: if not logged in, prevent rendering protected contents
  if (!user) {
    return null;
  }

  return (
    <div>
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
