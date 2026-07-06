"use client"

import Link from "next/link";
import Logo from "../headers/Logo";
import AppLogos from "../../assets/appLogos";
import { Heart, Mail } from "lucide-react"
function Footer() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Departments", href: "/departments" },
    { name: "Explore", href: "/explore" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-8 md:px-20 lg:px-40 py-10 pb-4">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Brand Section */}
        <div className="space-y-4">
          <Logo size={60} />
          <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
            Stay informed, discover insights, and keep yourself updated with
            the latest content.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-semibold text-lg text-black dark:text-white mb-4">
            Connect
          </h3>

          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/abhishekkksharma"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={AppLogos.GithubLogo.src}
                alt="GitHub"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200 dark:invert"
              />
            </Link>

            <Link
              href="https://www.linkedin.com/in/abhishek-sharma-16a8071b7/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={AppLogos.LinkedInLogo.src}
                alt="LinkedIn"
                className="w-7 h-7 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200 dark:invert"
              />
            </Link>

            <a href="mailto:abhisheksharma7340733@gmail.com">
              <Mail
                className="w-9 h-9 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-200 dark:invert"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <p className="flex items-center justify-center gap-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Made with
          <Heart className="h-4 w-4 hover:fill-current text-pink-600" />
          by
          <a
            href="https://www.linkedin.com/in/abhishek-sharma-16a8071b7/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Abhishek Sharma
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;