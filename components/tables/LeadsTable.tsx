"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DynamicTable, { Column } from "./DynamicTable";
import { leadService } from "@/services/leadService";
import { LeadItem } from "@/types/lead";

export default function LeadsTable() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (err) {
      console.error("Error loading leads for dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = leadService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const columns: Column<LeadItem>[] = [
    {
      key: "id",
      header: "Lead ID",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-brand-600 dark:text-brand-400">
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
          <span className="block font-medium text-gray-900 dark:text-white">
            {row.facilityName}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            {row.contactPerson} &bull; {row.facilityType}
          </span>
        </div>
      ),
    },
    {
      key: "unitsCount",
      header: "Units",
      sortable: true,
      align: "center",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {row.unitsCount} units
        </span>
      ),
    },
    {
      key: "auditType",
      header: "Audit Type",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
          {row.auditType}
        </span>
      ),
    },
    {
      key: "estimatedValue",
      header: "Value (₹)",
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
      header: "Pipeline Status",
      sortable: true,
      align: "center",
      render: (row) => {
        const getBadgeClass = (status: string) => {
          switch (status) {
            case "Won":
              return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30";
            case "Under Discussion":
              return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30";
            case "Lost":
              return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30";
            default:
              return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
          }
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeClass(
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
      header: "Actions",
      align: "center",
      render: () => (
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400"
        >
          View Details &rarr;
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <p className="mt-2 text-xs text-gray-500">Loading pipeline leads...</p>
      </div>
    );
  }

  return (
    <DynamicTable<LeadItem>
      title="Recent Inquiries & Scheduled Inspections"
      description="Real-time pipeline synchronization with NLETA centralized records"
      columns={columns}
      data={leads}
      searchPlaceholder="Search facility, contact, lead ID..."
      initialPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      filterOptions={[
        { label: "All Inquiries", value: "ALL", field: "status" },
        { label: "Won", value: "Won", field: "status" },
        { label: "Under Discussion", value: "Under Discussion", field: "status" },
        { label: "Lost", value: "Lost", field: "status" },
      ]}
    />
  );
}
