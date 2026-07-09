import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function Card({
  title,
  description,
  href,
  icon: Icon,
}: CardProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <div
        className="
          group relative overflow-hidden
          flex h-52 w-full gap-6 rounded-3xl
          border border-zinc-200/80
          bg-gradient-to-b from-white to-zinc-50
          p-5
          shadow-[0_8px_30px_rgb(0,0,0,0.08)]
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)]

          dark:border-zinc-800
          dark:bg-gradient-to-b
          dark:from-zinc-800
          dark:via-zinc-900
          dark:to-black
          dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
        "
      >
        {/* Light Glow */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(24,24,27,0.05),transparent_40%)]
            dark:hidden
          "
        />

        {/* Dark Glow */}
        <div
          className="
            pointer-events-none absolute inset-0 hidden dark:block
            bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.01),transparent_35%)]
          "
        />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            className="
              flex h-20 w-20 shrink-0 items-center justify-center
              rounded-2xl

              bg-zinc-100
              border border-zinc-200

              dark:bg-zinc-800/40
              dark:border-zinc-700
              dark:backdrop-blur-sm

              transition-all duration-300
              group-hover:scale-110
            "
          >
            <Icon
              size={36}
              className="text-zinc-700 dark:text-zinc-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col min-w-0">
          <div>
            <h3
              className="
                line-clamp-2
                min-h-[3.5rem]
                text-lg font-bold
                text-zinc-900
                dark:text-white
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-2
                line-clamp-3
                text-sm
                text-zinc-600
                dark:text-zinc-400
              "
            >
              {description}
            </p>
          </div>

          {/* Bottom section */}
          <div className="mt-auto flex justify-end">
            <div
              className="
                text-xl
                text-zinc-500
                dark:text-zinc-400
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}