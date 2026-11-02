import React, { Suspense } from "react";
import SubjectEdit from "../../../../../components/Admin/AdminSubjects/SubjectEdit";
import { Loader2 } from "lucide-react";

export default function SubjectEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500 font-mono">Loading...</p>
        </div>
      }
    >
      <SubjectEdit />
    </Suspense>
  );
}

