"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownProps {
  open: boolean;
  items: {
    label: string;
    href: string;
  }[];
}

export default function Dropdown({ open, items }: DropdownProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`
            absolute
            top-[calc(100%+8px)]
            left-1/2
            -translate-x-1/2
            w-44
            rounded-xl
            
            /* Adjusted Glass Opacity so it doesn't disappear */
            bg-white/90
            dark:bg-zinc-900/90
            backdrop-blur-xl
            
            /* Defined borders to give the glass edge definition */
            border border-zinc-200/50 dark:border-zinc-800/50
            p-1.5
            z-50
          `}
        >
          {/* Invisible bridge to prevent mouseleave on hover transit */}
          <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent" />

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                block
                px-3
                py-2
                rounded-lg
                
                /* Comfortable, readable text sizing */
                text-sm
                font-medium
                
                text-zinc-600
                dark:text-zinc-300
                
                /* Clean glass-friendly hover selection */
                hover:bg-black/5
                dark:hover:bg-white/10
                hover:text-zinc-900
                dark:hover:text-zinc-50
                
                transition-colors
                duration-150
              "
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}