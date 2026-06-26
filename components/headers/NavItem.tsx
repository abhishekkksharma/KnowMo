"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Dropdown from "./Dropdown";
import { NavItemProps } from "./types";

export default function NavItem({
  label,
  href,
  icon,
  active,
  dropdown,
}: NavItemProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div
      className={`
      relative /* Added relative so the motion.div absolute positioning works */
      flex
      items-center
      justify-center
      w-full
      
      /* Balanced padding matching image_73dee2.png */
      px-4
      sm:px-6
      py-2.5
      
      rounded-full
      font-semibold
      text-base
      whitespace-nowrap /* Prevents text wrapping if you add lots of tabs */
      
      transition-colors /* Changed from transition-all to avoid conflicting with Framer Motion */
      duration-200
      cursor-pointer
      select-none
      
      ${
        active
          ? "text-white dark:text-zinc-950" /* Kept active text colors, removed static bg */
          : "text-zinc-700 hover:bg-gray-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
      }
      `}
    >
      {/* The Animated Sliding Pill */}
      {active && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute inset-0 bg-zinc-900 shadow-md dark:bg-white rounded-full"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
          style={{ zIndex: 0 }}
        />
      )}

      {/* Content wrapper with z-10 so it sits ABOVE the animated pill */}
      <div className="relative z-10 flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );

  return (
    <div
      className="relative flex-1 min-w-0 flex justify-center px-0.5"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {href ? (
        <Link href={href} className="w-full block">
          {content}
        </Link>
      ) : (
        content
      )}

      {dropdown && <Dropdown open={open} items={dropdown} />}
    </div>
  );
}