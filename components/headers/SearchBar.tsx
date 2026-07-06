"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock3, ArrowRight } from "lucide-react";

interface SearchBarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

interface SearchResultDepartment {
  _id: string;
  name: string;
  departmentCode: string;
}

interface SearchResultSubject {
  _id: string;
  name: string;
  departmentCode: string;
  year: number;
  semester?: number;
  subjectCode: string;
}

interface SearchResults {
  departments: SearchResultDepartment[];
  subjects: SearchResultSubject[];
}

const STORAGE_KEY = "recentSearches";

export default function SearchBar({
  open: controlledOpen,
  setOpen: controlledSetOpen,
}: SearchBarProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const open =
    controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen =
    controlledSetOpen !== undefined
      ? controlledSetOpen
      : setInternalOpen;

  // Load searches
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Keyboard shortcuts
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
  }, [setOpen]);

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results based on debounced query
  useEffect(() => {
    const fetchResults = async () => {
      const trimmed = debouncedQuery.trim();
      if (!trimmed) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";
        const response = await fetch(
          `${baseUrl}/api/search?q=${encodeURIComponent(trimmed)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setResults(data.results);
          } else {
            setResults(null);
          }
        } else {
          setResults(null);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const saveSearch = (searchTerm: string) => {
    const term = searchTerm.trim();

    if (!term) return;

    const updated = [
      term,
      ...recentSearches.filter(
        (item) =>
          item.toLowerCase() !== term.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    saveSearch(term);
  };

  const handleItemClick = (type: "department" | "subject", code: string) => {
    saveSearch(query);
    setOpen(false);
    setQuery("");
    if (type === "department") {
      router.push(`/departments/${code}`);
    } else {
      router.push(`/subject?subjectCode=${code}`);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    saveSearch(query);

    if (results) {
      if (results.departments.length > 0) {
        handleItemClick("department", results.departments[0].departmentCode);
        return;
      } else if (results.subjects.length > 0) {
        handleItemClick("subject", results.subjects[0].subjectCode);
        return;
      }
    }

    setOpen(false);
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="
          hidden md:flex
          items-center
          justify-between
          w-60
          h-10
          px-4
          rounded-full
          border
          border-zinc-200
          dark:border-zinc-800
          bg-white/90
          dark:bg-zinc-950/90
          backdrop-blur-sm
          hover:border-zinc-500
          dark:hover:border-zinc-700
          transition-all
          duration-200
        "
      >
        <div className="flex items-center gap-2.5">
          <Search
            size={18}
            className="text-zinc-500"
          />

          <span className="text-sm font-medium text-zinc-500">
            Search...
          </span>
        </div>

        <kbd
          className="
            rounded-md
            bg-zinc-100
            dark:bg-zinc-900
            px-1.5
            py-0.5
            text-[10px]
            font-semibold
            text-zinc-400
            border
            border-zinc-200/50
            dark:border-zinc-800/50
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
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

              {/* Conditional Display: Results or Recent Searches */}
              {query.trim() ? (
                <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                  {loading && (
                    <div className="space-y-4 py-2">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      </div>
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-14 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    </div>
                  )}

                  {!loading && results && (
                    <>
                      {/* Departments */}
                      {results.departments.length > 0 && (
                        <div>
                          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Departments ({results.departments.length})
                          </div>
                          <div className="space-y-1">
                            {results.departments.map((dept) => (
                              <button
                                key={dept._id}
                                onClick={() => handleItemClick("department", dept.departmentCode)}
                                className="
                                  group
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-xl
                                  px-3
                                  py-3
                                  text-left
                                  transition-all
                                  duration-200
                                  hover:bg-zinc-50
                                  dark:hover:bg-zinc-900
                                  border border-transparent
                                  hover:border-zinc-100
                                  dark:hover:border-zinc-800/50
                                "
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform duration-200">
                                    <span className="text-xs font-bold font-mono">{dept.departmentCode}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                      {dept.name}
                                    </div>
                                    <div className="text-xs text-zinc-400 dark:text-zinc-500">
                                      Code: {dept.departmentCode}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight
                                  size={16}
                                  className="text-zinc-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Subjects */}
                      {results.subjects.length > 0 && (
                        <div>
                          <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Subjects ({results.subjects.length})
                          </div>
                          <div className="space-y-1">
                            {results.subjects.map((sub) => (
                              <button
                                key={sub._id}
                                onClick={() => handleItemClick("subject", sub.subjectCode)}
                                className="
                                  group
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-xl
                                  px-3
                                  py-3
                                  text-left
                                  transition-all
                                  duration-200
                                  hover:bg-zinc-50
                                  dark:hover:bg-zinc-900
                                  border border-transparent
                                  hover:border-zinc-100
                                  dark:hover:border-zinc-800/50
                                "
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 group-hover:scale-105 transition-transform duration-200">
                                    <span className="text-xs font-bold font-mono">{sub.departmentCode}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                      {sub.name}
                                    </div>
                                    <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                                      <span>{sub.subjectCode}</span>
                                      <span>•</span>
                                      <span>Year {sub.year}</span>
                                      {sub.semester && (
                                        <>
                                          <span>•</span>
                                          <span>Sem {sub.semester}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight
                                  size={16}
                                  className="text-zinc-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {results.departments.length === 0 && results.subjects.length === 0 && (
                        <div className="py-12 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 mb-3">
                            <Search size={20} />
                          </div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No results found</div>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto">
                            We couldn't find any departments or subjects matching "{debouncedQuery}"
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* Recent Searches */
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                      <Clock3 size={15} />
                      RECENT
                    </div>

                    {recentSearches.length > 0 && (
                      <button
                        onClick={clearRecentSearches}
                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {recentSearches.length > 0 ? (
                      recentSearches.map(
                        (item, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(item)}
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
                        )
                      )
                    ) : (
                      <div className="py-8 text-center text-sm text-zinc-500">
                        No recent searches
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}