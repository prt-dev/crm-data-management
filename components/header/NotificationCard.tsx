"use client";

import React, { useEffect, useRef, useState } from "react";

interface Notification {
  id: string;
  avatarText: string;
  avatarColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const defaultNotifications: Notification[] = [
  {
    id: "notif-1",
    avatarText: "SV",
    avatarColor: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
    title: "New Client Account Created",
    description: "Marcus Vance onboarded Apex Global Tech with $84,000 quota.",
    time: "5 min ago",
    unread: true,
  },
  {
    id: "notif-2",
    avatarText: "LD",
    avatarColor: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
    title: "Lead Qualified in Pipeline",
    description: "Elena Rostova marked LD-1002 as Qualified for Data Migration.",
    time: "24 min ago",
    unread: true,
  },
  {
    id: "notif-3",
    avatarText: "TR",
    avatarColor: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
    title: "Monthly Quota Target Achieved",
    description: "Devon Washington hit 107% of Q1 monthly revenue target.",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: "notif-4",
    avatarText: "SY",
    avatarColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    title: "System Backup Completed",
    description: "Scheduled daily CRM database snapshot synchronized successfully.",
    time: "1 day ago",
    unread: false,
  },
];

export default function NotificationCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, unread: false }))
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {unreadCount > 0 && (
          <span className="absolute top-0.5 end-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
          </span>
        )}

        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.292a.75.75 0 00-1.5 0v.544C6.083 3.207 3.625 5.9 3.625 9.167v5.292h-.292a.75.75 0 000 1.5h13.334a.75.75 0 000-1.5h-.292V9.167c0-3.267-2.458-5.96-5.625-6.331V2.292zm4.125 12.167V9.167c0-2.692-2.183-4.875-4.875-4.875s-4.875 2.183-4.875 4.875v5.292h9.75zM8 17.708a.75.75 0 00.75.75h2.5a.75.75 0 000-1.5h-2.5a.75.75 0 00-.75.75z"
          />
        </svg>
      </button>

      {/* Notification Dropdown Card */}
      {isOpen && (
        <div className="absolute end-0 mt-3 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg z-9999 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <h5 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Notifications
              </h5>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto custom-scrollbar">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 py-3 px-1 transition-colors hover:bg-gray-50/60 dark:hover:bg-white/5 rounded-lg ${
                  item.unread ? "bg-brand-50/20 dark:bg-brand-500/5" : ""
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${item.avatarColor}`}
                >
                  {item.avatarText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 truncate dark:text-white/90">
                      {item.title}
                    </p>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3 text-center dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-white"
            >
              View All Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
