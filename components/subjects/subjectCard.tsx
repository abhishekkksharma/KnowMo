"use client"

import Link from "next/link";
import { Notebook } from "lucide-react";

interface SubjectCardProps {
  name: string;
  year: number;
  semester?: number;
  departmentCode: string;
  subjectCode: string;
  viewType?: "card" | "tile";
}

function SubjectCard({
  name,
  year,
  semester = 0,
  departmentCode,
  subjectCode,
  viewType = "card",
}: SubjectCardProps) {
  if (viewType === "tile") {
    return (
      <div
        className="
          group relative overflow-hidden
          flex items-center justify-between w-full gap-4 rounded-2xl
          border border-zinc-200/80
          bg-gradient-to-r from-white to-zinc-50
          px-5 py-4
          shadow-[0_4px_20px_rgb(0,0,0,0.04)]
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]

          dark:border-zinc-800
          dark:bg-gradient-to-r
          dark:from-zinc-900
          dark:to-black
          dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)]
        "
      >
        {/* Light Mode Glow */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.03),transparent_45%)]
            dark:hidden
          "
        />

        {/* Dark Mode Glow */}
        <div
          className="
            pointer-events-none absolute inset-0 hidden dark:block
            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_35%)]
          "
        />

        <div className="flex items-center gap-4 min-w-0 flex-1 relative z-10">
          {/* Icon */}
          <div
            className="
            hidden
              flex-shrink-0 rounded-xl p-2.5
              transition-all duration-300
              group-hover:scale-105

              bg-zinc-100
              border border-zinc-200

              dark:bg-zinc-800/40
              dark:border-zinc-700
            "
          >
            <Notebook
              size={20}
              className="text-zinc-700 dark:text-zinc-300"
            />
          </div>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {departmentCode}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 font-mono text-zinc-500 dark:text-zinc-400">
                Year {year}
              </span>
              {semester > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/60 font-mono text-zinc-500 dark:text-zinc-400">
                  Sem {semester}
                </span>
              )}
            </div>
            <h3 className="mt-1 truncate text-base font-bold text-zinc-900 dark:text-white" title={name}>
              {name}
            </h3>
          </div>
        </div>

        {/* Link Button */}
        <div className="relative z-10 flex-shrink-0">
          <Link
            // need to fix this 
            href={`/subject?subjectCode=${subjectCode}`}
            className="
              rounded-full
              bg-zinc-900
              px-4 py-1.5
              text-xs font-medium
              text-white
              transition-all duration-300
              hover:bg-zinc-800
              hover:shadow-md

              dark:bg-white
              dark:text-zinc-900
              dark:hover:bg-zinc-200
            "
          >
            View →
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className="
        group relative overflow-hidden
        flex h-52 w-full gap-6 rounded-3xl
        border border-zinc-200/80
        bg-gradient-to-b from-white to-zinc-50
        p-5
        shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]

        dark:border-zinc-800
        dark:bg-gradient-to-b
        dark:from-zinc-800
        dark:via-zinc-900
        dark:to-black
        dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
      "
    >
      {/* Light Mode Glow */}
      <div
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.05),transparent_40%)]
          dark:hidden
        "
      />

      {/* Dark Mode Glow */}
      <div
        className="
          pointer-events-none absolute inset-0 hidden dark:block
          bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_35%)]
        "
      />

      <div
        className="
          pointer-events-none absolute -top-16 -right-16 hidden dark:block
          h-48 w-48 rounded-full
          bg-white/10 blur-3xl
        "
      />

      <div
        className="
          pointer-events-none absolute -bottom-24 -left-24 hidden dark:block
          h-64 w-64 rounded-full
          bg-zinc-600/10 blur-3xl
        "
      />

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          className="
            rounded-2xl p-3
            transition-all duration-300
            group-hover:scale-110

            bg-zinc-100
            border border-zinc-200

            dark:bg-zinc-800/40
            dark:border-zinc-700
            dark:backdrop-blur-sm
          "
        >
          <Notebook
            size={56}
            className="text-zinc-700 dark:text-zinc-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div>
          <div>
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              {departmentCode}
            </span>

            <h3 className="mt-1 line-clamp-2 min-h-[3.5rem] text-lg font-bold text-zinc-900 dark:text-white">
              {name}
            </h3>
          </div>

          {/* <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
            {year}
          </p> */}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Year
            </p>

            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {year}
            </p>
          </div>

          <Link
            href={`/subject?subjectCode=${subjectCode}`}
            className="
              rounded-full
              bg-zinc-900
              px-5 py-2
              text-sm font-medium
              text-white
              transition-all duration-300
              hover:bg-zinc-800
              hover:shadow-lg

              dark:bg-white
              dark:text-zinc-900
              dark:hover:bg-zinc-200
            "
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;
