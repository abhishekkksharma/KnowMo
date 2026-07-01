"use client";

import { useEffect, useState } from "react";
import DepartmentCard from "./departmentCard";
import { Search } from "lucide-react";

interface Department {
  _id: string;
  name: string;
  description: string;
  totalSubjects?: number;
  departmentCode: string;
}

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

function DepartmentMain() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/department`);
        if (!response.ok) {
          throw new Error("Failed to fetch departments");
        }
        const data = await response.json();
        setDepartments(data.data || data);
      } catch (err) {
        console.error(err);
        setError("Unable to load departments");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.departmentCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-mono text-sm">
        <p className="text-zinc-500 dark:text-zinc-400">
          Loading departments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-mono text-sm">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-6xl px-6 py-16 md:mt-20">
      {/* Header section matching the "About KnowMo." aesthetic */}
      <div className="mb-12 max-w-4xl">
        <p className="mb-3 font-mono text-sm font-semibold text-zinc-400">
          Departments.
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-4xl lg:leading-[1.1]">
          <span className="bg-pink-50 dark:bg-pink-700 px-1">
            Explore your branch
          </span>
          , discover subjects, and find shared study materials
        </h1>

        {/* Monospaced body text to match the image's paragraph style */}
        <p className="mt-8 max-w-2xl font-mono text-sm leading-loose text-zinc-600 dark:text-zinc-400">
          Access department-wise subjects, notes, previous year papers, and
          study materials. KnowMo brings students together through shared
          knowledge and collaboration.
        </p>
      </div>

      {/* Filter and Count Section - Styled like the navbar search pill */}
      <div className="mb-10 flex flex-col items-start gap-4">
        <div className="relative w-full max-w-md group">
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
            placeholder="Search departments or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        <p className="font-mono text-xs font-medium text-zinc-400">
          Showing {filteredDepartments.length}{" "}
          {filteredDepartments.length === 1 ? "department" : "departments"}
          {searchQuery && ` of ${departments.length} total`}
        </p>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department._id}
              name={department.name}
              description={department.description}
              departmentCode={department.departmentCode}
              totalSubjects={department.totalSubjects || 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-start py-20 font-mono text-sm">
          <p className="text-zinc-500 dark:text-zinc-400">
            {departments.length > 0
              ? `No departments found matching "${searchQuery}".`
              : "No departments available."}
          </p>
        </div>
      )}
    </section>
  );
}

export default DepartmentMain;
