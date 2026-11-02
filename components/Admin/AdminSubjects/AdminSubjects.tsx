"use client";

import {
  X,
  Search,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { API_BASE_URL } from "@/lib/apiConfig";

interface Subject {
  _id: string;
  name: string;
  departmentCode: string;
  year: number;
  semester?: number;
  subjectCode: string;
  resourceCount?: number;
  totalSearches?: number;
}

interface Department {
  _id: string;
  name: string;
  departmentCode: string;
}

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

interface AddSubjectModalProps {
  departments: Department[];
  onClose: () => void;
  onCreated: () => void;
}

function AddSubjectModal({ departments, onClose, onCreated }: AddSubjectModalProps) {
  const [name, setName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [year, setYear] = useState("1");
  const [semester, setSemester] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!departmentCode) {
      setError("Please select a department");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/subject`, {
        method: "POST",
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
      if (!res.ok) throw new Error(data.message || "Failed to create subject.");
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <BookOpen size={15} className="text-white dark:text-zinc-900" />
            </div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              New Subject
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 p-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Department
            </label>
            <select
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
              className={selectClass}
              required
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.departmentCode}>
                  {dept.name} ({dept.departmentCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Subject Name
            </label>
            <input
              type="text"
              placeholder="e.g., Data Structures and Algorithms"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Subject Code
            </label>
            <input
              type="text"
              placeholder="e.g., 24CSE0317"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Year
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Semester
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className={inputClass}
                required
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

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [deptRes, subRes] = await Promise.all([
        fetch(`${API_BASE_URL}/department`),
        fetch(`${API_BASE_URL}/subject`),
      ]);

      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(Array.isArray(deptData) ? deptData : []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubjects(Array.isArray(subData.subjects) ? subData.subjects : []);
      } else {
        throw new Error("Failed to fetch subjects");
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Error loading subjects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreated = () => {
    fetchData();
    setSuccessMsg("Subject created successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filtered = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      s.departmentCode.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDeptFilter === "ALL" ||
      s.departmentCode.toUpperCase() === selectedDeptFilter.toUpperCase();

    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex flex-col gap-5 pt-10 px-4 sm:px-10 lg:px-18 m-18 font-mono">
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 size={16} className="shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Search + Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="flex flex-1 min-w-52 max-w-sm items-center rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="text-zinc-400 shrink-0" size={16} />
            <input
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              type="text"
              placeholder="Search subjects…"
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

          {/* Department Filter */}
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d.departmentCode}>
                {d.departmentCode}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
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
            Add Subject
          </button>
        </div>
      </div>

      {!loading && !fetchError && (
        <p className="text-xs text-zinc-400 -mt-2">
          Showing {filtered.length} of {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
        </p>
      )}

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
              <th className="px-5 py-3.5 font-semibold">Subject</th>
              <th className="px-5 py-3.5 font-semibold text-center">Code</th>
              <th className="px-5 py-3.5 font-semibold text-center">Department</th>
              <th className="px-5 py-3.5 font-semibold text-center">Year</th>
              <th className="px-5 py-3.5 font-semibold text-center">Semester</th>
              <th className="px-5 py-3.5 font-semibold text-center">Resources</th>
              <th className="px-5 py-3.5 font-semibold text-center">Searches</th>
            </tr>
          </thead>

          <tbody>
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

            {!loading && filtered.map((sub) => (
              <tr
                key={sub._id}
                className="border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40 transition-colors"
              >
                <td className="px-5 py-4 font-medium text-zinc-800 dark:text-zinc-100">
                  {sub.name}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {sub.subjectCode}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {sub.departmentCode}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-zinc-600 dark:text-zinc-400">
                  Year {sub.year}
                </td>
                <td className="px-5 py-4 text-center text-zinc-600 dark:text-zinc-400">
                  Sem {sub.semester || "-"}
                </td>
                <td className="px-5 py-4 text-center text-zinc-600 dark:text-zinc-400">
                  {sub.resourceCount ?? 0}
                </td>
                <td className="px-5 py-4 text-center text-zinc-600 dark:text-zinc-400">
                  {sub.totalSearches ?? 0}
                </td>
              </tr>
            ))}

            {!loading && !fetchError && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-14 text-center">
                  <BookOpen size={32} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-sm text-zinc-400">
                    {search ? "No subjects match your search." : "No subjects yet."}
                  </p>
                  {!search && (
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 text-xs font-semibold text-zinc-500 underline hover:text-zinc-900 dark:hover:text-white"
                    >
                      Add the first subject →
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddSubjectModal
          departments={departments}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

