"use client";

import React from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import NotificationCard from "./NotificationCard";
import UserDropdown from "./UserDropdown";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed = false,
  onToggleSidebar,
  onSearch,
}: HeaderProps) {
  const handleToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-gray-200 bg-white/95 backdrop-blur-md px-4 py-3 sm:px-6 dark:border-gray-800 dark:bg-gray-900/95">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Section: Hamburger + Mobile Logo + Search Bar */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          {/* Hamburger Toggle Button (controls both desktop collapse and mobile drawer) */}
          <button
            type="button"
            onClick={handleToggle}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            </svg>
          </button>

          {/* Logo on small screens */}
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <img
                src="/images/logo/nleta-logo.png"
                alt="National Lift Escalator Testing Agency"
                className="h-7 w-7 object-contain select-none"
              />
            </div>
            <span className="font-bold text-base text-gray-800 dark:text-white/90">
              NLETA
            </span>
          </Link>

          {/* Search Bar on desktop */}
          <div className="hidden sm:block flex-1 max-w-md">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>

        {/* Right Section: Dark Mode Toggle + Notifications + User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />
          <NotificationCard />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
