
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../../components/ui/theme-provider";
import Providers from "./provider";
import LayoutContent from "../../components/layout/LayoutContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KnowMo",
    template: "KnowMo | %s",
  },
  description: "KnowMo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
