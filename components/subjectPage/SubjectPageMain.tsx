"use client";

import { useState } from "react";
import Link from "next/link";
import {createMetadata} from "../../lib/metadata"
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  FileText, 
  Award, 
  FlaskConical, 
  ClipboardList,
  Sparkles,
  Inbox,
  Calendar,
  Layers,
  Trophy
} from "lucide-react";
import Card from "./ResourceCard";

// Map types to Lucide Icons
const iconMap = {
  notes: BookOpen,
  pyq: Award,
  assignment: ClipboardList,
  lab: FlaskConical,
  other: FileText,
};

interface Resource {
  _id: string;
  title: string;
  type: "notes" | "pyq" | "assignment" | "lab" | "other";
  description?: string;
  fileUrl: string;
  departmentCode: string;
  subjectCode: string;
  year: number;
}

interface Subject {
  _id: string;
  name: string;
  subjectCode: string;
  departmentCode: string;
  year: number;
  semester?: number;
}

interface SubjectPageMainProps {
  resources: Resource[];
  subject: Subject | null;
  departmentName: string;
  error?: string | null;
}

export default function SubjectPageMain({
  resources,
  subject,
  departmentName,
  error
}: SubjectPageMainProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  if (error || !subject) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-100 dark:border-red-900/50 mb-6">
          <Inbox size={28} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
          Unable to Load Subject
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
          {error || "We couldn't find the subject code you requested. Please check the URL or try again later."}
        </p>
        <Link
          href="/departments"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          <ArrowLeft size={16} />
          Back to Departments
        </Link>
      </div>
    );
  }

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description &&
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === "all" || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

  const counts = {
    all: resources.length,
    notes: resources.filter((r) => r.type === "notes").length,
    pyq: resources.filter((r) => r.type === "pyq").length,
    assignment: resources.filter((r) => r.type === "assignment").length,
    lab: resources.filter((r) => r.type === "lab").length,
    other: resources.filter(
  (r) =>
    r.type !== "notes" &&
    r.type !== "pyq" &&
    r.type !== "assignment" &&
    r.type !== "lab"
).length,
  };

  const tabs = [
    { id: "all", label: "All Resources", count: counts.all },
    { id: "notes", label: "Notes", count: counts.notes },
    { id: "pyq", label: "PYQs", count: counts.pyq },
    { id: "assignment", label: "Assignments", count: counts.assignment },
    { id: "lab", label: "Labs", count: counts.lab },
    { id: "other", label: "Others", count: counts.other },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 md:py-20 min-h-[70vh]">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href={`/departments/${subject.departmentCode.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to {subject.departmentCode.toUpperCase()} Subjects
        </Link>
      </div>

      {/* Hero Header Section */}
      <div className="relative mb-12 overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-zinc-50 via-white to-zinc-50/50 p-8 shadow-sm dark:border-zinc-800 dark:bg-gradient-to-r dark:from-zinc-900 dark:via-black dark:to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.02),transparent_40%)] dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_30%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            {/* Department Tag */}
            <p className="mb-2 font-mono text-xs font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
              {departmentName}
            </p>
            {/* Subject Name */}
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {subject.name}
            </h1>
            
            {/* Info Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50/50 px-3 py-1 font-mono text-xs font-semibold text-pink-600 dark:border-pink-900/30 dark:bg-pink-950/20 dark:text-pink-400">
                <Sparkles size={12} />
                {subject.subjectCode}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                <Calendar size={12} />
                Year {subject.year}
              </span>
              {subject.semester && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
                  <Layers size={12} />
                  Semester {subject.semester}
                </span>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="group relative w-full md:w-80 shrink-0">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="h-11 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50/50 focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:border-zinc-700 dark:focus:border-zinc-700 dark:focus:ring-zinc-800/40"
            />
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex overflow-x-auto pb-px scrollbar-none gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`relative pb-3 text-sm font-semibold whitespace-nowrap transition-all px-2 ${
                selectedType === tab.id
                  ? "text-zinc-950 dark:text-white border-b-2 border-zinc-900 dark:border-white"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span className={`inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  selectedType === tab.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Test CTA */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-sm">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Practice Test</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Challenge yourself with auto-generated MCQs</p>
          </div>
        </div>
        <Link
          href={`/subject/test/${subject.subjectCode}`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 w-full sm:w-auto"
        >
          Take Test
        </Link>
      </div>

      {/* Content Section */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card
              key={resource._id}
              title={resource.title}
              description={resource.description || `Study materials for ${subject.name}`}
              href={resource.fileUrl}
              icon={iconMap[resource.type] || FileText}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 bg-zinc-50/20 dark:bg-zinc-900/5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
            <Inbox size={24} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
            No resources found
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            {searchQuery.trim()
              ? "We couldn't find any resources matching your search. Try adjustment."
              : "No resources have been uploaded for this category yet."}
          </p>
        </div>
      )}
    </main>
  );
}
