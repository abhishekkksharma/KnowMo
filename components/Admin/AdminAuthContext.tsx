"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  department?: string;
  departmentCode?: string;
  currentYear?: number;
  isAdmin: boolean;
}

export interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, initialUser?: AdminUser) => Promise<void>;
  logout: () => void;
  fetchUserData: (authToken: string) => Promise<AdminUser | null>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";

function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUserData = useCallback(async (authToken: string): Promise<AdminUser | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/user/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
        return null;
      }

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return data.user;
      }
      return null;
    } catch {
      // Offline / network fallback: decode valid token payload
      const payload = parseJwt(authToken);
      if (payload && payload.isAdmin && (!payload.exp || payload.exp * 1000 > Date.now())) {
        const fallbackUser: AdminUser = {
          id: payload.userId || "",
          name: payload.name || payload.email?.split("@")[0] || "Admin",
          email: payload.email || "",
          isAdmin: true,
        };
        setUser(fallbackUser);
        return fallbackUser;
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserData(storedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, [fetchUserData]);

  const login = useCallback(
    async (newToken: string, initialUser?: AdminUser) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      if (initialUser) {
        setUser(initialUser);
      } else {
        await fetchUserData(newToken);
      }
      router.push("/admin");
    },
    [fetchUserData, router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        fetchUserData,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
