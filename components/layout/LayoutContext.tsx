
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../../components/headers/Navbar";
import Footer from "../../components/footer/footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {children}

      {!isAdminRoute && <Footer />}
    </>
  );
}
