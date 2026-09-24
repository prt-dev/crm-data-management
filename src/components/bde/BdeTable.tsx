"use client";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { EyeIcon, PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { bdeService } from "@/services/bdeService";
import { BDE, BdeDepartment, BdeStatus } from "@/types/bde";
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../tables/Pagination";
import BdeDeleteModal from "./BdeDeleteModal";
import BdeViewModal from "./BdeViewModal";

interface BdeTableProps {
  onDataChange?: () => void;
}

const DEPARTMENTS: (BdeDepartment | "ALL")[] = [
  "ALL",
  "Enterprise Sales",
  "Inbound Sales",
  "Outbound Outreach",
  "Mid-Market",
  "Strategic Accounts",
];

const STATUSES: (BdeStatus | "ALL")[] = [
  "ALL",
  "Active",
  "Probation",
  "On Leave",
  "Inactive",
];

export default function BdeTable({ onDataChange }: BdeTableProps) {
  const [bdes, setBdes] = useState<BDE[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [viewingBde, setViewingBde] = useState<BDE | null>(null);
  const [deletingBde, setDeletingBde] = useState<BDE | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchBdes = async () => {
    try {
      setLoading(true);
      const res = await bdeService.getBdes();
      setBdes(res.data);
    } catch (err) {
      console.error("Error fetching BDEs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBdes();
  }, []);

  const filteredBdes = useMemo(() => {
    return bdes.filter((bde) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        bde.name.toLowerCase().includes(query) ||
        bde.bdeId.toLowerCase().includes(query) ||
        bde.email.toLowerCase().includes(query) ||
        bde.role.toLowerCase().includes(query) ||
        bde.territory.toLowerCase().includes(query) ||
        bde.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || bde.status === statusFilter;

      const matchesDept =
        departmentFilter === "ALL" || bde.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [bdes, searchTerm, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBdes.length / itemsPerPage));
  const paginatedBdes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBdes.slice(start, start + itemsPerPage);
  }, [filteredBdes, currentPage, itemsPerPage]);

  const handleDeleteConfirm = async () => {
    if (!deletingBde) return;
    try {
      setIsDeleting(true);
      await bdeService.deleteBde(deletingBde.id);
      setFeedbackMessage(`Executive "${deletingBde.name}" was removed.`);
      setDeletingBde(null);
      await fetchBdes();
      if (onDataChange) onDataChange();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error("Failed to delete BDE:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetDemoData = async () => {
    try {
      await bdeService.resetBdes();
      setFeedbackMessage("Demo BDE records reset to original default fixtures.");
      await fetchBdes();
      if (onDataChange) onDataChange();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error("Failed to reset demo records:", err);
    }
  };

  const getStatusBadgeColor = (
    status: BDE["status"]
  ): "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" => {
    switch (status) {
      case "Active":
        return "success";
      case "Probation":
        return "warning";
      case "On Leave":
        return "info";
      case "Inactive":
        return "light";
      default:
        return "primary";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      {/* Table Feedback Toast Notification */}
      {feedbackMessage && (
        <div className="mx-5 mt-4 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3 text-theme-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          <span>{feedbackMessage}</span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-brand-500 hover:text-brand-700 dark:hover:text-brand-200 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Table Controls */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/5">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Business Development Executives
          </h3>
          <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
            Manage your sales representatives, pipeline quotas, and conversion efficiency
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search BDEs by name, ID, territory..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full sm:w-64 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All Statuses" : status}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm text-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          {/* Add BDE Primary Action */}
          <Link href="/bde/create">
            <Button
              size="sm"
              startIcon={<PlusIcon className="w-4 h-4" />}
            >
              Add BDE
            </Button>
          </Link>

          {/* Reset Demo Button */}
          <button
            onClick={handleResetDemoData}
            title="Reset default mock data"
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-theme-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Executive
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Role & Department
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Territory
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Quota Attainment
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Pipeline Won
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 text-end text-theme-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-5 py-10 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                >
                  Loading BDE directory records...
                </TableCell>
              </TableRow>
            ) : paginatedBdes.length > 0 ? (
              paginatedBdes.map((bde) => {
                const attainmentPercent =
                  bde.monthlyQuota > 0
                    ? Math.round(
                        (bde.achievedRevenue / bde.monthlyQuota) * 100
                      )
                    : 0;

                return (
                  <TableRow key={bde.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    {/* Executive Info */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold text-theme-sm dark:bg-brand-500/15 dark:text-brand-400">
                          {bde.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                            {bde.name}
                          </span>
                          <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                            {bde.bdeId}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role & Department */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <div>
                        <span className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                          {bde.role}
                        </span>
                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                          {bde.department}
                        </span>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <div>
                        <span className="block text-theme-sm text-gray-600 dark:text-gray-300">
                          {bde.email}
                        </span>
                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                          {bde.phone}
                        </span>
                      </div>
                    </TableCell>

                    {/* Territory */}
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {bde.territory}
                    </TableCell>

                    {/* Quota Attainment Progress */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-theme-xs mb-1 font-medium">
                          <span className="text-gray-800 dark:text-white/90">
                            {formatCurrency(bde.achievedRevenue)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {attainmentPercent}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden dark:bg-gray-800">
                          <div
                            className={`h-full rounded-full ${
                              attainmentPercent >= 100
                                ? "bg-success-500"
                                : attainmentPercent >= 65
                                ? "bg-brand-500"
                                : "bg-warning-500"
                            }`}
                            style={{
                              width: `${Math.min(100, attainmentPercent)}%`,
                            }}
                          />
                        </div>
                        <span className="block text-[11px] text-gray-400 mt-1">
                          Quota: {formatCurrency(bde.monthlyQuota)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Pipeline Won */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <div>
                        <span className="block text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                          {bde.dealsClosed} Deals Closed
                        </span>
                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">
                          {bde.conversionRate}% Conversion Rate
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                      <Badge size="sm" color={getStatusBadgeColor(bde.status)}>
                        {bde.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-4 text-end whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewingBde(bde)}
                          title="View Details"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <Link href={`/bde/${bde.id}/edit`}>
                          <button
                            type="button"
                            title="Edit Executive"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-500 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-brand-400"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingBde(bde)}
                          title="Delete Executive"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-500 dark:text-gray-400 dark:hover:bg-error-500/10 dark:hover:text-error-400"
                        >
                          <TrashBinIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-5 py-8 text-center text-theme-sm text-gray-500 dark:text-gray-400"
                >
                  No Business Development Executives matching the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full p-4 border-t border-gray-100 dark:border-white/5">
        <div className="text-theme-sm text-gray-500 dark:text-gray-400">
          Showing {paginatedBdes.length} of {filteredBdes.length} executives
          {bdes.length !== filteredBdes.length && ` (filtered from ${bdes.length})`}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modals */}
      <BdeViewModal
        isOpen={!!viewingBde}
        onClose={() => setViewingBde(null)}
        bde={viewingBde}
      />

      <BdeDeleteModal
        isOpen={!!deletingBde}
        onClose={() => setDeletingBde(null)}
        onConfirm={handleDeleteConfirm}
        bde={deletingBde}
        isDeleting={isDeleting}
      />
    </div>
  );
}
