"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricCard from "@/components/metrics/MetricCard";
import DynamicTable, { Column } from "@/components/tables/DynamicTable";
import Button from "@/components/ui/Button";
import { bdeService, formatINR } from "@/services/bdeService";
import { BdeItem, BdeStats, BdeStatus } from "@/types/bde";

export default function BdeViewPage() {
  const router = useRouter();

  // State
  const [bdes, setBdes] = useState<BdeItem[]>([]);
  const [stats, setStats] = useState<BdeStats | null>(null);
  const [selectedBde, setSelectedBde] = useState<BdeItem | null>(null);
  const [bdeToDelete, setBdeToDelete] = useState<BdeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quickStatusFilter, setQuickStatusFilter] = useState<string>("ALL");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshData = async () => {
    try {
      const [list, currentStats] = await Promise.all([
        bdeService.getAllBdes(),
        bdeService.getBdeStats(),
      ]);
      setBdes(list);
      setStats(currentStats);
    } catch (err) {
      console.error("Error loading BDE team:", err);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = bdeService.subscribe(() => refreshData());
    return () => unsub();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!bdeToDelete) return;
    try {
      await bdeService.deleteBde(bdeToDelete.id);
      showToast(`Executive "${bdeToDelete.fullName}" removed successfully.`);
      setBdeToDelete(null);
      if (selectedBde?.id === bdeToDelete.id) {
        setSelectedBde(null);
      }
      refreshData();
    } catch (err) {
      console.error("Error deleting BDE:", err);
      showToast("Failed to delete executive.");
    }
  };

  const getStatusBadge = (status: BdeStatus) => {
    switch (status) {
      case "Active":
        return {
          bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
          dot: "bg-emerald-500",
        };
      case "On Leave":
        return {
          bg: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
          dot: "bg-amber-500",
        };
      case "Probation":
        return {
          bg: "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 border-purple-200 dark:border-purple-800/40",
          dot: "bg-purple-500",
        };
      case "Inactive":
      default:
        return {
          bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
          dot: "bg-gray-400",
        };
    }
  };

  const filterOptions = [
    { label: "Active", value: "Active", field: "status" as keyof BdeItem },
    { label: "On Leave", value: "On Leave", field: "status" as keyof BdeItem },
    { label: "Probation", value: "Probation", field: "status" as keyof BdeItem },
    { label: "Inactive", value: "Inactive", field: "status" as keyof BdeItem },
  ];

  const displayData = useMemo(() => {
    if (quickStatusFilter === "ALL") return bdes;
    return bdes.filter((b) => b.status === quickStatusFilter);
  }, [bdes, quickStatusFilter]);

  const columns: Column<BdeItem>[] = [
    {
      key: "id",
      header: "Employee ID",
      sortable: true,
      width: "110px",
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 block">
            {row.id}
          </span>
          <span className="text-[10px] text-gray-400 font-mono">{row.employeeCode}</span>
        </div>
      ),
    },
    {
      key: "fullName",
      header: "Executive Name & Role",
      sortable: true,
      render: (row) => (
        <div className="max-w-[220px]">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {row.fullName}
          </p>
          <span className="text-[11px] text-gray-400 truncate block">{row.designation}</span>
        </div>
      ),
    },
    {
      key: "region",
      header: "Territory / Region",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {row.region}
        </span>
      ),
    },
    {
      key: "numericAchieved",
      header: "Target vs Closed",
      sortable: true,
      render: (row) => {
        const pct =
          row.numericTarget > 0
            ? Math.min(100, Math.round((row.numericAchieved / row.numericTarget) * 100))
            : 0;
        return (
          <div className="w-40">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {row.achievedRevenue}
              </span>
              <span className="text-gray-400 text-[10px]">{pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pct >= 90
                    ? "bg-emerald-500"
                    : pct >= 70
                    ? "bg-brand-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              Goal: {row.quarterlyTarget}
            </span>
          </div>
        );
      },
    },
    {
      key: "conversionRate",
      header: "Conversion",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="inline-flex items-center rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {row.conversionRate}%
        </span>
      ),
    },
    {
      key: "activeLeadsCount",
      header: "Pipeline",
      sortable: true,
      align: "center",
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-gray-800 dark:text-white">
            {row.activeLeadsCount}
          </span>
          <span className="text-[10px] text-gray-400 block">
            {row.closedDealsCount} Closed
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const badge = getStatusBadge(row.status);
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${badge.bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            <span>{row.status}</span>
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setSelectedBde(row)}
            title="View Executive Details"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/bde/${row.id}/edit`)}
            title="Edit Executive"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-amber-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-amber-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setBdeToDelete(row)}
            title="Delete Executive"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-bounce">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <Breadcrumb
        pageTitle="Business Development Executives"
        items={[
          { label: "Admin Portal", href: "/dashboard" },
          { label: "BDE Sales Team" },
        ]}
        actions={
          <Link href="/bde/create">
            <Button variant="primary" size="md">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Register New Executive
            </Button>
          </Link>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total BDE Team"
          value={stats?.totalExecutives ?? "--"}
          change="+2 new"
          changeType="increase"
          period="field sales force"
          icon={
            <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Active in Field"
          value={stats?.activeExecutives ?? "--"}
          change="83.3%"
          changeType="increase"
          period="territory deployed"
          icon={
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Closed Revenue"
          value={stats?.formattedTotalRevenue ?? "--"}
          change="+14.2%"
          changeType="increase"
          period="current quarter"
          icon={
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Avg Conversion"
          value={stats ? `${stats.averageConversionRate}%` : "--"}
          change="+4.5%"
          changeType="increase"
          period="audit proposal win rate"
          icon={
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
        {[
          { key: "ALL", label: "All Executives", count: bdes.length },
          { key: "Active", label: "Active", count: stats?.statusBreakdown["Active"] || 0 },
          { key: "On Leave", label: "On Leave", count: stats?.statusBreakdown["On Leave"] || 0 },
          { key: "Probation", label: "Probation", count: stats?.statusBreakdown["Probation"] || 0 },
          { key: "Inactive", label: "Inactive", count: stats?.statusBreakdown["Inactive"] || 0 },
        ].map((tab) => {
          const isActive = quickStatusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setQuickStatusFilter(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-brand-500 text-white shadow-theme-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white border border-gray-200 dark:border-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Table */}
      <DynamicTable
        title="Business Development Executive Directory"
        description="Monitor sales targets, client account management, and contract revenue closed across regions"
        columns={columns}
        data={displayData as unknown as Record<string, unknown>[]}
        searchPlaceholder="Search by executive name, employee code, region, designation..."
        filterable={true}
        filterOptions={filterOptions as unknown as { label: string; value: string; field: string }[]}
        initialPageSize={10}
        onRowClick={(row) => setSelectedBde(row as unknown as BdeItem)}
        onAddRecord={() => router.push("/bde/create")}
      />

      {/* View Detail Modal */}
      {selectedBde && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setSelectedBde(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                  {selectedBde.id} &bull; {selectedBde.employeeCode}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {selectedBde.fullName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedBde.designation} &bull; {selectedBde.region}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBde(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Performance Metrics */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Quarterly Performance & Target Realization
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/40 text-xs">
                  <div>
                    <span className="text-gray-400">Quarterly Goal</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      {selectedBde.quarterlyTarget}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Achieved Revenue</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {selectedBde.achievedRevenue}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Win Rate</span>
                    <p className="font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                      {selectedBde.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Deals Closed</span>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      {selectedBde.closedDealsCount} contracts
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact & Territory Info */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Contact & Regional Coverage
                </h4>
                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email Address:</span>
                    <a href={`mailto:${selectedBde.email}`} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                      {selectedBde.email}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone Number:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedBde.phone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Region:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedBde.region}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Joined Agency:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedBde.joinedDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <div>
                      {(() => {
                        const badge = getStatusBadge(selectedBde.status);
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold border ${badge.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                            <span>{selectedBde.status}</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {selectedBde.notes && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Executive Profile & Account Notes
                  </h4>
                  <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/50 dark:text-gray-300">
                    {selectedBde.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedBde(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/bde/${selectedBde.id}/edit`)}
              >
                Edit Executive Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {bdeToDelete && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          onClick={() => setBdeToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Remove BDE Executive?
            </h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Are you sure you want to remove <span className="font-semibold text-gray-800 dark:text-gray-200">{bdeToDelete.fullName} ({bdeToDelete.id})</span>? Pipeline accounts will need to be reallocated.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setBdeToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Confirm Removal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
