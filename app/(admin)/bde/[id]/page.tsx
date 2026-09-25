"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricCard from "@/components/metrics/MetricCard";
import DynamicTable, { Column } from "@/components/tables/DynamicTable";
import Button from "@/components/ui/Button";
import { bdeService, formatINR } from "@/services/bdeService";
import { bdeLeadService } from "@/services/bdeLeadService";
import { bdeClientService } from "@/services/bdeClientService";
import { BdeItem, BdeStatus } from "@/types/bde";
import { LeadItem } from "@/types/lead";
import { ClientItem } from "@/types/client";

export default function BdeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const bdeId = resolvedParams.id;

  const [bde, setBde] = useState<BdeItem | null>(null);
  const [assignedLeads, setAssignedLeads] = useState<LeadItem[]>([]);
  const [assignedClients, setAssignedClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "clients">("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [executive, leads, clients] = await Promise.all([
        bdeService.getBdeById(bdeId),
        bdeLeadService.getLeadsForBde(bdeId),
        bdeClientService.getClientsForBde(bdeId),
      ]);
      setBde(executive);
      setAssignedLeads(leads);
      setAssignedClients(clients);
    } catch (err) {
      console.error("Error loading BDE profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubLead = bdeLeadService.subscribe(loadData);
    const unsubClient = bdeClientService.subscribe(loadData);
    return () => {
      unsubLead();
      unsubClient();
    };
  }, [bdeId]);

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
          Loading sales rep profile...
        </p>
      </div>
    );
  }

  if (!bde) {
    return (
      <div className="space-y-6">
        <Breadcrumb
          pageTitle="Sales Rep Not Found"
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Sales Team", href: "/bde" },
            { label: "Not Found" },
          ]}
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Sales Rep &ldquo;{bdeId}&rdquo; Not Found
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            This sales representative record may have been removed or does not exist.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/bde">
              <Button variant="primary">Return to Sales Team Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const targetPct = bde.numericTarget > 0
    ? Math.min(100, Math.round((bde.numericAchieved / bde.numericTarget) * 100))
    : 0;

  const getStatusBadge = (status: BdeStatus) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-800/40";
      case "On Leave":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-800/40";
      case "Probation":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-800/40";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

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
      header: "Facility & Contact",
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
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.estimatedValue}
        </span>
      ),
    },
    {
      key: "status",
      header: "Pipeline Stage",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
          {row.status}
        </span>
      ),
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
          View in CRM &rarr;
        </Link>
      ),
    },
  ];

  const clientColumns: Column<ClientItem>[] = [
    {
      key: "companyName",
      header: "Client Company",
      sortable: true,
      render: (row) => (
        <div>
          <span className="block font-semibold text-gray-900 dark:text-white">
            {row.companyName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.id} &bull; {row.clientType}
          </span>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Contact Person",
      render: (row) => (
        <div>
          <span className="block text-xs font-medium text-gray-900 dark:text-white">
            {row.contactPerson}
          </span>
          <span className="block text-xs text-gray-400">{row.contactEmail}</span>
        </div>
      ),
    },
    {
      key: "contractValue",
      header: "Contract Value",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {row.contractValue}
        </span>
      ),
    },
    {
      key: "contractStatus",
      header: "Agreement Status",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20">
          {row.contractStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <Breadcrumb
        pageTitle={`Sales Rep Profile: ${bde.fullName}`}
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sales Team", href: "/bde" },
          { label: bde.fullName },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href={`/bde/${bde.id}/sales`}>
              <Button variant="outline" size="md">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.25A8.004 8.004 0 0117.75 8H12V2.25z" />
                </svg>
                <span>Sales Pipeline & Deals</span>
              </Button>
            </Link>
            <Link href={`/bde/${bde.id}/edit`}>
              <Button variant="primary" size="md">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Sales Rep Hero Profile Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-5">
            {/* Initials Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500 font-black text-xl text-white shadow-lg">
              {bde.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bde.fullName}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(bde.status)}`}>
                  {bde.status}
                </span>
              </div>
              <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                {bde.designation} &bull; <span className="font-mono">{bde.employeeCode}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sales Territory: <strong>{bde.region}</strong> &bull; Member since {bde.joinedDate}
              </p>
            </div>
          </div>

          {/* Quick Target Progress Indicator */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:w-72 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-gray-500 dark:text-gray-400">Quarterly Sales Target</span>
              <span className="text-brand-600 dark:text-brand-400">{targetPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  targetPct >= 90
                    ? "bg-emerald-500"
                    : targetPct >= 65
                    ? "bg-brand-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              <span>Closed: <strong>{bde.achievedRevenue}</strong></span>
              <span>Target: <strong>{bde.quarterlyTarget}</strong></span>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
          <div>
            <span className="block text-gray-400 font-semibold uppercase">Email Address</span>
            <span className="block text-gray-900 dark:text-white font-medium mt-0.5">{bde.email}</span>
          </div>
          <div>
            <span className="block text-gray-400 font-semibold uppercase">Phone Number</span>
            <span className="block text-gray-900 dark:text-white font-medium mt-0.5">{bde.phone}</span>
          </div>
          <div>
            <span className="block text-gray-400 font-semibold uppercase">Sales Territory</span>
            <span className="block text-gray-900 dark:text-white font-medium mt-0.5">{bde.region}</span>
          </div>
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <MetricCard
          title="Closed Revenue"
          value={bde.achievedRevenue}
          change={`${targetPct}% of target`}
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
          value={`${bde.conversionRate}%`}
          change="+4.2%"
          changeType="increase"
          period="lead close rate"
          icon={
            <svg className="w-6 h-6 fill-current text-brand-600 dark:text-brand-400" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />
        <MetricCard
          title="Active Leads"
          value={assignedLeads.length.toString()}
          change="In Pipeline"
          changeType="increase"
          period="open opportunities"
          icon={
            <svg className="w-6 h-6 fill-current text-blue-light-600 dark:text-blue-light-400" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 16a7 7 0 1114 0H3z" />
            </svg>
          }
        />
        <MetricCard
          title="Client Accounts"
          value={assignedClients.length.toString()}
          change="Corporate"
          changeType="increase"
          period="managed accounts"
          icon={
            <svg className="w-6 h-6 fill-current text-purple-600 dark:text-purple-400" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
            </svg>
          }
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            activeTab === "overview"
              ? "text-brand-600 dark:text-brand-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          Sales Overview
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sales")}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === "sales"
              ? "text-brand-600 dark:text-brand-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <span>Pipeline & Leads</span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-400">
            {assignedLeads.length}
          </span>
          {activeTab === "sales" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("clients")}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === "clients"
              ? "text-brand-600 dark:text-brand-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <span>Assigned Accounts</span>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-400">
            {assignedClients.length}
          </span>
          {activeTab === "clients" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Pipeline Summary Table */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Active Sales Pipeline
                </h3>
                <Link
                  href={`/bde/${bde.id}/sales`}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  View Pipeline & Deals &rarr;
                </Link>
              </div>
              <DynamicTable<LeadItem>
                columns={leadColumns}
                data={assignedLeads}
                searchPlaceholder="Search assigned leads..."
                initialPageSize={5}
                pageSizeOptions={[5, 10]}
              />
            </div>
          </div>

          {/* Right Column: Sales Rep Notes & Stats */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Sales Performance Summary
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Designation</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bde.designation}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Quarterly Target</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bde.quarterlyTarget}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Closed Revenue</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{bde.achievedRevenue}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Deals Won</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bde.closedDealsCount} deals</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{bde.conversionRate}%</span>
                </div>
              </div>

              {bde.notes && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Sales Notes:
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {bde.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sales & Leads Pipeline */}
      {activeTab === "sales" && (
        <div className="space-y-6">
          <DynamicTable<LeadItem>
            title="Assigned Leads & Pipeline"
            description={`All active leads and inquiries managed by ${bde.fullName}`}
            columns={leadColumns}
            data={assignedLeads}
            searchPlaceholder="Search facility, contact person, type..."
            initialPageSize={10}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Tab 3: Assigned Accounts */}
      {activeTab === "clients" && (
        <div className="space-y-6">
          <DynamicTable<ClientItem>
            title="Assigned Client Accounts"
            description={`Key client accounts and accounts handled by ${bde.fullName}`}
            columns={clientColumns}
            data={assignedClients}
            searchPlaceholder="Search client name, industry, contract..."
            initialPageSize={10}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}
    </div>
  );
}
