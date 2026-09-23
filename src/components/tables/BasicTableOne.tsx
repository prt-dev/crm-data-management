"use client";

import { Link } from "@/i18n/navigation";
import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "./Pagination";

export interface LeadItem {
  id: number;
  leadId: string;
  date: string;
  source: string;
  serviceInterest: string;
  city: string;
  state: string;
  assignedRegion: string;
  status: "New" | "Contacted" | "Qualified" | "In Progress" | "Closed";
}

export interface BasicTableOneProps {
  title?: string;
  description?: string;
  showViewAll?: boolean;
}

// Define the CRM leads table data
const tableData: LeadItem[] = [
  {
    id: 1,
    leadId: "LD-1001",
    date: "Sep 22, 2026",
    source: "Website Form",
    serviceInterest: "CRM Implementation",
    city: "Austin",
    state: "TX",
    assignedRegion: "Southwest",
    status: "New",
  },
  {
    id: 2,
    leadId: "LD-1002",
    date: "Sep 21, 2026",
    source: "LinkedIn",
    serviceInterest: "Data Migration",
    city: "Chicago",
    state: "IL",
    assignedRegion: "Midwest",
    status: "Qualified",
  },
  {
    id: 3,
    leadId: "LD-1003",
    date: "Sep 20, 2026",
    source: "Google Ads",
    serviceInterest: "Cloud Infrastructure",
    city: "New York",
    state: "NY",
    assignedRegion: "Northeast",
    status: "In Progress",
  },
  {
    id: 4,
    leadId: "LD-1004",
    date: "Sep 19, 2026",
    source: "Referral",
    serviceInterest: "Security Audit",
    city: "Atlanta",
    state: "GA",
    assignedRegion: "Southeast",
    status: "Contacted",
  },
  {
    id: 5,
    leadId: "LD-1005",
    date: "Sep 18, 2026",
    source: "Organic Search",
    serviceInterest: "Custom Analytics",
    city: "Seattle",
    state: "WA",
    assignedRegion: "Pacific Northwest",
    status: "Closed",
  },
  {
    id: 6,
    leadId: "LD-1006",
    date: "Sep 17, 2026",
    source: "Webinar",
    serviceInterest: "API Integration",
    city: "Denver",
    state: "CO",
    assignedRegion: "Mountain West",
    status: "New",
  },
  {
    id: 7,
    leadId: "LD-1007",
    date: "Sep 16, 2026",
    source: "Direct Outreach",
    serviceInterest: "Enterprise Consulting",
    city: "San Francisco",
    state: "CA",
    assignedRegion: "West Coast",
    status: "In Progress",
  },
];

const getStatusBadgeColor = (
  status: LeadItem["status"]
): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
  switch (status) {
    case "New":
      return "info";
    case "Contacted":
      return "warning";
    case "In Progress":
      return "primary";
    case "Qualified":
      return "success";
    case "Closed":
      return "dark";
    default:
      return "primary";
  }
};

export default function BasicTableOne({
  title,
  description,
  showViewAll,
}: BasicTableOneProps = {}) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {(title || showViewAll) && (
        <div className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/5">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {showViewAll && (
            <Link
              href="/leads"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-xs font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
            >
              View All
            </Link>
          )}
        </div>
      )}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Lead ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Source
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Service Interest
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                City
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                State
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Assigned Region
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {tableData.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                  {lead.leadId}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {lead.date}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {lead.source}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                  {lead.serviceInterest}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {lead.city}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {lead.state}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {lead.assignedRegion}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm whitespace-nowrap">
                  <Badge size="sm" color={getStatusBadgeColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full p-4 border-t border-gray-100 dark:border-white/5">
        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
          Showing {tableData.length} of 35 results
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

export { BasicTableOne as LeadTable };
