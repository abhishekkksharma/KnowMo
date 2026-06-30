"use client";

import { TopLoaderProvider } from "../../components/ui/TopLoader";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TopLoaderProvider>
      {children}
    </TopLoaderProvider>
  );
}