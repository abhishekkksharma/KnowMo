import React, { Suspense } from "react";
import DepartmentEdit from "../../../../../components/Admin/AdminDepartments/DepartmentEdit";
import { Loader2 } from "lucide-react";

export default function DepartmentEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500 font-mono">Loading...</p>
        </div>
      }
    >
      <DepartmentEdit />
    </Suspense>
  );
}

