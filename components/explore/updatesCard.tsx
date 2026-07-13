"use client";

import { UserRound } from "lucide-react";
import { motion } from "framer-motion";

interface IUpdate {
  update: string;
  message: string;
  updatingUser?: string;
  createdAt: string;
}

function UpdatesCard({
  update,
  message,
  updatingUser,
  createdAt,
}: IUpdate) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="
        w-full 
        rounded-2xl 
        bg-white/45 
        dark:bg-zinc-900/25 
        backdrop-blur-md 
        border 
        border-white/30 
        dark:border-zinc-800/40 
        p-2
        shadow-sm 
        hover:shadow-md 
        transition-shadow 
        duration-300
      "
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/20 dark:border-zinc-700/20">
          <UserRound size={16} className="text-zinc-600 dark:text-zinc-400" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
            {update}
          </h3>

          {updatingUser && (
            <p className="text-xs text-neutral-400 dark:text-zinc-500 font-mono mt-0.5">
              by {updatingUser}
            </p>
          )}

          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {message}
          </p>

          <p className="mt-3.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
            <span>
              {new Date(createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>
              {new Date(createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default UpdatesCard;
