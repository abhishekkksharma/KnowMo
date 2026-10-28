"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Building2, FilePlus2, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";

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
    <>
    </>
  );
}
