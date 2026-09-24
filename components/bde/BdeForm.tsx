"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BdeItem,
  CreateBdeInput,
  UpdateBdeInput,
  BdeStatus,
  BdeDesignation,
  BdeRegion,
} from "@/types/bde";
import { bdeService, formatINR } from "@/services/bdeService";
import Button from "@/components/ui/Button";

interface BdeFormProps {
  initialBde?: BdeItem;
  isEdit?: boolean;
}

const designations: BdeDesignation[] = [
  "Senior BD Manager",
  "Key Account Manager",
  "Regional Sales Lead",
  "Enterprise Account Director",
  "Business Development Associate",
];

const regions: BdeRegion[] = [
  "Delhi NCR",
  "Mumbai Metro",
  "Bengaluru Tech Corridor",
  "Hyderabad Metro",
  "Chennai & South",
  "Kolkata & East",
  "Pune & West",
];

const statuses: BdeStatus[] = ["Active", "On Leave", "Probation", "Inactive"];

export default function BdeForm({ initialBde, isEdit = false }: BdeFormProps) {
  const router = useRouter();

  // State
  const [fullName, setFullName] = useState(initialBde?.fullName || "");
  const [employeeCode, setEmployeeCode] = useState(initialBde?.employeeCode || "");
  const [email, setEmail] = useState(initialBde?.email || "");
  const [phone, setPhone] = useState(initialBde?.phone || "");
  const [designation, setDesignation] = useState<string>(
    initialBde?.designation || "Key Account Manager"
  );
  const [region, setRegion] = useState<string>(initialBde?.region || "Delhi NCR");
  const [status, setStatus] = useState<BdeStatus>(initialBde?.status || "Active");
  const [numericTarget, setNumericTarget] = useState<number>(
    initialBde?.numericTarget || 5000000
  );
  const [numericAchieved, setNumericAchieved] = useState<number>(
    initialBde?.numericAchieved || 0
  );
  const [conversionRate, setConversionRate] = useState<number>(
    initialBde?.conversionRate || 70
  );
  const [activeLeadsCount, setActiveLeadsCount] = useState<number>(
    initialBde?.activeLeadsCount || 5
  );
  const [closedDealsCount, setClosedDealsCount] = useState<number>(
    initialBde?.closedDealsCount || 0
  );
  const [notes, setNotes] = useState(initialBde?.notes || "");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Executive Full Name is required.");
      return;
    }
    if (!employeeCode.trim()) {
      setErrorMessage("Employee Code / ID is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Contact phone number is required.");
      return;
    }
    if (numericTarget <= 0) {
      setErrorMessage("Quarterly sales target must be greater than zero.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEdit && initialBde) {
        const updatePayload: UpdateBdeInput = {
          fullName,
          employeeCode,
          email,
          phone,
          designation,
          region,
          status,
          numericTarget,
          quarterlyTarget: formatINR(numericTarget),
          numericAchieved,
          achievedRevenue: formatINR(numericAchieved),
          conversionRate,
          activeLeadsCount,
          closedDealsCount,
          notes,
        };

        await bdeService.updateBde(initialBde.id, updatePayload);
        setSuccessToast(`BDE profile "${fullName}" updated successfully!`);
      } else {
        const createPayload: CreateBdeInput = {
          fullName,
          employeeCode,
          email,
          phone,
          designation,
          region,
          status,
          numericTarget,
          quarterlyTarget: formatINR(numericTarget),
          numericAchieved,
          achievedRevenue: formatINR(numericAchieved),
          conversionRate,
          activeLeadsCount,
          closedDealsCount,
          joinedDate: new Date().toISOString().split("T")[0],
          notes,
        };

        const created = await bdeService.createBde(createPayload);
        setSuccessToast(`BDE "${created.fullName}" registered successfully with ID ${created.id}!`);
      }

      setTimeout(() => {
        router.push("/bde");
      }, 1200);
    } catch (err: unknown) {
      console.error("Failed to save BDE:", err);
      const msg = err instanceof Error ? err.message : "Error saving BDE record";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-bounce">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl bg-error-50 p-4 border border-error-200 text-sm text-error-700 dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold">Validation Error</h4>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Executive Profile */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Executive Identity & Contact
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Official employee details and communication channels
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Employee Code <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="e.g. NLETA-BD-015"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-mono text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Work Email <span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.m@nleta.gov.in"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Mobile / Contact Number <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98112 45890"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Designation & Territory */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Role Assignment & Territory
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Designation and geographical operating region
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Designation <span className="text-error-500">*</span>
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  {designations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Operating Territory / Region <span className="text-error-500">*</span>
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Notes & Specialization Summary
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Expert in transit infrastructure bids, airport contracts, and metro elevator safety audits."
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Targets & Performance Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Performance & Targets
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sales quotas and conversion metrics
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Employment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BdeStatus)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Quarterly Target (₹ INR) <span className="text-error-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  required
                  value={numericTarget}
                  onChange={(e) => setNumericTarget(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Formatted: {formatINR(numericTarget)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Achieved Revenue (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={numericAchieved}
                  onChange={(e) => setNumericAchieved(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-emerald-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-emerald-400"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Formatted: {formatINR(numericAchieved)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Conversion (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Active Leads
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={activeLeadsCount}
                    onChange={(e) => setActiveLeadsCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Closed Deals Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={closedDealsCount}
                  onChange={(e) => setClosedDealsCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60 space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving Executive...
                </span>
              ) : isEdit ? (
                "Update BDE Executive"
              ) : (
                "Register BDE Executive"
              )}
            </Button>

            <Link href="/bde" className="block w-full">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full justify-center"
              >
                Cancel & Return
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
