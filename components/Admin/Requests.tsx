import { Building2, BookOpen, Pencil, GraduationCap, EllipsisVertical } from "lucide-react";

interface RequestsI {
    type: "subject" | "department";
    email: string;
    department: string;
    year: number;
    subject?: string;
}

function Requests({
    type,
    email,
    department,
    year,
    subject,
}: RequestsI) {
    const isDepartment = type === "department";
    const Icon = isDepartment ? Building2 : BookOpen;

    return (
        <article className="group w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-125 group-hover:shadow-sm ${isDepartment
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                        }`}
                >
                    <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {isDepartment ? "Department Request" : "Subject Request"}
                    </h3>
                    {/* group-hover removes truncation and wraps text */}
                    <p className="truncate text-xs text-zinc-500 transition-all duration-500 group-hover:whitespace-normal group-hover:break-all dark:text-zinc-400">
                        {email}
                    </p>
                </div>

                <button
                    type="button"
                    aria-label="Edit request"
                    className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                    <EllipsisVertical size={15} />
                </button>
            </div>

            <div className="mt-3 flex items-start justify-between gap-2 border-t border-zinc-100 pt-2.5 dark:border-zinc-800">
                <span className="min-w-0 truncate text-xs font-medium text-zinc-700 transition-all duration-500 group-hover:whitespace-normal group-hover:break-words dark:text-zinc-300">
                    {department}
                </span>

                <span className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    <GraduationCap size={13} />
                    Year {year}
                </span>
            </div>

            {type === "subject" && subject && (
                <p className="mt-2 truncate pr-4 text-xs text-zinc-500 transition-all duration-500 group-hover:whitespace-normal group-hover:break-words dark:text-zinc-400">
                    Subject:{" "}
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {subject}
                    </span>
                </p>
            )}
        </article>
    );
}

export default Requests;