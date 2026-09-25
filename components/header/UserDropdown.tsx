"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface UserDropdownProps {
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export default function UserDropdown({
  userName = "Alex Mercer",
  userRole = "Senior Administrator",
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-start focus:outline-hidden"
      >
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-sm text-white shadow-theme-xs">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <span className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full bg-success-500 ring-2 ring-white dark:ring-gray-900" />
        </div>

        <div className="hidden text-start lg:block">
          <span className="block text-sm font-semibold text-gray-800 dark:text-white/90">
            {userName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {userRole}
          </span>
        </div>

        <svg
          className={`hidden w-4 h-4 text-gray-400 transition-transform lg:block ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute end-0 mt-3 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-lg z-9999 dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-2.5 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {userName}
            </p>
            <p className="text-xs text-gray-500 truncate dark:text-gray-400">
              alex.mercer@nletacrm.com
            </p>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              View Profile
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Account Settings
            </button>
          </div>

          <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
            <Link
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
