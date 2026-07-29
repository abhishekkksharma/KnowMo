"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

interface RequestFormProps {
    type: "Department" | "Subject";
}

export default function RequestForm({ type }: RequestFormProps) {
    const [email, setEmail] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [degreeYears, setDegreeYears] = useState(4);

    const [departmentCode, setDepartmentCode] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [year, setYear] = useState(1);

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [statusMessage, setStatusMessage] = useState("");

    const showExtraFields = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        if (!status) return;

        const timer = setTimeout(() => {
            setStatus(null);
            setStatusMessage("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [status, statusMessage]);

    const handleSubmit = async () => {
        if (!showExtraFields) return;

        setLoading(true);
        setStatus(null);
        setStatusMessage("");

        try {
            const endpoint =
                type === "Department"
                    ? "/api/requests/department"
                    : "/api/requests/subject";

            const body =
                type === "Department"
                    ? {
                          email,
                          departmentName,
                          degreeYears,
                      }
                    : {
                          email,
                          departmentCode,
                          subjectName,
                          year,
                      };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setStatus("success");
            setStatusMessage(
                `${type} request submitted successfully! We'll review it shortly.`
            );

            setEmail("");
            setDepartmentName("");
            setDegreeYears(4);
            setDepartmentCode("");
            setSubjectName("");
            setYear(1);
        } catch (err: any) {
            console.error(err);

            setStatus("error");
            setStatusMessage(
                err.message || "Failed to submit request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4">
            <div className="flex w-full max-w-lg flex-col gap-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>

                <AnimatePresence>
                    {showExtraFields && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col gap-3"
                        >
                            {type === "Department" ? (
                                <>
                                    <motion.input
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        placeholder="Department Name"
                                        value={departmentName}
                                        onChange={(e) =>
                                            setDepartmentName(e.target.value)
                                        }
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                                    />

                                    <motion.select
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        value={degreeYears}
                                        onChange={(e) =>
                                            setDegreeYears(Number(e.target.value))
                                        }
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                                    >
                                        {[2, 3, 4, 5].map((years) => (
                                            <option key={years} value={years}>
                                                {years} Year Degree
                                            </option>
                                        ))}
                                    </motion.select>
                                </>
                            ) : (
                                <>
                                    <motion.input
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        placeholder="Department Code (e.g. CSE)"
                                        value={departmentCode}
                                        onChange={(e) =>
                                            setDepartmentCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                                    />

                                    <motion.input
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        placeholder="Subject Name"
                                        value={subjectName}
                                        onChange={(e) =>
                                            setSubjectName(e.target.value)
                                        }
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                                    />

                                    <motion.select
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        value={year}
                                        onChange={(e) =>
                                            setYear(Number(e.target.value))
                                        }
                                        className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-black"
                                    >
                                        {[1, 2, 3, 4, 5].map((y) => (
                                            <option key={y} value={y}>
                                                Year {y}
                                            </option>
                                        ))}
                                    </motion.select>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {status && (
                        <motion.div
                            key={statusMessage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className={`rounded-md px-4 py-3 text-sm font-medium ${
                                status === "success"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                        >
                            {statusMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}