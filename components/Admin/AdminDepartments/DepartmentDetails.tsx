"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ArrowLeft,
  Pencil,
  BookOpen,
  FileText,
  Search,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";

interface DepartmentData {
  _id: string;
  name: string;
  departmentCode: string;
  description?: string;
  yearsOfDegree: number;
  totalSearches?: number;
  totalResources?: number;
  totalSubjects?: number;
  hod?: string;
  image?: string;
  banner?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subjects?: Array<{
    _id: string;
    name: string;
    subjectCode: string;
    year: number;
    semester?: number;
    resourceCount?: number;
  }>;
}

export default function DepartmentDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No department ID provided");
      setLoading(false);
      return;
    }

    async function fetchDepartment() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/department/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load department details");
        }
        setDepartment(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to server");
      } finally {
        setLoading(false);
      }
    }

    fetchDepartment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-mono">Loading department details...</p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="pt-24 px-4 max-w-4xl mx-auto w-full font-mono">
        <button
          onClick={() => router.push("/admin/departments")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Departments
        </button>

        <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error || "Department not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full font-mono flex flex-col gap-8">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push("/admin/departments")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Departments List
        </button>

        {/* Primary Edit Button for Next Page */}
        <Link
          href={`/admin/departments/edit?id=${department._id}`}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Pencil size={15} />
          Edit Department
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <Building2 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {department.name}
                </h1>
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {department.departmentCode}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    department.isActive !== false
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      department.isActive !== false ? "bg-emerald-500" : "bg-zinc-400"
                    }`}
                  />
                  {department.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                {department.description || "No description provided for this department."}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Calendar size={13} /> Duration
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {department.yearsOfDegree} Years
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <BookOpen size={13} /> Subjects
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {department.subjects?.length ?? department.totalSubjects ?? 0}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <FileText size={13} /> Resources
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {department.totalResources ?? 0}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Search size={13} /> Searches
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {department.totalSearches ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Additional Info */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Department Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-zinc-400">Head of Department (HOD)</p>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mt-0.5">
                  <User size={14} className="text-zinc-400" />
                  {department.hod || "Not assigned"}
                </p>
              </div>

              {department.createdAt && (
                <div>
                  <p className="text-xs text-zinc-400">Created Date</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {new Date(department.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              )}

              {department.updatedAt && (
                <div>
                  <p className="text-xs text-zinc-400">Last Updated</p>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                    {new Date(department.updatedAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Subjects list under department */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Subjects in this Department
              </h3>
              <span className="text-xs text-zinc-400">
                {department.subjects?.length || 0} registered
              </span>
            </div>

            {department.subjects && department.subjects.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {department.subjects.map((sub) => (
                  <div
                    key={sub._id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {sub.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Code: <span className="font-mono">{sub.subjectCode}</span> • Year {sub.year}
                        {sub.semester ? ` • Sem ${sub.semester}` : ""}
                      </p>
                    </div>

                    <Link
                      href={`/admin/subjects/view?id=${sub._id}`}
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium p-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      title="View subject details"
                    >
                      View <ExternalLink size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm">
                No subjects mapped to this department yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

