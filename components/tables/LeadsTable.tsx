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
            case "Approved & Certified":
              return "bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20";
            case "Audit Scheduled":
              return "bg-blue-light-50 text-blue-light-700 border-blue-light-200 dark:bg-blue-light-500/10 dark:text-blue-light-400 dark:border-blue-light-500/20";
            case "Under Review":
              return "bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20";
            case "Quotation Sent":
              return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
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
        { label: "Audit Scheduled", value: "Audit Scheduled", field: "status" },
        { label: "Under Review", value: "Under Review", field: "status" },
        { label: "Quotation Sent", value: "Quotation Sent", field: "status" },
        { label: "Approved", value: "Approved & Certified", field: "status" },
      ]}
    />
  );
}
