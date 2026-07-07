"use client";

import { useEffect, useState } from "react";
import DepartmentCard from "./DepartmentCard";
import { motion } from "framer-motion";
import FeaturedDepartmentsSkeleton from "./FeaturedDepartmentsSkeleton";

interface Department {
  _id: string;
  name: string;
  departmentCode: string;
  totalSearches?: number;
  totalSubjects?: number;
  hod?: string;
  yearsOfDegree?: number;
}

export default function FeaturedDepartments() {
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
        console.error("Failed to load featured departments", err);
        setError("Could not load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Filter & sort by totalSearches descending, and get the top 5
  const topDepartments = [...departments]
    .sort((a, b) => (b.totalSearches || 0) - (a.totalSearches || 0))
    .slice(0, 5);

  if (loading) {
    return (
      < >
        <FeaturedDepartmentsSkeleton/>
      </>
    );
  }

  if (error || topDepartments.length === 0) {
    return null; // Don't show anything or a silent fallback
  }

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header section with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-gray-900 dark:text-white">
            Top Departments
          </h2>
        </motion.div>

        {/* Cards Row/Grid with animations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex flex-wrap justify-center gap-8"
        >
          {topDepartments.map((dept) => (
            <motion.div
              key={dept._id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 15 },
                },
              }}
            >
              <DepartmentCard
                name={dept.name}
                departmentCode={dept.departmentCode}
                totalSearches={dept.totalSearches}
                yearsOfDegree={dept.yearsOfDegree}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}