import React, { Suspense } from "react";
import DepartmentDetails from "../../../../../components/Admin/AdminDepartments/DepartmentDetails";
import { Loader2 } from "lucide-react";

export default function DepartmentViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500 font-mono">Loading...</p>
        </div>
      }
    >
      <DepartmentDetails />
    </Suspense>
  );
}

