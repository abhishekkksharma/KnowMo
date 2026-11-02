"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
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

export default function DepartmentEdit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [name, setName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [description, setDescription] = useState("");
  const [yearsOfDegree, setYearsOfDegree] = useState(4);
  const [hod, setHod] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No department ID provided");
      setLoading(false);
      return;
    }

    async function loadDepartment() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/department/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load department");
        }
        const dept = data.data;
        setName(dept.name || "");
        setDepartmentCode(dept.departmentCode || "");
        setDescription(dept.description || "");
        setYearsOfDegree(dept.yearsOfDegree || 4);
        setHod(dept.hod || "");
        setIsActive(dept.isActive !== false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error connecting to server");
      } finally {
        setLoading(false);
      }
    }

    loadDepartment();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/department/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          departmentCode: departmentCode.trim().toUpperCase(),
          description: description.trim(),
          yearsOfDegree: Number(yearsOfDegree),
          hod: hod.trim(),
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update department");
      }

      setSuccess("Department updated successfully!");
      setTimeout(() => {
        router.push(`/admin/departments/view?id=${id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update department");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">Loading department details...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-10 lg:px-18 max-w-3xl mx-auto w-full font-mono flex flex-col gap-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(id ? `/admin/departments/view?id=${id}` : "/admin/departments")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Details
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Edit Department
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update information for {departmentCode || "Department"}
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
              Department Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Department Code
            </label>
            <input
              type="text"
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Years of Degree
            </label>
            <input
              type="number"
              min="1"
              max="6"
              value={yearsOfDegree}
              onChange={(e) => setYearsOfDegree(Number(e.target.value))}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Head of Department (HOD)
            </label>
            <input
              type="text"
              placeholder="e.g., Dr. Jane Smith"
              value={hod}
              onChange={(e) => setHod(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2 flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Active Status</p>
              <p className="text-xs text-zinc-400">Enable or disable this department across the platform</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-zinc-900 dark:peer-checked:bg-white dark:peer-checked:after:bg-zinc-900"></div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={id ? `/admin/departments/view?id=${id}` : "/admin/departments"}
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

