import { Building2, BookOpen, GraduationCap, EllipsisVertical } from "lucide-react";

export interface RequestsI {
    _id?: string;
    type: "subject" | "department" | "Subject" | "Department";
    email: string;
    department: string;
    year: number;
    subject?: string;
    status?: string;
}

function Requests({
    type,
    email,
    department,
    year,
    subject,
    status = "Pending",
}: RequestsI) {
    const isDepartment = type.toLowerCase() === "department";
    const Icon = isDepartment ? Building2 : BookOpen;

    const statusColors = {
        Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        Approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        Rejected: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    };

    const statusStyle = statusColors[status as keyof typeof statusColors] || statusColors.Pending;

    return (
        <article className="group w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                        isDepartment
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                    }`}
                >
                    <Icon size={20} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {isDepartment ? "Department Request" : "Subject Request"}
                        </h3>
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyle}`}>
                            {status}
                        </span>
                    </div>
                    <p className="truncate text-xs text-zinc-500 transition-all duration-300 group-hover:whitespace-normal group-hover:break-all dark:text-zinc-400 mt-0.5">
                        {email}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex items-start justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <span className="min-w-0 truncate text-xs font-medium text-zinc-700 transition-all duration-300 group-hover:whitespace-normal group-hover:break-words dark:text-zinc-300">
                    {department}
                </span>

                <span className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    <GraduationCap size={13} />
                    Year {year}
                </span>
            </div>

            {!isDepartment && subject && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
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
