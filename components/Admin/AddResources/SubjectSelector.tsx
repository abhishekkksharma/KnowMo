"use client";

import { ChevronDown } from "lucide-react";
import { Department, Subject } from "./useSubjectSelector";

const selectClass = `
  w-full appearance-none rounded-xl border border-zinc-200 bg-white
  px-4 py-3 pr-10 text-sm text-zinc-900 outline-none
  transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100
  dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
  dark:focus:border-zinc-500 dark:focus:ring-zinc-800
  disabled:cursor-not-allowed disabled:opacity-50
`;

interface Props {
  departments: Department[];
  subjects: Subject[];
  loadingDepts: boolean;
  loadingSubjects: boolean;
  selectedDeptId: string;
  selectedSubjectCode: string;
  onDeptChange: (id: string) => void;
  onSubjectChange: (code: string) => void;
}

export function SubjectSelector({
  departments,
  subjects,
  loadingDepts,
  loadingSubjects,
  selectedDeptId,
  selectedSubjectCode,
  onDeptChange,
  onSubjectChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Department */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Department
        </label>
        <div className="relative">
          <select
            value={selectedDeptId}
            onChange={(e) => onDeptChange(e.target.value)}
            className={selectClass}
            required
            disabled={loadingDepts}
          >
            <option value="" disabled>
              {loadingDepts ? "Loading…" : "Select department"}
            </option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
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
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Subject
        </label>
        <div className="relative">
          <select
            value={selectedSubjectCode}
            onChange={(e) => onSubjectChange(e.target.value)}
            className={selectClass}
            required
            disabled={!selectedDeptId || loadingSubjects}
          >
            <option value="" disabled>
              {loadingSubjects ? "Loading…" : "Select subject"}
            </option>
            {subjects.map((s) => (
              <option key={s._id} value={s.subjectCode}>
                {s.name} ({s.subjectCode})
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
      </div>
    </div>
  );
}

