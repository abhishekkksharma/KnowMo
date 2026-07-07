"use client";

import React from "react";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { motion } from "framer-motion";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface DepartmentCardProps {
  name: string;
  departmentCode: string;
  totalSearches?: number;
  yearsOfDegree?: number;
}

export default function DepartmentCard({
  name,
  departmentCode,
  totalSearches = 0,
  yearsOfDegree = 4,
}: DepartmentCardProps) {
  return (
    <Link href={`/departments/${departmentCode}`} className="block">
      <motion.div
        whileHover={{
          y: -6,
          rotate: -2,
          scale: 1.02,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-60 h-56 bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 relative cursor-pointer group transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600 flex flex-col justify-between"
      >
        {/* Binder ring holes on the left for a custom notebook style */}
        <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-4 pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 transition-colors"
            />
          ))}
        </div>

        {/* Content shift right */}
        <div className="pl-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Header */}
            <h2 className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-850 dark:group-hover:text-zinc-200 transition-colors text-xs font-bold tracking-widest uppercase mb-2 font-mono">
              {departmentCode}
            </h2>

            {/* Department Name: Bold and bigger (Black/White) */}
            <h3
              className={`${caveat.className} text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-2`}
            >
              {name}
            </h3>
          </div>

          {/* Minimal details: Smaller and lighter gray */}
          <div
            className={`${caveat.className} flex flex-col text-zinc-500 dark:text-zinc-400 text-sm mt-auto pt-2`}
          >
            <div className="border-b border-zinc-100 dark:border-zinc-900 pb-1 mb-1 pl-1">
              - {totalSearches} Searches
            </div>

            <div className="border-b border-zinc-100 dark:border-zinc-900 pb-1 mb-1 pl-1">
              - {yearsOfDegree}-Yr Degree
            </div>

            {/* Ellipsis */}
            <div className="pt-0.5 pl-1 text-base tracking-widest font-bold text-zinc-400 dark:text-zinc-500">
              ...
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}