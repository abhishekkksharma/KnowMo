"use client";

import {
  Loader2,
  Save,
  Braces,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

const NEXT_PUBLIC_CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL+'/api' || 'http://localhost:5000/api';

const DEFAULT_JSON = `[
  {
    "question": "Sample question?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "Explanation here"
  }
]`;

interface Department {
  _id: string;
  name: string;
  departmentCode: string;
}

interface Subject {
  _id: string;
  name: string;
  subjectCode: string;
}

function AddMcqs() {
  // Data State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Form State
  const [department, setDepartment] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [questionsJson, setQuestionsJson] = useState(DEFAULT_JSON);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch departments on mount
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${NEXT_PUBLIC_CLIENT_BASE_URL}/department`);
        const data = await res.json();
        setDepartments(Array.isArray(data) ? data : []);
      } catch {
        setDepartments([]);
      } finally {
        setLoadingDepts(false);
      }
    }
    fetchDepartments();
  }, []);

  // Fetch subjects when department changes
  useEffect(() => {
    if (!departmentCode) {
      setSubjects([]);
      return;
    }
    setLoadingSubjects(true);
    setSubjectCode("");
    async function fetchSubjects() {
      try {
        const res = await fetch(`${NEXT_PUBLIC_CLIENT_BASE_URL}/subject/${departmentCode}`);
        const data = await res.json();
        setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
      } catch {
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    }
    fetchSubjects();
  }, [departmentCode]);

  const handleDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = departments.find((d) => d._id === e.target.value);
    setDepartment(e.target.value);
    setDepartmentCode(selected?.departmentCode ?? "");
    setSubjectCode("");
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!subjectCode) {
      setMessage({
        type: "error",
        text: "Please select a department and subject.",
      });
      return;
    }

    if (!questionsJson.trim()) {
      setMessage({
        type: "error",
        text: "Questions JSON cannot be empty.",
      });
      return;
    }

    let parsedQuestions: unknown;

    try {
      parsedQuestions = JSON.parse(questionsJson);

      if (!Array.isArray(parsedQuestions)) {
        throw new Error("JSON must be an array of question objects.");
      }

      if (parsedQuestions.length === 0) {
        throw new Error("Add at least one question.");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? `Invalid JSON: ${error.message}`
            : "Invalid JSON format.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${NEXT_PUBLIC_CLIENT_BASE_URL}/resource/mcqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectCode,
          questions: parsedQuestions,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(
          (err as { message?: string }).message || "Failed to add MCQs."
        );
      }

      const data = await response.json();
      setMessage({
        type: "success",
        text: `Successfully added ${(parsedQuestions as unknown[]).length} question(s)! Total in bank: ${data.totalQuestions ?? "—"}`,
      });
    } catch (error) {
      console.error("API Error:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while saving to the database.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass = `
    w-full appearance-none rounded-lg border border-zinc-200
    bg-white px-3 py-2 pr-9 text-sm text-zinc-900 outline-none
    transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200
    dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100
    dark:focus:border-zinc-500 dark:focus:ring-zinc-800
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-6">
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
          Add Bulk MCQs
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Select a subject and upload questions using JSON.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject selection */}
        <section className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900/50">
          {/* Department */}
          <div className="space-y-1.5">
            <label
              htmlFor="department"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Department
            </label>
            <div className="relative">
              <select
                id="department"
                value={department}
                onChange={handleDepartmentChange}
                className={selectClass}
                required
                disabled={loadingDepts}
              >
                <option value="" disabled>
                  {loadingDepts ? "Loading departments..." : "Select department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Subject
            </label>
            <div className="relative">
              <select
                id="subject"
                value={subjectCode}
                onChange={(e) => { setSubjectCode(e.target.value); setMessage(null); }}
                disabled={!department || loadingSubjects}
                className={selectClass}
                required
              >
                <option value="" disabled>
                  {loadingSubjects ? "Loading subjects..." : "Select subject"}
                </option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub.subjectCode}>
                    {sub.name} ({sub.subjectCode})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        </section>

        {/* JSON editor */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors focus-within:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:border-zinc-600">
          <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Braces size={17} className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Questions JSON
              </span>
            </div>
            <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              JSON
            </span>
          </div>

          <textarea
            value={questionsJson}
            onChange={(e) => setQuestionsJson(e.target.value)}
            placeholder="Paste your JSON array here..."
            className="min-h-64 w-full resize-y bg-transparent p-3 font-mono text-xs leading-5 text-zinc-800 outline-none placeholder:text-zinc-400 sm:h-80 dark:text-zinc-200"
            spellCheck={false}
            required
          />

          <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span>Paste a valid JSON array</span>
            <span>{questionsJson.length} characters</span>
          </div>
        </section>

        {/* Status */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
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
            disabled={isLoading || !subjectCode || !questionsJson.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save size={16} />
                Upload MCQs
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddMcqs;
