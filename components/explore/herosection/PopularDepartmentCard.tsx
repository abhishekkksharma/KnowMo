"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PopularDepartmentCardProps {
  rankNumber: number;
  departmentName: string;
  totalSearchCount: number;
}

function PopularDepartmentCard({
  rankNumber,
  departmentName,
  totalSearchCount,
}: PopularDepartmentCardProps) {
  const isRankOne = rankNumber === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full flex flex-col justify-between gap-4 p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-zinc-900 hover:shadow-lg transition-all duration-300"
    >
      <div>
        <div>
          <p
            className={`font-extrabold text-gray-300 dark:text-gray-750 tracking-tighter leading-none select-none transition-all duration-300 ${
              isRankOne
                ? "text-5xl sm:text-5xl md:text-6xl text-gray-400 dark:text-gray-650"
                : "text-4xl sm:text-5xl md:text-6xl"
            }`}
          >
            {String(rankNumber).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-3">
          <p className="font-semibold text-lg sm:text-xl text-gray-700 dark:text-gray-100 line-clamp-2">
            {departmentName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 mt-auto pt-2">
        <p className="text-sm sm:text-base">
          {totalSearchCount.toLocaleString()} Searches
        </p>
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    </motion.div>
  );
}

export default PopularDepartmentCard;