"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";

const inputClass = `
  w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm
  text-zinc-900 outline-none transition placeholder:text-zinc-400
  focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800
`;

const selectClass = `
  w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm
  text-zinc-900 outline-none transition
  focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:focus:border-zinc-500 dark:focus:ring-zinc-800
`;

interface Department {
  _id: string;
  name: string;
  departmentCode: string;
}

export default function SubjectEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No subject ID provided");
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [subRes, deptRes] = await Promise.all([
          fetch(`${API_BASE_URL}/subject/byId/${id}`),
          fetch(`${API_BASE_URL}/department`),
        ]);

        const subData = await subRes.json();
        if (!subRes.ok || !subData.success) {
          throw new Error(subData.message || "Failed to load subject");
        }

        const sub = subData.data;
        setName(sub.name || "");
        setSubjectCode(sub.subjectCode || "");
        setDepartmentCode(sub.departmentCode || "");
        setYear(sub.year || 1);
        setSemester(sub.semester || 1);

        if (deptRes.ok) {
          const deptData = await deptRes.json();
          setDepartments(Array.isArray(deptData) ? deptData : []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to server");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/subject/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          subjectCode: subjectCode.trim().toUpperCase(),
          departmentCode: departmentCode.trim().toUpperCase(),
          year: Number(year),
          semester: Number(semester),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update subject");
      }

      setSuccess("Subject updated successfully!");
      setTimeout(() => {
        router.push(`/admin/subjects/view?id=${id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subject");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Loading subject details...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-10 lg:px-18 max-w-3xl mx-auto w-full font-mono flex flex-col gap-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(id ? `/admin/subjects/view?id=${id}` : "/admin/subjects")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Details
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Edit Subject
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update curriculum details for {subjectCode || "Subject"}
          </p>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success} Redirecting back...</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Department
            </label>
            <select
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              className={selectClass}
              required
            >
              <option value="" disabled>Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d.departmentCode}>
                  {d.name} ({d.departmentCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Subject Code
            </label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Year
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Semester
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={id ? `/admin/subjects/view?id=${id}` : "/admin/subjects"}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

