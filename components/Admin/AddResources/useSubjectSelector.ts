"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api";

export interface Department {
  _id: string;
  name: string;
  departmentCode: string;
  yearsOfDegree: number;
}

export interface Subject {
  _id: string;
  name: string;
  subjectCode: string;
}

export function useSubjectSelector() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");

  // Fetch departments once
  useEffect(() => {
    fetch(`${API_BASE}/department`)
      .then((r) => r.json())
      .then((d) => setDepartments(Array.isArray(d) ? d : []))
      .catch(() => setDepartments([]))
      .finally(() => setLoadingDepts(false));
  }, []);

  // Fetch subjects whenever department changes
  useEffect(() => {
    if (!selectedDept?.departmentCode) {
      setSubjects([]);
      return;
    }
    setLoadingSubjects(true);
    setSelectedSubjectCode("");
    fetch(`${API_BASE}/subject/${selectedDept.departmentCode}`)
      .then((r) => r.json())
      .then((d) => setSubjects(Array.isArray(d.subjects) ? d.subjects : []))
      .catch(() => setSubjects([]))
      .finally(() => setLoadingSubjects(false));
  }, [selectedDept]);

  const handleDeptChange = (deptId: string) => {
    const dept = departments.find((d) => d._id === deptId) ?? null;
    setSelectedDeptId(deptId);
    setSelectedDept(dept);
    setSelectedSubjectCode("");
  };

  return {
    departments,
    subjects,
    loadingDepts,
    loadingSubjects,
    selectedDeptId,
    selectedDept,
    selectedSubjectCode,
    setSelectedSubjectCode,
    handleDeptChange,
  };
}

