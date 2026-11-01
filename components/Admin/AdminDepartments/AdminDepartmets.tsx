"use client";

import {
  X,
  Search,
  Building2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import React, { useState, useEffect, useCallback, FormEvent } from "react";

const API_BASE = "http://localhost:5000/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Department {
  _id: string;
  name: string;
  departmentCode: string;
  yearsOfDegree: number;
  totalSubjects: number;
  totalResources: number;
  totalSearches: number;
  isActive: boolean;
}

// ─── Shared primitives ────────────────────────────────────────────────────────
const inputClass = `
  w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm
  text-zinc-900 outline-none transition placeholder:text-zinc-400
  focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800
`;

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Pill({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex flex-col items-center leading-tight">
      <span className="font-semibold text-zinc-800 dark:text-zinc-100">{value}</span>
      <span className="text-[10px] text-zinc-400">{label}</span>
    </span>
  );
}

// ─── Add-department modal ─────────────────────────────────────────────────────
interface AddModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function AddDepartmentModal({ onClose, onCreated }: AddModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [years, setYears] = useState("4");
  const [hod, setHod] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/department`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          departmentCode: code.trim().toUpperCase(),
          yearsOfDegree: Number(years),
          hod: hod.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create department.");
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <Building2 size={15} className="text-white dark:text-zinc-900" />
            </div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              New Department
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Department Name
              </label>
              <input
                type="text"
                placeholder="e.g., Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Code
              </label>
              <input
                type="text"
                placeholder="e.g., CSE"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Years of Degree
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                HOD <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Head of Department name"
                value={hod}
                onChange={(e) => setHod(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Description <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Brief description…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function AdminDepartmets() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`${API_BASE}/department`);
      if (!res.ok) throw new Error("Failed to fetch departments.");
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  const handleCreated = () => {
    fetchDepartments();
    setSuccessMsg("Department created successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.departmentCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 lg:pt-10 pt-24 px-4 sm:px-10 lg:px-18 lg:m-18 font-mono">

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 size={16} className="shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Search + Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2">
        {/* Search */}
        <div className="flex flex-1 min-w-52 max-w-sm items-center rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Search className="text-zinc-400 shrink-0" size={16} />
          <input
            className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            type="text"
            placeholder="Search departments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <X
              className="text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200 shrink-0"
              size={16}
              onClick={() => setSearch("")}
            />
          )}
        </div>

        {/* Right-side buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDepartments}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={15} />
            Add New
          </button>
        </div>
      </div>

      {/* Results count */}
      {!loading && !fetchError && (
        <p className="text-xs text-zinc-400 -mt-2">
          Showing {filtered.length} of {departments.length} department{departments.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Error state */}
      {fetchError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          {fetchError}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900/60">
            <tr className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="px-5 py-3.5 font-semibold">Department</th>
              <th className="px-5 py-3.5 font-semibold text-center">Code</th>
              <th className="px-5 py-3.5 font-semibold text-center">Duration</th>
              <th className="px-5 py-3.5 font-semibold text-center">Subjects</th>
              <th className="px-5 py-3.5 font-semibold text-center">Resources</th>
              <th className="px-5 py-3.5 font-semibold text-center">Searches</th>
              <th className="px-5 py-3.5 font-semibold text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {loading && (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ width: j === 0 ? "70%" : "40%" }} />
                    </td>
                  ))}
                </tr>
              ))
            )}

            {/* Rows */}
            {!loading && filtered.map((dept) => (
              <tr
                key={dept._id}
                className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <td className="px-5 py-4 font-medium text-zinc-800 dark:text-zinc-100">
                  {dept.name}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {dept.departmentCode}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-zinc-600 dark:text-zinc-400">
                  {dept.yearsOfDegree} yr{dept.yearsOfDegree !== 1 ? "s" : ""}
                </td>
                <td className="px-5 py-4 text-center">
                  <Pill value={dept.totalSubjects ?? 0} label="subjects" />
                </td>
                <td className="px-5 py-4 text-center">
                  <Pill value={dept.totalResources ?? 0} label="files" />
                </td>
                <td className="px-5 py-4 text-center">
                  <Pill value={dept.totalSearches ?? 0} label="hits" />
                </td>
                <td className="px-5 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    dept.isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${dept.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
                    {dept.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}

            {/* Empty */}
            {!loading && !fetchError && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <Building2 size={32} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm text-zinc-400">
                    {search ? "No departments match your search." : "No departments yet."}
                  </p>
                  {!search && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 text-xs font-semibold text-zinc-500 underline hover:text-zinc-900 dark:hover:text-white"
                    >
                      Add the first department →
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add department modal */}
      {showModal && (
        <AddDepartmentModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

export default AdminDepartmets;
