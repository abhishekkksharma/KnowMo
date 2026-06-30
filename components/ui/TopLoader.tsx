"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

type LoaderContextType = {
  start: () => void;
  finish: () => void;
};

const LoaderContext = createContext<LoaderContextType | null>(null);

export const useTopLoader = () => {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useTopLoader must be used inside TopLoaderProvider");
  }

  return context;
};

function RouteWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { finish } = useTopLoader();

  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  return null;
}

export function TopLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const visibleRef = useRef(visible);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const start = useCallback(() => {
    if (visibleRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setVisible(true);
    setProgress(5);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.08;
      });
    }, 100);
  }, []);

  const finish = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (visibleRef.current) {
      setProgress(100);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        timeoutRef.current = null;
      }, 300);
    }
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        const anchor = target.closest("a");

        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        // Skip modified clicks (e.g. command/ctrl click to open in new tab)
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.button !== 0 // not left click
        ) {
          return;
        }

        // Skip target="_blank"
        const targetAttr = anchor.getAttribute("target");
        if (targetAttr && targetAttr.trim().toLowerCase() === "_blank") {
          return;
        }

        // Skip external links
        const isExternal =
          anchor.hostname !== window.location.hostname ||
          anchor.port !== window.location.port ||
          anchor.protocol !== window.location.protocol;
        if (isExternal) return;

        // Skip hash links or mailto/tel etc.
        if (
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("javascript:")
        ) {
          return;
        }

        // Skip downloads
        if (anchor.hasAttribute("download")) return;

        // Skip if it's the exact same pathname and search params
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchor.href, window.location.href);
        if (
          currentUrl.pathname === targetUrl.pathname &&
          currentUrl.search === targetUrl.search
        ) {
          return;
        }

        start();
      } catch (err) {
        console.error("Error in TopLoader click handler:", err);
      }
    };

    const handlePushState = () => {
      start();
    };

    // Intercept pushState
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      handlePushState();
      return originalPushState.apply(this, args);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.history.pushState = originalPushState;
    };
  }, [start]);

  return (
    <LoaderContext.Provider value={{ start, finish }}>
      <Suspense fallback={null}>
        <RouteWatcher />
      </Suspense>
      {visible && (
        <div
          className="
            fixed top-0 left-0 z-[9999]
            h-[2px]
            bg-pink-600
            rounded-r-full
            transition-all duration-200 ease-out
            shadow-[0_0_6px_rgba(219,39,119,0.35)]
          "
          style={{
            width: `${progress}%`,
          }}
        />
      )}

      {children}
    </LoaderContext.Provider>
  );
}