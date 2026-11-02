"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Pencil,
  FileText,
  Search,
  Calendar,
  Layers,
  HelpCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";

interface SubjectData {
  _id: string;
  name: string;
  departmentCode: string;
  year: number;
  semester?: number;
  subjectCode: string;
  resourceCount?: number;
  totalSearches?: number;
  createdAt?: string;
  updatedAt?: string;
  resources?: Array<{
    _id: string;
    title: string;
    type: string;
    customType?: string;
    fileUrl?: string;
    year: number;
    description?: string;
  }>;
}

export default function SubjectDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [questionBankCount, setQuestionBankCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No subject ID provided");
      setLoading(false);
      return;
    }

    async function fetchSubject() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/subject/byId/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load subject details");
        }
        setSubject(data.data);
        setQuestionBankCount(data.questionBankCount || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to server");
      } finally {
        setLoading(false);
      }
    }

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-mono">Loading subject details...</p>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="pt-24 px-4 max-w-4xl mx-auto w-full font-mono">
        <button
          onClick={() => router.push("/admin/subjects")}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Subjects
        </button>

        <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error || "Subject not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full font-mono flex flex-col gap-8">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => router.push("/admin/subjects")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Subjects List
        </button>

        {/* Primary Edit Button */}
        <Link
          href={`/admin/subjects/edit?id=${subject._id}`}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Pencil size={15} />
          Edit Subject
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {subject.name}
                </h1>
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {subject.subjectCode}
                </span>
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {subject.departmentCode}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Department: <span className="font-semibold">{subject.departmentCode}</span> • Year {subject.year}
                {subject.semester ? ` • Semester ${subject.semester}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Calendar size={13} /> Curriculum
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              Year {subject.year}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Layers size={13} /> Semester
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {subject.semester ? `Sem ${subject.semester}` : "N/A"}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <FileText size={13} /> Resources
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {subject.resources?.length ?? subject.resourceCount ?? 0}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Search size={13} /> Searches
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {subject.totalSearches ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left info box */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Assessment Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <HelpCircle size={14} /> MCQs in Question Bank
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {questionBankCount}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Question bank content is kept compact to preserve bandwidth and loaded only on practice tests.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Metadata
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-zinc-400">Created:</span>{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {subject.createdAt ? new Date(subject.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Last Modified:</span>{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {subject.updatedAt ? new Date(subject.updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right resources list */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Uploaded Resources
              </h3>
              <span className="text-xs text-zinc-400">
                {subject.resources?.length || 0} files
              </span>
            </div>

            {subject.resources && subject.resources.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {subject.resources.map((res) => (
                  <div
                    key={res._id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {res.title}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        <span className="capitalize font-mono">{res.type}</span>
                        {res.customType ? ` (${res.customType})` : ""} • Year {res.year}
                      </p>
                    </div>

                    {res.fileUrl && (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium p-1.5"
                      >
                        File <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-400 text-sm">
                No resources uploaded for this subject yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

