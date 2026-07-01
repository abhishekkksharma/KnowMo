"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Menu, X, ChevronDown, LogOut, Search } from "lucide-react";
import NavItem from "./NavItem";
import ThemeToggle from "../ui/themeToggle";
import Logo from "../headers/Logo"
import SearchBar from "./SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleMobileDropdown = (label: string) => {
    setExpandedMobileMenu(expandedMobileMenu === label ? null : label);
  };

  const navLinks = [
    {
      label: "Home",
      href: "/",
      icon: <Home size={19} strokeWidth={2.2} />,
    },
    {
      label: "Departments",
      href: "/departments",
      dropdown: [
        { label: "CSE", href: "/departments/CSE" },
        { label: "ECE", href: "/departments/ECE" },
        { label: "See All", href: "/departments" },
      ],
    },
    {
      label: "Explore",
      href: "/explore",
    },
    {
      label: "About",
      href: "/about",
    },
  ];

  return (
    <>
      {/* Unified Header Wrapper */}
      <div className="fixed top-4 left-0 right-0 w-full md:px-20 h-14 flex items-center justify-between z-[60] pointer-events-none">
        
        {/* Desktop Logo (Left) */}
        <div className="hidden md:flex items-center justify-start w-60 pointer-events-auto">
          <Logo size={40} />
        </div>

        {/* Main Desktop/Mobile Navbar Shell (Center) */}
        <nav
          className="
          bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl
          rounded-full border-2 border-white/40 dark:border-zinc-800/60
          shadow-[0_12px_40px_rgba(0,0,0,0.08)]
          p-1.5 pointer-events-auto
          transition-all duration-300
          w-[92%] sm:w-[85%] md:w-auto mx-auto md:mx-0
          "
        >
          <div className="flex items-center justify-between gap-1.5 w-full px-2">
            {/* Logo / Brand space for mobile */}
            <Logo size={28} className="md:hidden pl-2" />

            {/* Desktop NavItems */}
            <div className="hidden md:flex items-center gap-1.5 flex-1 justify-start relative">
              {navLinks.map((link) => (
                <NavItem
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  active={isActive(link.href)}
                  icon={link.icon}
                  dropdown={link.dropdown}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <ThemeToggle />

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-800 dark:text-zinc-200"
                aria-label="Open Menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Desktop SearchBar (Right) */}
        <div className="hidden md:flex items-center justify-end w-60 pointer-events-auto">
          <SearchBar open={isSearchOpen} setOpen={setIsSearchOpen} />
        </div>

      </div>

      {/* Mobile Search Overlay/Modal handler */}
      <div className="md:hidden">
        <SearchBar open={isSearchOpen} setOpen={setIsSearchOpen} />
      </div>

      {/* --- MOBILE OFF-CANVAS MENU --- */}

      {/* 1. Dark Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-[70] md:hidden transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-[80%] max-w-sm bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-white/40 dark:border-zinc-800/60 shadow-2xl z-[80] md:hidden flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Navigation</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-800 dark:text-zinc-200"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const hasDropdown = !!link.dropdown;
            const isExpanded = expandedMobileMenu === link.label;

            return (
              <div key={link.label} className="flex flex-col">
                {hasDropdown ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-colors font-medium ${
                        active || isExpanded
                          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.icon}
                        <span>{link.label}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    
                    {/* Mobile Accordion Content */}
                    <div
                      className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isExpanded ? "max-h-64 opacity-100 mt-1 mb-2" : "max-h-0 opacity-0 m-0"
                      }`}
                    >
                      <div className="flex flex-col gap-1 ml-6 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 py-2">
                        {link.dropdown?.map((drop) => {
                          const dropActive = pathname === drop.href;
                          return (
                            <Link
                              href={drop.href}
                              key={drop.label}
                              onClick={() => setIsOpen(false)}
                              className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                                dropActive
                                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                              }`}
                            >
                              {drop.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors font-medium ${
                      active
                        ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}