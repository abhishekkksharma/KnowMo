import React from "react";

interface HighlightTextProps {
  text: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
}

const sizeMap = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-6xl",
  xl: "text-7xl",
  "2xl": "text-8xl",
  "3xl": "text-9xl",
  "4xl": "[font-size:10rem]",
};

export default function HighlightText({
  text,
  size = "lg",
  className = "",
}: HighlightTextProps) {
  const words = text.split(" ");

  return (
    <div
      className={`relative inline-block font-serif leading-none ${sizeMap[size]} ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* top rectangle */}
        <rect
          x="18"
          y="10"
          width="55"
          height="35"
          fill="#dceefe"
        />

        {/* bottom rectangle */}
        <rect
          x="5"
          y="42"
          width="80"
          height="35"
          fill="#dceefe"
        />

        {/* left line */}
        <line
          x1="18"
          y1="0"
          x2="18"
          y2="55"
          stroke="#2196f3"
          strokeWidth="1"
        />

        {/* right line */}
        <line
          x1="85"
          y1="55"
          x2="85"
          y2="100"
          stroke="#2196f3"
          strokeWidth="1"
        />

        {/* dots */}
        <circle cx="18" cy="0" r="4" fill="#2196f3" />
        <circle cx="85" cy="100" r="4" fill="#2196f3" />
      </svg>

      <div className="relative z-10 px-4 py-2 text-slate-900">
        {words.length > 1 ? (
          <>
            <div>{words[0]}</div>
            <div>{words.slice(1).join(" ")}</div>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
}