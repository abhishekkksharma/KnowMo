"use client";

import { useState, FormEvent } from "react";
import {
  FilePlus2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { SubjectSelector } from "./SubjectSelector";
import { useSubjectSelector } from "./useSubjectSelector";

const NEXT_PUBLIC_CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000/api";

const RESOURCE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "pyq", label: "Previous Year Questions" },
  { value: "assignment", label: "Assignment" },
  { value: "lab", label: "Lab Manual" },
  { value: "other", label: "Other" },
] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number]["value"];

const inputClass = `
  w-full rounded-xl border border-zinc-200 bg-white
  px-4 py-3 text-sm text-zinc-900 outline-none
  transition placeholder:text-zinc-400
  focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:placeholder:text-zinc-500
  dark:focus:border-zinc-500 dark:focus:ring-zinc-800
`;

const selectClass = `
  w-full appearance-none rounded-xl border border-zinc-200 bg-white
  px-4 py-3 pr-10 text-sm text-zinc-900 outline-none
  transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:focus:border-zinc-500 dark:focus:ring-zinc-800
`;

export function AddResourceForm() {
  const selector = useSubjectSelector();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ResourceType>("notes");
  const [customType, setCustomType] = useState("");
  const [year, setYear] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const reset = () => {
    setTitle("");
    setType("notes");
    setCustomType("");
    setYear("");
    setFileUrl("");
    setDescription("");
    selector.handleDeptChange("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!selector.selectedSubjectCode) {
      setMessage({ type: "error", text: "Please select a department and subject." });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${NEXT_PUBLIC_CLIENT_BASE_URL}/resource`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type,
          customType: type === "other" ? customType.trim() : undefined,
          departmentCode: selector.selectedDept?.departmentCode,
          year: Number(year),
          subjectCode: selector.selectedSubjectCode,
          fileUrl: fileUrl.trim(),
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add resource.");
      }

      setMessage({ type: "success", text: `"${title}" added successfully!` });
      reset();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Year options driven by the selected department's degree length
  const totalYears = selector.selectedDept?.yearsOfDegree ?? 4;
  const yearOptions = Array.from({ length: totalYears }, (_, i) => i + 1);

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
            <FilePlus2 size={18} className="text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
            Add Resource
          </h1>
        </div>
        <p className="ml-12 text-sm text-zinc-500 dark:text-zinc-400">
          Upload a new study material to the question bank.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Department + Subject */}
        <section className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Target
          </p>
          <SubjectSelector
            departments={selector.departments}
            subjects={selector.subjects}
            loadingDepts={selector.loadingDepts}
            loadingSubjects={selector.loadingSubjects}
            selectedDeptId={selector.selectedDeptId}
            selectedSubjectCode={selector.selectedSubjectCode}
            onDeptChange={selector.handleDeptChange}
            onSubjectChange={(code) => {
              selector.setSelectedSubjectCode(code);
              setMessage(null);
            }}
          />

          {/* Year — shown once subject is picked */}
          {selector.selectedSubjectCode && (
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Academic Year
              </label>
              <div className="relative w-40">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>Year</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>
          )}
        </section>

        {/* Resource details */}
        <section className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Details
          </p>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Unit 3 – Computer Networks Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Type + Custom type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Type
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ResourceType)}
                  className={selectClass}
                  required
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>

            {type === "other" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Custom Type
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cheat Sheet"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            )}
          </div>

          {/* File URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              File URL
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/…"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Description{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Short description of what this resource covers…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </section>

        {/* Status */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <FilePlus2 size={15} />
                Add Resource
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

