"use client";

import { useEffect, useState } from "react";
import PopularDepartmentCard from "./PopularDepartmentCard";

interface Department {
  _id: string;
  name: string;
  departmentCode: string;
  totalSearches?: number;
}

function PopularDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/department`);
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await response.json();
        const deptList = data.data || data || [];
        setDepartments(deptList);
      } catch (err) {
        console.error("Failed to load popular departments", err);
        setError("Could not load popular departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Filter & sort by totalSearches descending, and get the top 3
  const topDepartments = [...departments]
    .sort((a, b) => (b.totalSearches || 0) - (a.totalSearches || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-5 sm:p-6 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl bg-white/45 dark:bg-zinc-900/25 backdrop-blur-md animate-pulse h-48"
          >
            <div className="h-10 w-12 bg-black/10 dark:bg-white/10 rounded-md" />
            <div className="h-6 w-3/4 bg-black/10 dark:bg-white/10 rounded-md" />
            <div className="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded-md mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (error || topDepartments.length === 0) {
    return null; // Fallback silently
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
      {topDepartments.map((dept, index) => (
        <PopularDepartmentCard
          key={dept._id}
          rankNumber={index + 1}
          departmentName={dept.name}
          totalSearchCount={dept.totalSearches || 0}
        />
      ))}
    </div>
  );
}

export default PopularDepartments;