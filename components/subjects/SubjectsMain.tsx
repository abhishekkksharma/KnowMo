"use client";

import { useEffect, useState } from "react";
import SubjectCard from "./subjectCard";
import { Search, LayoutGrid, LayoutList } from "lucide-react";

interface Subject {
    _id: string;
    name: string;
    year: number;
    semester?: number;
    subjectCode: string;
    departmentCode: string;
}

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

export default function SubjectMain({
    departmentCode,
}: {
    departmentCode: string;
}) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"card" | "tile">("card");

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(
                    `${baseUrl}/api/subject/${departmentCode}`
                );

                const data = await response.json();

                setSubjects(data.subjects || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [departmentCode]);

    const sortedSubjects = [...subjects].sort((a, b) => {
        if (a.year !== b.year) {
            return a.year - b.year;
        }

        const semA = a.semester ?? 0;
        const semB = b.semester ?? 0;

        if (semA !== semB) {
            return semA - semB;
        }

        return a.name.localeCompare(b.name);
    });

    const filteredSubjects = sortedSubjects.filter(
        (subject) =>
            subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.subjectCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedSubjects = filteredSubjects.reduce((acc, subject) => {
        const year = subject.year;

        if (!acc[year]) {
            acc[year] = [];
        }

        acc[year].push(subject);

        return acc;
    }, {} as Record<number, Subject[]>);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                Loading subjects...
            </div>
        );
    }

    return (
        <section className="mx-auto mt-10 max-w-6xl px-6 py-16">
            {/* Header */}
            <div className="mb-12">
                <p className="mb-3 font-mono text-sm text-zinc-400">
                    {departmentCode} Subjects
                </p>

                <h1 className="text-4xl font-bold dark:text-white">
                    <span className="bg-pink-50 dark:bg-pink-700">Explore Subjects</span>
                </h1>

                <p className="mt-4 max-w-2xl font-mono text-sm text-zinc-500">
                    Browse all subjects available for the {departmentCode} department.
                </p>
            </div>

            {/* Search */}
            <div className="group relative mb-8 w-full max-w-md">
                <Search
                    size={18}
                    className="
                        absolute left-4 top-1/2 -translate-y-1/2
                        text-zinc-400 transition-colors
                        group-hover:text-zinc-600
                        dark:group-hover:text-zinc-300
                    "
                />

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search subjects..."
                    className="
                        h-11 w-full
                        rounded-xl
                        border border-zinc-200
                        bg-white
                        pl-11 pr-4
                        text-sm text-zinc-900
                        shadow-sm
                        outline-none
                        transition-all duration-200

                        placeholder:text-zinc-400

                        hover:border-zinc-300
                        hover:bg-zinc-50
                        hover:shadow-md

                        focus:border-zinc-300
                        focus:bg-white
                        focus:ring-2 focus:ring-zinc-100

                        dark:border-zinc-800
                        dark:bg-zinc-900
                        dark:text-white

                        dark:hover:border-zinc-700
                        dark:hover:bg-zinc-800/80

                        dark:focus:border-zinc-700
                        dark:focus:ring-zinc-800
                    "
                />
            </div>

            {/* Counter + View Toggle */}
            <div className="mb-8 flex items-center justify-between">
                <p className="font-mono text-xs font-medium text-zinc-400">
                    Showing {filteredSubjects.length}{" "}
                    {filteredSubjects.length === 1 ? "subject" : "subjects"}
                    {searchQuery.trim() &&
                        ` of ${subjects.length} total`}
                </p>

                <div className="flex items-center gap-1 rounded-xl border border-zinc-200/50 bg-zinc-100 p-1 dark:border-zinc-700/50 dark:bg-zinc-800/80">
                    <button
                        onClick={() => setViewMode("card")}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${viewMode === "card"
                                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                        title="Card view"
                    >
                        <LayoutGrid size={16} />
                    </button>

                    <button
                        onClick={() => setViewMode("tile")}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ${viewMode === "tile"
                                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            }`}
                        title="Tile view"
                    >
                        <LayoutList size={16} />
                    </button>
                </div>
            </div>

            {/* Subjects Grouped by Year */}
            <div className="space-y-16">
                {Object.entries(groupedSubjects).map(
                    ([year, yearSubjects]) => (
                        <div key={year}>
                            {/* Year Section Header */}
                            <div className="mb-8 flex items-center gap-4">
                                <div className="shrink-0">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                        Year {year}
                                    </h2>

                                    <p className="mt-1 font-mono text-xs text-zinc-500">
                                        {yearSubjects.length}{" "}
                                        {yearSubjects.length === 1
                                            ? "subject"
                                            : "subjects"}
                                    </p>
                                </div>

                                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            </div>

                            {/* Subjects Grid */}
                            <div
                                className={
                                    viewMode === "card"
                                        ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                                        : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                                }
                            >
                                {yearSubjects.map((subject) => (
                                    <SubjectCard
                                        key={subject._id}
                                        name={subject.name}
                                        year={subject.year}
                                        semester={subject.semester}
                                        departmentCode={
                                            subject.departmentCode
                                        }
                                        subjectCode={subject.subjectCode}
                                        viewType={viewMode}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
}

