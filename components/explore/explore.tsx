"use client"

import UpdatesCard from "./updatesCard";

const updates = [
  {
    update: "DBMS Notes Uploaded",
    message: "Unit 1 and Unit 2 notes are available.",
    updatingUser: "Aman Sharma",
    createdAt: "2026-06-28T10:30:00Z",
  },
  {
    update: "OS Assignment Added",
    message: "Assignment 3 has been uploaded.",
    updatingUser: "Faculty",
    createdAt: "2026-06-27T15:00:00Z",
  },
];

function Explore() {
  return (
    <div className="justify-center flex items-center flex-col h-screen">
      <p className="text-xl font-semibold mb-4">Updates</p>

      <div className="space-y-4 w-100">
        {updates.map((item, index) => (
          <UpdatesCard
            key={index}
            update={item.update}
            message={item.message}
            updatingUser={item.updatingUser}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
}

export default Explore;