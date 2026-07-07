"use client";

import React from "react";

export default function FeaturedDepartmentsSkeleton() {
  // Array of 5 to match the .slice(0, 5) from the original component
  const skeletonCards = Array.from({ length: 4 });

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-16 flex justify-center">
          <div className="h-10 w-64 bg-black/10 dark:bg-white/10 rounded-md animate-pulse"></div>
        </div>

        {/* Cards Row/Grid Skeleton */}
        <div className="flex flex-wrap justify-center gap-8">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="w-60 h-56 rounded-2xl p-5 relative flex flex-col justify-between
                         bg-black/5 dark:bg-white/5 animate-pulse
                         border border-black/10 dark:border-white/10"
            >
              {/* Binder ring holes skeleton */}
              <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/10"
                  />
                ))}
              </div>

              {/* Content shift right */}
              <div className="pl-4 flex-1 flex flex-col h-full relative z-10">
                {/* Header (Department Code) */}
                <div className="h-3 w-12 bg-black/10 dark:bg-white/10 rounded-sm mb-4" />

                {/* Department Name Area */}
                <div className="border-b border-black/5 dark:border-white/5 pb-2 mb-2 flex-1 flex flex-col justify-end gap-2">
                  <div className="h-6 w-3/4 bg-black/10 dark:bg-white/10 rounded-sm" />
                  <div className="h-6 w-2/4 bg-black/10 dark:bg-white/10 rounded-sm" />
                </div>

                {/* Details Area */}
                <div className="flex flex-col mt-auto gap-3 pt-2">
                  <div className="h-4 w-3/4 bg-black/10 dark:bg-white/10 rounded-sm" />
                  <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 rounded-sm" />
                  <div className="h-3 w-8 bg-black/10 dark:bg-white/10 rounded-sm mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}