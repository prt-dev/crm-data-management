"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricCard from "@/components/metrics/MetricCard";
import DynamicTable, { Column } from "@/components/tables/DynamicTable";
import Button from "@/components/ui/Button";
import {
  leadService,
  formatINR,
  formatStandardINR,
} from "@/services/leadService";
import { LeadItem, LeadStats, LeadStatus } from "@/types/lead";

export default function LeadsViewPage() {
  const router = useRouter();

  // State
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<LeadItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status Filter Pill for secondary fast-filter
  const [quickStatusFilter, setQuickStatusFilter] = useState<string>("ALL");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load leads and metrics from Lead Service
  const refreshData = async () => {
    try {
      const [leadsList, currentStats] = await Promise.all([
        leadService.getAllLeads(),
        leadService.getLeadStats(),
      ]);
      setLeads(leadsList);
      setStats(currentStats);
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Subscribe to any changes from create/edit/delete anywhere in app
    const unsubscribe = leadService.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  // Quick Delete Handler
  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      await leadService.deleteLead(leadToDelete.id);
      showToast(`Lead "${leadToDelete.id}" deleted successfully.`);
      setLeadToDelete(null);
      if (selectedLead?.id === leadToDelete.id) {
        setSelectedLead(null);
      }
      refreshData();
    } catch (err) {
      console.error("Error deleting lead:", err);
      showToast("Failed to delete lead.");
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "Approved & Certified":
        return {
          bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
          dot: "bg-emerald-500",
        };
      case "Audit Scheduled":
        return {
          bg: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
          dot: "bg-blue-500",
        };
      case "Under Review":
        return {
          bg: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
          dot: "bg-amber-500",
        };
      case "Quotation Sent":
        return {
          bg: "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 border-purple-200 dark:border-purple-800/40",
          dot: "bg-purple-500",
        };
      case "Rejected / Inactive":
        return {
          bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
          dot: "bg-gray-400",
        };
      case "New Inquiry":
      default:
        return {
          bg: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 border-brand-200 dark:border-brand-800/40",
          dot: "bg-brand-500",
        };
    }
  };

  // Filter options for DynamicTable dropdown
  const filterOptions = [
    { label: "New Inquiry", value: "New Inquiry", field: "status" as keyof LeadItem },
    { label: "Audit Scheduled", value: "Audit Scheduled", field: "status" as keyof LeadItem },
    { label: "Under Review", value: "Under Review", field: "status" as keyof LeadItem },
    { label: "Quotation Sent", value: "Quotation Sent", field: "status" as keyof LeadItem },
    { label: "Approved & Certified", value: "Approved & Certified", field: "status" as keyof LeadItem },
    { label: "Rejected / Inactive", value: "Rejected / Inactive", field: "status" as keyof LeadItem },
  ];

  // Secondary Fast-filtered data (if quick status pills clicked)
  const displayData = useMemo(() => {
    if (quickStatusFilter === "ALL") return leads;
    return leads.filter((l) => l.status === quickStatusFilter);
  }, [leads, quickStatusFilter]);

  // Columns definition for DynamicTable
  const columns: Column<LeadItem>[] = [
    {
      key: "id",
      header: "Lead ID",
      sortable: true,
      width: "110px",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full shrink-0 ${row.priority === "High"
                ? "bg-red-500"
                : row.priority === "Medium"
                  ? "bg-amber-400"
                  : "bg-blue-400"
              }`}
            title={`Priority: ${row.priority || "Normal"}`}
          />
          <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            {row.id}
          </span>
        </div>
      ),
    },
    {
      key: "facilityName",
      header: "Facility & Site",
      sortable: true,
      render: (row) => (
        <div className="max-w-[220px]">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {row.facilityName}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 truncate">
            <span>{row.facilityType}</span>
            {row.location && (
              <>
                <span>&bull;</span>
                <span className="truncate">{row.location}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Client Contact",
      sortable: true,
      render: (row) => (
        <div className="max-w-[180px]">
          <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
            {row.contactPerson}
          </p>
          <p className="text-[11px] text-gray-400 truncate">{row.contactPhone}</p>
        </div>
      ),
    },
    {
      key: "equipmentType",
      header: "Equipment & Units",
      sortable: false,
      render: (row) => (
        <div className="max-w-[200px]">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {row.unitsCount} {row.unitsCount === 1 ? "Unit" : "Units"}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {row.equipmentType}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 italic">{row.auditType}</span>
        </div>
      ),
    },
    {
      key: "numericValue",
      header: "Est. Value",
      sortable: true,
      align: "right",
      render: (row) => (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {row.estimatedValue || formatStandardINR(row.numericValue)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const badge = getStatusBadge(row.status);
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${badge.bg}`}
          >
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
        <div
          className="flex items-center justify-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick View Button */}
          <button
            type="button"
            onClick={() => setSelectedLead(row)}
            title="View Details"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          {/* Quick Edit Button */}
          <Link
            href={`/leads/${row.id}/edit`}
            title="Edit Lead"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-500/10 transition"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>

          {/* Quick Delete Button */}
          <button
            type="button"
            onClick={() => setLeadToDelete(row)}
            title="Delete Lead"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 hover:text-error-600 dark:text-error-400 dark:hover:bg-error-500/10 transition"
          >
            <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb */}
      <Breadcrumb
        pageTitle="Leads & Audit Inquiries Management"
        items={[
          { label: "Admin Portal", href: "/dashboard" },
          { label: "Leads" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await leadService.resetToDefault();
                showToast("Reset to sample agency leads.");
                refreshData();
              }}
              title="Reset sample data"
              leftIcon={
                <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Reset Samples
            </Button>

            <Link href="/leads/create">
              <Button
                variant="primary"
                size="sm"
                leftIcon={
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Register New Lead
              </Button>
            </Link>
          </div>
        }
      />

      {/* Section 1: Respective Analysis Cards (using MetricCard component) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Lead Pipeline Performance Analysis
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live inspection deal metrics and conversion tracking across safety audit categories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
          {/* Card 1: Total Inquiries & Leads */}
          <MetricCard
            title="Total Registered Leads"
            value={stats ? stats.totalLeads : leads.length}
            change="+14.2%"
            changeType="increase"
            period="in active pipeline"
            icon={
              <svg className="w-6 h-6 fill-current text-brand-600 dark:text-brand-400" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            }
          />

          {/* Card 2: Active Pipeline Deal Value */}
          <MetricCard
            title="Total Pipeline Valuation"
            value={stats?.formattedPipelineValue || "₹0"}
            change="+21.5%"
            changeType="increase"
            period="cumulative deal value"
            icon={
              <svg className="w-6 h-6 fill-current text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            }
          />

          {/* Card 3: Scheduled Safety Audits */}
          <MetricCard
            title="Safety Audits Scheduled"
            value={stats ? stats.scheduledAudits : 0}
            change="+8.4%"
            changeType="increase"
            period="on-site inspections"
            icon={
              <svg className="w-6 h-6 fill-current text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            }
          />

          {/* Card 4: Approved & Certified Rate */}
          <MetricCard
            title="Approved & Certified"
            value={stats ? stats.approvedCertified : 0}
            change={stats?.conversionRate ? `${stats.conversionRate} win rate` : "+3.8%"}
            changeType="increase"
            period="safety certifications"
            icon={
              <svg className="w-6 h-6 fill-current text-purple-600 dark:text-purple-400" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Quick Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 me-1">
          Quick Filters:
        </span>
        {[
          { label: "All Leads", value: "ALL", count: leads.length },
          {
            label: "New Inquiry",
            value: "New Inquiry",
            count: stats?.statusBreakdown["New Inquiry"] || 0,
          },
          {
            label: "Audit Scheduled",
            value: "Audit Scheduled",
            count: stats?.statusBreakdown["Audit Scheduled"] || 0,
          },
          {
            label: "Under Review",
            value: "Under Review",
            count: stats?.statusBreakdown["Under Review"] || 0,
          },
          {
            label: "Quotation Sent",
            value: "Quotation Sent",
            count: stats?.statusBreakdown["Quotation Sent"] || 0,
          },
          {
            label: "Approved & Certified",
            value: "Approved & Certified",
            count: stats?.statusBreakdown["Approved & Certified"] || 0,
          },
        ].map((pill) => {
          const isActive = quickStatusFilter === pill.value;
          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setQuickStatusFilter(pill.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${isActive
                  ? "bg-brand-500 text-white shadow-theme-xs font-semibold"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
            >
              <span>{pill.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section 2: DynamicTable Component for Lead Data */}
      <section className="space-y-4">
        <DynamicTable<LeadItem>
          title="CRM Leads & Inspection Pipeline Records"
          description="Real-time multi-attribute search, sortable columns, and full lifecycle tracking for lift & escalator audits"
          columns={columns}
          data={displayData}
          searchPlaceholder="Search leads by facility, contact person, equipment, or inspector..."
          searchable={true}
          filterable={true}
          filterOptions={filterOptions}
          pageSizeOptions={[5, 10, 20]}
          initialPageSize={5}
          onRowClick={(row) => setSelectedLead(row)}
          onAddRecord={() => router.push("/leads/create")}
        />
      </section>

      {/* Modal 1: Lead Details Drawer / Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold dark:bg-brand-500/15 dark:text-brand-400">
                  {selectedLead.id.replace("LD-", "#")}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.facilityName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-mono">{selectedLead.id}</span>
                    <span>&bull;</span>
                    <span>{selectedLead.facilityType}</span>
                    {selectedLead.location && (
                      <>
                        <span>&bull;</span>
                        <span>{selectedLead.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-5 text-sm">
              {/* Status and Priority Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                  {(() => {
                    const b = getStatusBadge(selectedLead.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${b.bg}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />
                        <span>{selectedLead.status}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Priority:</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedLead.priority === "High"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                        : selectedLead.priority === "Medium"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                      }`}
                  >
                    {selectedLead.priority || "Normal"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Deal Value:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedLead.estimatedValue || formatStandardINR(selectedLead.numericValue)}
                  </span>
                </div>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Card */}
                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Client Contact
                  </h4>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {selectedLead.contactPerson}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Phone: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLead.contactPhone}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Email: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLead.contactEmail}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Acquired via: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLead.source}</span>
                  </p>
                </div>

                {/* Audit & Equipment Card */}
                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Audit & Equipment Specs
                  </h4>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {selectedLead.equipmentType}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Audited Units: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLead.unitsCount} Units</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Audit Type: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedLead.auditType}</span>
                  </p>
                </div>
              </div>

              {/* Dates & Timeline */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 text-xs">
                <div>
                  <span className="text-gray-400">Created Date:</span>
                  <p className="font-semibold text-gray-800 dark:text-white mt-0.5">
                    {selectedLead.createdDate}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Scheduled Audit Date:</span>
                  <p className="font-semibold text-gray-800 dark:text-white mt-0.5">
                    {selectedLead.scheduledDate || "Not Scheduled Yet"}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800 bg-white dark:bg-gray-800/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Technical Scope & Inspection Notes
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              {/* Fast Status Transition Buttons inside Modal */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Update Lifecycle Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "New Inquiry",
                      "Audit Scheduled",
                      "Under Review",
                      "Quotation Sent",
                      "Approved & Certified",
                    ] as LeadStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={selectedLead.status === st}
                      onClick={async () => {
                        const updated = await leadService.updateLead(selectedLead.id, {
                          status: st,
                        });
                        setSelectedLead(updated);
                        showToast(`Status updated to "${st}"`);
                        refreshData();
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${selectedLead.status === st
                          ? "bg-brand-500 text-white font-bold cursor-default"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setLeadToDelete(selectedLead)}
                className="text-xs font-semibold text-error-600 hover:text-error-700 dark:text-error-400"
              >
                Delete Lead
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                >
                  Close
                </Button>
                <Link href={`/leads/${selectedLead.id}/edit`}>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={
                      <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    }
                  >
                    Edit Record
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Delete Confirmation Dialog */}
      {leadToDelete && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setLeadToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Delete Lead Record?
            </h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {leadToDelete.facilityName} ({leadToDelete.id})
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeadToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
              >
                Yes, Delete Lead
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
