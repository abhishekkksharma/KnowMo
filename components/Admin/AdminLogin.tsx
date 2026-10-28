"use client";

import React, { useState } from "react";
import { useAdminAuth } from "./AdminAuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed");
        return;
      }

      if (!data.user?.isAdmin || !data.token) {
        setError("Admin access required");
        return;
      }

      await login(data.token, data.user);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-black sm:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          KnowMo<span className="text-pink-500">.</span>
        </h1>

        <span className="mt-6 inline-block rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:bg-pink-500/10 dark:text-pink-300">
          Admin Portal
        </span>

        <h2 className="mt-5 text-3xl font-bold text-zinc-950 dark:text-white">
          Welcome back.
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Sign in to manage your departments and learning resources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-pink-500 dark:focus:ring-pink-500/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 pr-16 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-pink-500 dark:focus:ring-pink-500/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-pink-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-pink-100"
        >
          {loading ? "Signing in..." : "Sign in to dashboard →"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;