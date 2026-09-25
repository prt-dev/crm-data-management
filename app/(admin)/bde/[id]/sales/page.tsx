"use client";

import React, { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricCard from "@/components/metrics/MetricCard";
import BarChart from "@/components/charts/BarChart";
import DynamicTable, { Column } from "@/components/tables/DynamicTable";
import Button from "@/components/ui/Button";
import { bdeService, formatINR } from "@/services/bdeService";
import { bdeLeadService } from "@/services/bdeLeadService";
import { BdeItem } from "@/types/bde";
import { LeadItem, LeadStatus } from "@/types/lead";

export default function BdeSalesDataPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const bdeId = resolvedParams.id;

  const [bde, setBde] = useState<BdeItem | null>(null);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<string>("ALL");

  const loadData = async () => {
    try {
      setLoading(true);
      const [executive, bdeLeads] = await Promise.all([
        bdeService.getBdeById(bdeId),
        bdeLeadService.getLeadsForBde(bdeId),
      ]);
      setBde(executive);
      setLeads(bdeLeads);
    } catch (err) {
      console.error("Error loading BDE sales data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = bdeLeadService.subscribe(loadData);
    return () => unsub();
  }, [bdeId]);

  // Stage calculations
  const stageStats = useMemo(() => {
    const counts = {
      won: 0,
      underDiscussion: 0,
      lost: 0,
    };
    let totalPipelineNumeric = 0;

    leads.forEach((l) => {
      totalPipelineNumeric += l.numericValue || 0;
      if (l.status === "Won") counts.won++;
      else if (l.status === "Under Discussion") counts.underDiscussion++;
      else if (l.status === "Lost") counts.lost++;
    });

    return { counts, totalPipelineNumeric };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (stageFilter === "ALL") return leads;
    return leads.filter((l) => l.status === stageFilter);
  }, [leads, stageFilter]);

  const monthlySalesChartData = useMemo(() => {
    return [
      { month: "Jan", sales: 18 },
      { month: "Feb", sales: 24 },
      { month: "Mar", sales: 32 },
      { month: "Apr", sales: 28 },
      { month: "May", sales: 36 },
      { month: "Jun", sales: 42 },
      { month: "Jul", sales: 38 },
      { month: "Aug", sales: 48 },
      { month: "Sep", sales: 54 },
      { month: "Oct", sales: 46 },
      { month: "Nov", sales: 50 },
      { month: "Dec", sales: 58 },
    ];
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-theme-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
          <img
            src="/images/logo/nleta-logo.png"
            alt="Loading"
            className="h-10 w-10 animate-pulse object-contain"
          />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading sales pipeline & deals...
        </p>
      </div>
    );
  }

  if (!bde) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          pageTitle="Sales Data Not Found"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sales Team", href: "/bde" },
            { label: "Not Found" },
          ]}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Sales Record Not Found
          </h2>
          <div className="mt-6 flex justify-center">
            <Link href="/bde">
              <Button variant="primary">Return to Sales Team Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const columns: Column<LeadItem>[] = [
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
      header: "Facility & Sector",
      sortable: true,
      render: (row) => (
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.facilityName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.facilityType} &bull; {row.contactPerson}
          </span>
        </div>
      ),
    },
    {
      key: "equipmentType",
      header: "Equipment & Units",
      render: (row) => (
        <div>
          <span className="block text-xs text-gray-800 dark:text-gray-200">
            {row.equipmentType}
          </span>
          <span className="block text-[11px] text-gray-400">
            {row.unitsCount} units &bull; {row.auditType}
          </span>
        </div>
      ),
    },
    {
      key: "estimatedValue",
      header: "Deal Value (₹)",
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
      key: "actions",
      header: "Action",
      align: "center",
      render: () => (
        <Link
          href="/leads"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400"
        >
          View in Pipeline &rarr;
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumbs */}
      <Breadcrumb
        pageTitle={`Sales Pipeline & Deals: ${bde.fullName}`}
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales Team", href: "/bde" },
          { label: bde.fullName, href: `/bde/${bde.id}` },
          { label: "Sales Pipeline & Deals" },
        ]}
        actions={
          <Link href={`/bde/${bde.id}`}>
            <Button variant="outline" size="md">
              &larr; Back to Sales Rep Profile
            </Button>
          </Link>
        }
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <MetricCard
          title="Sales Target"
          value={bde.quarterlyTarget}
          change="Assigned Target"
          changeType="increase"
          period="this quarter"
          icon={
            <svg className="w-6 h-6 fill-current text-brand-600 dark:text-brand-400" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Closed Revenue"
          value={bde.achievedRevenue}
          change={`+${bde.conversionRate}% Win Rate`}
          changeType="increase"
          period="deals closed"
          icon={
            <svg className="w-6 h-6 fill-current text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          }
        />
        <MetricCard
          title="Active Pipeline Value"
          value={formatINR(stageStats.totalPipelineNumeric)}
          change={`${leads.length} Deals`}
          changeType="increase"
          period="under negotiation"
          icon={
            <svg className="w-6 h-6 fill-current text-blue-light-600 dark:text-blue-light-400" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.25A8.004 8.004 0 0117.75 8H12V2.25z" />
            </svg>
          }
        />
        <MetricCard
          title="Won Deals"
          value={`${bde.closedDealsCount} Deals`}
          change="Won & Closed"
          changeType="increase"
          period="completed deals"
          icon={
            <svg className="w-6 h-6 fill-current text-purple-600 dark:text-purple-400" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* Pipeline Funnel Stages Cards */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Sales Pipeline Funnel (Deals by Stage)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setStageFilter(stageFilter === "Won" ? "ALL" : "Won")}
            className={`p-4 rounded-xl border text-start transition-all cursor-pointer ${
              stageFilter === "Won"
                ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/20 ring-2 ring-emerald-500/30"
                : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 dark:border-gray-800 dark:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                1. Won Deals (Green)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="mt-2 block text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
              {stageStats.counts.won}
            </span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
              Closed & Certified Contracts
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStageFilter(stageFilter === "Under Discussion" ? "ALL" : "Under Discussion")}
            className={`p-4 rounded-xl border text-start transition-all cursor-pointer ${
              stageFilter === "Under Discussion"
                ? "border-blue-500 bg-blue-50/70 dark:bg-blue-500/20 ring-2 ring-blue-500/30"
                : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 dark:border-gray-800 dark:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                2. Under Discussion (Blue)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            </div>
            <span className="mt-2 block text-2xl font-extrabold text-blue-800 dark:text-blue-300">
              {stageStats.counts.underDiscussion}
            </span>
            <span className="text-xs text-blue-600/80 dark:text-blue-400/80">
              Active Negotiations & Quotes
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStageFilter(stageFilter === "Lost" ? "ALL" : "Lost")}
            className={`p-4 rounded-xl border text-start transition-all cursor-pointer ${
              stageFilter === "Lost"
                ? "border-rose-500 bg-rose-50/70 dark:bg-rose-500/20 ring-2 ring-rose-500/30"
                : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/60 dark:border-gray-800 dark:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                3. Lost Deals (Red)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            </div>
            <span className="mt-2 block text-2xl font-extrabold text-rose-800 dark:text-rose-300">
              {stageStats.counts.lost}
            </span>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Dropped / Inactive Inquiries
            </span>
          </button>
        </div>

        {stageFilter !== "ALL" && (
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500">
              Filtering by stage: <strong>{stageFilter}</strong>
            </span>
            <button
              type="button"
              onClick={() => setStageFilter("ALL")}
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              Clear Filter (Show All)
            </button>
          </div>
        )}
      </div>

      {/* Monthly Sales Performance Graph */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <BarChart
          title="Monthly Sales & Closed Deals"
          subtitle={`Annual closed contract volume achieved by ${bde.fullName}`}
          data={monthlySalesChartData}
        />
      </div>

      {/* Pipeline Leads Table */}
      <DynamicTable<LeadItem>
        title="Active Deals & Pipeline Opportunities"
        description="Track, filter, and close sales opportunities assigned to this sales rep"
        columns={columns}
        data={filteredLeads}
        searchPlaceholder="Search facility, client, audit type..."
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
