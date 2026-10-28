
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Building2,
  FilePlus2,
  ClipboardCheck,
  ChevronRight,
  LogOut,
  ChevronDown
} from "lucide-react";

import Logo from "../headers/Logo";
import ThemeToggle from "../ui/themeToggle";
import { useAdminAuth } from "./AdminAuthContext";

const navLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    label: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    label: "Add Resources",
    href: "/admin/addresources",
    icon: FilePlus2,
  },
  {
    label: "Generate Tests",
    href: "/admin/generatetests",
    icon: ClipboardCheck,
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAdminAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const adminName = user?.name || "Admin";
  const adminEmail = user?.email || "Administrator";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Floating navbar */}
      <header className="fixed top-4 left-0 right-0 z-[60] px-3 sm:px-6 lg:px-12 pointer-events-none">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">

          {/* Desktop logo */}
          <div className="hidden md:flex w-40 shrink-0 items-center pointer-events-auto">
            <Logo size={40} />
          </div>

          {/* Glass navbar shell */}
          <nav
            className="
              pointer-events-auto mx-auto md:mx-0
              flex min-w-0 flex-1 md:flex-none
              items-center justify-between gap-2
              rounded-full border-2 border-white/40
              bg-white/50 p-1.5
              shadow-[0_12px_40px_rgba(0,0,0,0.08)]
              backdrop-blur-xl
              transition-all duration-300
              dark:border-zinc-800/60 dark:bg-zinc-950/50
              md:max-w-full
            "
          >
            {/* Mobile logo */}
            <div className="pl-2 md:hidden">
              <Logo size={30} />
            </div>

            {/* Desktop links */}
            <div className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      flex items-center gap-2 whitespace-nowrap
                      rounded-full px-3 py-2.5 text-sm font-medium
                      transition-all duration-200
                      ${active
                        ? "bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-white"
                      }
                    `}
                  >
                    {/* <Icon size={16} strokeWidth={2} /> */}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Theme toggle and mobile menu */}
            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle />

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100/70 dark:text-zinc-200 dark:hover:bg-zinc-800/70 md:hidden"
                aria-label="Open admin navigation"
                aria-expanded={isOpen}
              >
                <Menu size={21} />
              </button>
            </div>
          </nav>

          {/* Admin profile */}
          <div className="group relative hidden shrink-0 items-center justify-end gap-3 pointer-events-auto lg:flex">
            <div className="min-w-0 text-right">
              <p className="max-w-[140px] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {adminName}
              </p>
              <p className="max-w-[140px] truncate text-xs text-zinc-500 dark:text-zinc-400">
                {adminEmail}
              </p>
            </div>

            <img
              className="h-10 w-10 cursor-pointer rounded-full border-2 border-white/70 object-cover shadow-sm dark:border-zinc-700"
              src="https://i.pinimg.com/736x/1a/3c/16/1a3c16e4fe4f09e442c8de3f9fb4aa81.jpg"
              alt="Admin profile"
            />

            <div className="invisible absolute right-0 top-full z-50 w-40 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
                {/* <div className="border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {adminName}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {adminEmail}
                  </p>
                </div> */}

                <button
                  type="button"
                  onClick={logout}
                  className="mt- flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm
          transition-opacity duration-300 dark:bg-black/50 md:hidden
          ${isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
          }
        `}
      />

      {/* Mobile slide-in menu */}
      <aside
        className={`
          fixed right-0 top-0 z-[80] flex h-[100dvh]
          w-[85%] max-w-sm flex-col
          border-l border-white/40 bg-white/95 shadow-2xl
          backdrop-blur-xl transition-transform duration-300
          dark:border-zinc-800/60 dark:bg-zinc-950/95 md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"
          }
        `}
        aria-label="Admin navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-zinc-200/70 p-5 dark:border-zinc-800/70">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white">
                Admin Panel
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage KnowMo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            aria-label="Close admin navigation"
          >
            <X size={21} />
          </button>
        </div>

        {/* Mobile profile */}
        <div className="mx-4 mt-5 flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://i.pinimg.com/736x/1a/3c/16/1a3c16e4fe4f09e442c8de3f9fb4aa81.jpg"
              alt="Admin profile"
              className="h-11 w-11 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                {adminName}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {adminEmail}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            title="Logout"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Mobile links */}
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Workspace
          </p>

          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between rounded-2xl
                  px-4 py-3.5 transition-colors
                  ${active
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  }
                `}
              >
                <span className="flex items-center gap-3 font-medium">
                  <Icon size={19} />
                  {link.label}
                </span>
                <ChevronRight size={17} />
              </Link>
            );
          })}
        </div>

        {/* Mobile footer */}
        <div className="border-t border-zinc-200/70 p-5 dark:border-zinc-800/70">
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            KnowMo Admin Workspace
          </p>
        </div>
      </aside>
    </>
  );
}
