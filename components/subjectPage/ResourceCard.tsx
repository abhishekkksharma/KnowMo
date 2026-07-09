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
    <Link href={href}>
      <div
        className="
          group
          flex items-center gap-4
          rounded-3xl
          p-4
          transition-all duration-300
          border border-white/20 dark:border-white/10
          bg-gradient-to-br
          from-zinc-100
          via-zinc-200
          to-zinc-50
          dark:from-zinc-900
          dark:via-zinc-800
          dark:to-zinc-950
          shadow-lg
          hover:scale-[1.02]
          hover:shadow-xl
          cursor-pointer
        "
      >
        {/* Icon */}
        <div
          className="
            flex h-20 w-20 shrink-0 items-center justify-center
            rounded-2xl
            bg-gradient-to-br
            from-white/80
            via-zinc-100
            to-zinc-300
            dark:from-zinc-800
            dark:via-zinc-700
            dark:to-zinc-900
            shadow-inner
          "
        >
          <Icon
            size={36}
            className="
              text-zinc-700
              dark:text-zinc-200
              transition-transform
              group-hover:scale-110
            "
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div
          className="
            text-zinc-500 dark:text-zinc-400
            transition-transform duration-300
            group-hover:translate-x-1
          "
        >
          →
        </div>
      </div>
    </Link>
  );
}