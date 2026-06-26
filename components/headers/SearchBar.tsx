"use client";

import { useEffect, useState } from "react";
import { Search, X, Clock3, ArrowRight } from "lucide-react";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const recentSearches = [
    "Problem Solving",
    "Spring Boot",
    "DBMS",
    "Operating Systems",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="
          hidden md:flex
          items-center
          justify-between
          w-80
          h-14
          px-5
          rounded-3xl
          border-2
          border-zinc-200
          dark:border-zinc-800
          bg-white/90
          dark:bg-zinc-950/90
          backdrop-blur-sm
          hover:border-emerald-300
          dark:hover:border-emerald-700
          transition-all
          duration-200
        "
      >
        <div className="flex items-center gap-3">
          <Search
            size={24}
            className="text-zinc-500"
          />

          <span className="text-xl font-semibold text-zinc-500">
            Search
          </span>
        </div>

        <kbd
          className="
            rounded-xl
            bg-zinc-100
            dark:bg-zinc-900
            px-3
            py-1.5
            text-sm
            font-semibold
            text-zinc-500
          "
        >
          Ctrl K
        </kbd>
      </button>

      {/* Overlay */}
      {open && (
        <>
          <div
            className="
              fixed inset-0
              bg-black/40
              backdrop-blur-sm
              z-[100]
            "
            onClick={() => setOpen(false)}
          />

          {/* Search Modal */}
          <div
            className="
              fixed
              top-[15vh]
              left-1/2
              -translate-x-1/2
              w-[92%]
              max-w-2xl
              z-[110]
            "
          >
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-zinc-200
                dark:border-zinc-800
                bg-white
                dark:bg-zinc-950
                shadow-2xl
              "
            >
              {/* Search Input */}
              <div className="flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800 px-5">
                <Search
                  size={20}
                  className="text-zinc-500"
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search notes, departments, resources..."
                  className="
                    flex-1
                    bg-transparent
                    px-4
                    text-lg
                    outline-none
                  "
                />

                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-zinc-500 text-sm"
                >
                  <X size={16} />
                  Esc
                </button>
              </div>

              {/* Hint */}
              <div
                className="
                  px-5
                  py-3
                  text-sm
                  text-zinc-500
                  border-b
                  border-zinc-200
                  dark:border-zinc-800
                "
              >
                Press{" "}
                <kbd className="rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1">
                  Enter
                </kbd>{" "}
                to search
              </div>

              {/* Recent Searches */}
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <Clock3 size={15} />
                    RECENT
                  </div>

                  <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    Clear
                  </button>
                </div>

                <div className="space-y-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        px-3
                        py-3
                        transition
                        hover:bg-zinc-100
                        dark:hover:bg-zinc-900
                      "
                    >
                      <div className="flex items-center gap-3">
                        <Search
                          size={16}
                          className="text-zinc-500"
                        />
                        <span>{item}</span>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-zinc-500"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}