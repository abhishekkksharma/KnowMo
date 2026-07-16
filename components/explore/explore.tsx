"use client";

import Updates from "./updates";
import PopularDepartments from "./herosection/PopularDepartments";

function Explore() {
  return (
    <div className="min-h-screen pt-38 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left Column: Placeholder main area */}
        <div className="lg:col-span-8">
          <p className="mb-3 font-mono text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Explore.
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white md:text-5xl">
            Explore Hub
          </h1>
          <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Select departments and browse shared files. Main directory features are under development.
          </p>
          <PopularDepartments/>
        </div>

        {/* Right Column: Latest Updates Container (Col-span 4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white/10 dark:bg-zinc-950/10 backdrop-blur-md rounded-3xl border border-white/30 dark:border-zinc-800/40 p-6 shadow-sm">
            <Updates />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Explore;
