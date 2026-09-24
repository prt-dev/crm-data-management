"use client";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Link } from "@/i18n/navigation";
import { PencilIcon } from "@/icons";
import { BDE } from "@/types/bde";
import React from "react";

interface BdeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bde: BDE | null;
}

export default function BdeViewModal({
  isOpen,
  onClose,
  bde,
}: BdeViewModalProps) {
  if (!bde) return null;

  const attainmentPercent =
    bde.monthlyQuota > 0
      ? Math.min(
          100,
          Math.round((bde.achievedRevenue / bde.monthlyQuota) * 100)
        )
      : 0;

  const getStatusColor = (
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6 sm:p-8 text-start"
    >
      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 font-bold text-brand-600 text-theme-xl dark:bg-brand-500/15 dark:text-brand-400">
            {bde.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-theme-xl font-bold text-gray-800 dark:text-white/90">
                {bde.name}
              </h3>
              <Badge size="sm" color={getStatusColor(bde.status)}>
                {bde.status}
              </Badge>
            </div>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              {bde.bdeId} • {bde.role} • {bde.department}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Link href={`/bde/${bde.id}/edit`}>
            <Button
              size="sm"
              variant="outline"
              startIcon={<PencilIcon className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Performance Meter */}
      <div className="py-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Quota Attainment
          </span>
          <span className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
            {formatCurrency(bde.achievedRevenue)} /{" "}
            {formatCurrency(bde.monthlyQuota)} ({attainmentPercent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              attainmentPercent >= 100
                ? "bg-success-500"
                : attainmentPercent >= 60
                ? "bg-brand-500"
                : "bg-warning-500"
            }`}
            style={{ width: `${Math.min(100, attainmentPercent)}%` }}
          />
        </div>
      </div>

      {/* Grid Details */}
      <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-gray-100 dark:border-white/5">
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Email Address
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.email}
          </span>
        </div>
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Phone Number
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.phone}
          </span>
        </div>
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Territory / Region
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.territory}
          </span>
        </div>
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Joined Date
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.joinedDate}
          </span>
        </div>
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Active Leads Assigned
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.leadsAssigned} leads
          </span>
        </div>
        <div>
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500">
            Deals Closed & Conversion Rate
          </span>
          <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
            {bde.dealsClosed} deals ({bde.conversionRate}%)
          </span>
        </div>
      </div>

      {/* Notes / Bio */}
      {bde.notes && (
        <div className="pt-6">
          <span className="block text-theme-xs font-medium text-gray-400 dark:text-gray-500 mb-1">
            Executive Notes & Highlights
          </span>
          <p className="text-theme-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/3 p-3.5 rounded-xl border border-gray-100 dark:border-white/5">
            {bde.notes}
          </p>
        </div>
      )}

      {/* Footer Close */}
      <div className="mt-8 flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
