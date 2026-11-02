"use client";

import React, { useEffect, useState, useCallback } from "react";
import Requests, { RequestsI } from "./Requests";
import { API_BASE_URL } from "@/lib/apiConfig";
import { Loader2, RefreshCw, Inbox, AlertCircle } from "lucide-react";

interface ApiRequestItem {
  _id: string;
  type: "Department" | "Subject";
  email: string;
  departmentName?: string;
  degreeYears?: number;
  departmentCode?: string;
  subjectName?: string;
  year?: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

function MappedRequests() {
  const [requests, setRequests] = useState<ApiRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Department" | "Subject">("All");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/requests`);
      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRequests(json.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filtered = requests.filter((r) => {
    if (filterType === "All") return true;
    return r.type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            User Requests
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Requests submitted by users for new subjects and departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
            {(["All", "Department", "Subject"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filterType === t
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchRequests}
            title="Refresh requests"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <Inbox size={36} className="text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No requests found
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {filterType !== "All"
              ? `There are currently no ${filterType.toLowerCase()} requests.`
              : "User requests for departments or subjects will appear here."}
          </p>
        </div>
      )}

      {/* Grid of requests */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <Requests
              key={item._id}
              _id={item._id}
              type={item.type}
              email={item.email}
              department={item.departmentName || item.departmentCode || "N/A"}
              year={item.degreeYears || item.year || 1}
              subject={item.subjectName}
              status={item.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MappedRequests;
