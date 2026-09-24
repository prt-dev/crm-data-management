"use client";

import { BdeStats } from "@/types/bde";
import { DollarLineIcon, GroupIcon, TaskIcon, UserIcon } from "@/icons";
import React from "react";

interface BdeMetricsProps {
  stats: BdeStats;
  loading?: boolean;
}

export default function BdeMetrics({ stats, loading = false }: BdeMetricsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const metricCards = [
    {
      title: "Total BDEs",
      value: loading ? "..." : stats.totalBdes.toString(),
      subtext: `${stats.activeBdes} actively executing`,
      badge: `${stats.activeBdes}/${stats.totalBdes} Active`,
      badgeType: "success" as const,
      icon: <GroupIcon className="w-6 h-6 text-brand-500" />,
    },
    {
      title: "Target Quota",
      value: loading ? "..." : formatCurrency(stats.totalTargetQuota),
      subtext: "Aggregated monthly target",
      badge: "Target",
      badgeType: "info" as const,
      icon: <DollarLineIcon className="w-6 h-6 text-brand-500" />,
    },
    {
      title: "Achieved Pipeline",
      value: loading ? "..." : formatCurrency(stats.totalAchievedRevenue),
      subtext: `${stats.averageQuotaAttainment}% quota attainment`,
      badge: `${stats.averageQuotaAttainment}%`,
      badgeType:
        stats.averageQuotaAttainment >= 80
          ? ("success" as const)
          : ("warning" as const),
      icon: <TaskIcon className="w-6 h-6 text-brand-500" />,
    },
    {
      title: "Deals Closed",
      value: loading ? "..." : stats.totalDealsClosed.toString(),
      subtext: "Total qualified deal wins",
      badge: "Pipeline Won",
      badgeType: "success" as const,
      icon: <UserIcon className="w-6 h-6 text-brand-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metricCards.map((card, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/5 dark:bg-white/3 md:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              {card.icon}
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-sm font-bold text-gray-800 dark:text-white/90">
                {card.value}
              </h4>
              <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                {card.subtext}
              </p>
            </div>

            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-theme-xs font-medium ${
                card.badgeType === "success"
                  ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                  : card.badgeType === "warning"
                  ? "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
                  : "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
              }`}
            >
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
