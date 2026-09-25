"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricCard from "@/components/metrics/MetricCard";
import BarChart from "@/components/charts/BarChart";
import DynamicTable, { Column } from "@/components/tables/DynamicTable";
import Button from "@/components/ui/Button";
import { bdeService, formatINR } from "@/services/bdeService";
import { leadService } from "@/services/leadService";
import { bdeLeadService } from "@/services/bdeLeadService";
import { BdeItem, BdeStats } from "@/types/bde";
import { LeadItem, LeadStatus } from "@/types/lead";

export default function SalesRepDashboardPage() {
  const [bdes, setBdes] = useState<BdeItem[]>([]);
  const [bdeStats, setBdeStats] = useState<BdeStats | null>(null);
  const [allLeads, setAllLeads] = useState<LeadItem[]>([]);
  const [selectedRepId, setSelectedRepId] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [repList, stats, leads] = await Promise.all([
        bdeService.getAllBdes(),
        bdeService.getBdeStats(),
        leadService.getAllLeads(),
      ]);
      setBdes(repList);
      setBdeStats(stats);
      setAllLeads(leads);
    } catch (err) {
      console.error("Error loading Sales Rep Dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubBde = bdeService.subscribe(loadData);
    const unsubLeads = leadService.subscribe(loadData);
    return () => {
      unsubBde();
      unsubLeads();
    };
  }, []);

  // Filtered Rep
  const activeRep = useMemo(() => {
    if (selectedRepId === "ALL") return null;
    return bdes.find((b) => b.id === selectedRepId) || null;
  }, [bdes, selectedRepId]);

  // Filtered Leads
  const displayLeads = useMemo(() => {
    if (!activeRep) return allLeads;
    return allLeads.filter(
      (l) =>
        l.assignedBdeId === activeRep.id ||
        l.assignedBdeName?.toLowerCase() === activeRep.fullName.toLowerCase()
    );
  }, [allLeads, activeRep]);

  // Funnel Stage Statistics
  const funnelStages = useMemo(() => {
    const counts = {
      won: 0,
      underDiscussion: 0,
      lost: 0,
    };
    let totalPipelineVal = 0;

    displayLeads.forEach((l) => {
      totalPipelineVal += l.numericValue || 0;
      if (l.status === "Won") counts.won++;
      else if (l.status === "Under Discussion") counts.underDiscussion++;
      else if (l.status === "Lost") counts.lost++;
    });

    return { counts, totalPipelineVal };
  }, [displayLeads]);

  // Monthly Sales Performance Chart Data
  const monthlyPerformanceData = useMemo(() => {
    return [
      { month: "Jan", sales: 24 },
      { month: "Feb", sales: 30 },
      { month: "Mar", sales: 42 },
      { month: "Apr", sales: 38 },
      { month: "May", sales: 50 },
      { month: "Jun", sales: 62 },
      { month: "Jul", sales: 55 },
      { month: "Aug", sales: 68 },
      { month: "Sep", sales: 74 },
    ];
  }, []);

  const leadColumns: Column<LeadItem>[] = [
    {
      key: "id",
      header: "Lead ID",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">
          {row.id}
        </span>
      ),
    },
    {
      key: "facilityName",
      header: "Opportunity & Client",
      sortable: true,
      render: (row) => (
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.facilityName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.contactPerson} &bull; {row.facilityType}
          </span>
        </div>
      ),
    },
    {
      key: "estimatedValue",
      header: "Deal Value",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.estimatedValue}
        </span>
      ),
    },
    {
      key: "status",
      header: "Deal Stage",
      sortable: true,
      align: "center",
      render: (row) => {
        const getBadgeStyle = (status: LeadStatus) => {
          switch (status) {
            case "Won":
              return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
            case "Under Discussion":
              return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
            case "Lost":
              return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
            default:
              return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
          }
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
              row.status
            )}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "assignedBdeName",
      header: "Sales Rep",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {row.assignedBdeName || "Unassigned"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (row) => (
        <Link
          href={`/leads/${row.id}`}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400"
        >
          Manage Deal &rarr;
        </Link>
      ),
    },
  ];

  const targetProgress = activeRep
    ? activeRep.numericTarget > 0
      ? Math.min(100, Math.round((activeRep.numericAchieved / activeRep.numericTarget) * 100))
      : 0
    : bdeStats && bdeStats.totalTarget > 0
    ? Math.min(100, Math.round((bdeStats.totalAchieved / bdeStats.totalTarget) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Header & Breadcrumbs */}
      <Breadcrumb
        pageTitle="Sales Rep Dashboard"
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales Team", href: "/bde" },
          { label: "Sales Rep Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {/* Sales Rep Switcher Dropdown */}
            <select
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-theme-xs outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="ALL">🏢 Entire Sales Team</option>
              {bdes.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  👤 {rep.fullName} ({rep.region})
                </option>
              ))}
            </select>
            <Link href="/leads/create">
              <Button variant="primary" size="md">
                + Register New Lead
              </Button>
            </Link>
          </div>
        }
      />

      {/* Target & Quota Progress Banner */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-brand-600 to-indigo-700 p-6 sm:p-8 text-white shadow-theme-md dark:border-gray-800">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              🎯 Q3 2026 Sales Quota Performance
            </span>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              {activeRep ? activeRep.fullName : "Team Sales Revenue Tracker"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-100 max-w-xl">
              {activeRep
                ? `Assigned Territory: ${activeRep.region} | Code: ${activeRep.employeeCode}`
                : "Aggregated performance for all active account executives and field sales reps."}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/20 sm:w-72">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>Quota Attainment</span>
              <span className="text-emerald-300">{targetProgress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${targetProgress}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] text-brand-100">
              <span>
                Closed:{" "}
                <strong>
                  {activeRep ? activeRep.achievedRevenue : bdeStats?.formattedTotalRevenue || "₹0"}
                </strong>
              </span>
              <span>
                Target:{" "}
                <strong>
                  {activeRep ? activeRep.quarterlyTarget : bdeStats?.formattedTotalTarget || "₹0"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <MetricCard
          title="Closed Revenue"
          value={activeRep ? activeRep.achievedRevenue : bdeStats?.formattedTotalRevenue || "₹0"}
          change={`${targetProgress}% of target`}
          changeType="increase"
          period="this quarter"
          icon={
            <svg className="w-6 h-6 fill-current text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          }
        />
        <MetricCard
          title="Win Rate"
          value={activeRep ? `${activeRep.conversionRate}%` : `${bdeStats?.averageConversionRate || 0}%`}
          change="+3.8% MoM"
          changeType="increase"
          period="deal close rate"
          icon={
            <svg className="w-6 h-6 fill-current text-brand-600 dark:text-brand-400" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Pipeline Deals"
          value={displayLeads.length.toString()}
          change={formatINR(funnelStages.totalPipelineVal)}
          changeType="increase"
          period="active opportunities"
          icon={
            <svg className="w-6 h-6 fill-current text-blue-light-600 dark:text-blue-light-400" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 16a7 7 0 1114 0H3z" />
            </svg>
          }
        />
        <MetricCard
          title="Deals Won"
          value={activeRep ? `${activeRep.closedDealsCount} Deals` : `${funnelStages.counts.won} Deals`}
          change="Won & Closed"
          changeType="increase"
          period="completed audits"
          icon={
            <svg className="w-6 h-6 fill-current text-purple-600 dark:text-purple-400" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* Sales Pipeline Funnel Stages Cards */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Sales Pipeline Funnel (Deal Stages)
          </h3>
          <span className="text-xs text-gray-500">
            Total Pipeline Value: <strong>{formatINR(funnelStages.totalPipelineVal)}</strong>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                1. Won Deals (Green)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="mt-2 block text-3xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {funnelStages.counts.won}
            </span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              Closed & Certified Contracts
            </span>
          </div>

          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                2. Under Discussion (Blue)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            </div>
            <span className="mt-2 block text-3xl font-extrabold text-blue-800 dark:text-blue-300">
              {funnelStages.counts.underDiscussion}
            </span>
            <span className="text-xs text-blue-600/80 dark:text-blue-400/80">
              Active Negotiations & Quotes
            </span>
          </div>

          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-900/10">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                3. Lost Deals (Red)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            </div>
            <span className="mt-2 block text-3xl font-extrabold text-rose-800 dark:text-rose-300">
              {funnelStages.counts.lost}
            </span>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Dropped / Inactive Inquiries
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Half-Width Graph & Rep Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <BarChart
            title="Monthly Deals & Closed Revenue"
            subtitle="Closed contract volume progression (2026)"
            data={monthlyPerformanceData}
          />
        </div>

        {/* Territory Sales Reps Leaderboard */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Sales Reps Leaderboard
            </h3>
            <Link
              href="/bde"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View Full Team &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {bdes.slice(0, 5).map((rep, idx) => {
              const repPct =
                rep.numericTarget > 0
                  ? Math.min(100, Math.round((rep.numericAchieved / rep.numericTarget) * 100))
                  : 0;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedRepId(rep.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedRepId === rep.id
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
                      : "border-gray-100 hover:bg-gray-50/70 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 font-bold text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="block font-semibold text-xs text-gray-900 dark:text-white">
                        {rep.fullName}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {rep.region} &bull; {rep.conversionRate}% Win Rate
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {rep.achievedRevenue}
                    </span>
                    <span className="text-[10px] text-gray-400">{repPct}% of quota</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Pipeline Table */}
      <DynamicTable<LeadItem>
        title="Active Sales Opportunities in Pipeline"
        description="Filter, sort, and inspect live client opportunities"
        columns={leadColumns}
        data={displayLeads}
        searchPlaceholder="Search opportunity name, client, audit type..."
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
