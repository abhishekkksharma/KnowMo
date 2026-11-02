"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Building2, FilePlus2, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import MappedRequests from "./MappedRequests";

const adminModules = [
  {
    title: "Subjects",
    description: "Manage semester subjects, curricula, and course mappings",
    href: "/admin/subjects",
    icon: BookOpen,
    color: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
    badge: "Curriculum",
  },
  {
    title: "Departments",
    description: "Configure academic branches, codes, and department structures",
    href: "/admin/departments",
    icon: Building2,
    color: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
    badge: "Structure",
  },
  {
    title: "Add Resources",
    description: "Upload and organize study materials, lecture notes, and syllabus",
    href: "/admin/addresources",
    icon: FilePlus2,
    color: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
    badge: "Materials",
  },
  {
    title: "Generate Tests",
    description: "Create AI-powered assessments and practice question banks",
    href: "/admin/generatetests",
    icon: ClipboardCheck,
    color: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
    badge: "Assessment",
  },
];

export default function AdminMain() {
  const { user } = useAdminAuth();

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Admin Overview
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Select a management module or review incoming requests.
        </p>
      </div>

      {/* Module Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white group-hover:scale-105 transition-transform duration-300">
                    <Icon size={20} />
                  </div>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {module.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1 group-hover:text-black dark:group-hover:text-zinc-100">
                  {module.title}
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {module.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Requests Section */}
      <div className="pt-2">
        <MappedRequests />
      </div>
    </section>
  );
}
