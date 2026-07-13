"use client";

import { useEffect, useState } from "react";
import UpdatesCard from "./updatesCard";
import { AlertCircle, RefreshCw } from "lucide-react";

interface UpdateItem {
    _id: string;
    title: string;
    description: string;
    date: string;
}

function Updates() {
    const [updates, setUpdates] = useState<UpdateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUpdates = async () => {
        setLoading(true);
        setError("");
        try {
            const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/api/updates/latest`);

            if (!response.ok) {
                throw new Error("Failed to fetch updates");
            }

            const data = await response.json();
            if (data.success && Array.isArray(data.updates)) {
                setUpdates(data.updates);
            } else if (Array.isArray(data)) {
                setUpdates(data);
            } else {
                setUpdates([]);
            }
        } catch (err) {
            console.error("Failed to load updates:", err);
            setError("Could not retrieve latest updates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpdates();
    }, []);

    return (
        <div className="w-full flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                    Latest Updates
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                </h2>
                <button
                    onClick={fetchUpdates}
                    disabled={loading}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    title="Refresh updates"
                >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="w-full rounded-2xl border border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/10 p-5 space-y-3 animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                                </div>
                            </div>
                            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-sm">
                    <AlertCircle className="text-red-500 mb-3" size={28} />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{error}</h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                        Please check your connection and try again.
                    </p>
                    <button
                        onClick={fetchUpdates}
                        className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:opacity-90 transition-opacity"
                    >
                        Retry
                    </button>
                </div>
            ) : updates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/20 dark:bg-zinc-900/10 backdrop-blur-sm">
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No new updates available</p>
                    <p className="text-xs text-zinc-400 mt-1">Check back later for notifications.</p>
                </div>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {updates.map((item) => (
                        <UpdatesCard
                            key={item._id}
                            update={item.title}
                            message={item.description}
                            createdAt={item.date}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Updates;
