"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClientItem,
  CreateClientInput,
  UpdateClientInput,
  ClientType,
  ClientContractStatus,
} from "@/types/client";
import { clientService } from "@/services/clientService";
import { formatStandardINR } from "@/services/leadService";
import Button from "@/components/ui/Button";

interface ClientFormProps {
  initialClient?: ClientItem;
  isEdit?: boolean;
}

const clientTypes: ClientType[] = [
  "Commercial Real Estate",
  "Hospitality",
  "Healthcare",
  "Government / Transit",
  "Residential RWA",
  "Industrial & Logistics",
];

const contractStatuses: ClientContractStatus[] = [
  "Active Agreement",
  "Pending Renewal",
  "Under Audit",
  "Expired",
  "Onboarding",
];

const accountManagers = [
  "Vikramaditya Rao",
  "Sunita Deshmukh",
  "Karan Johar",
  "Priya Sundaram",
  "Senior Partner Harish Chander",
];

export default function ClientForm({ initialClient, isEdit = false }: ClientFormProps) {
  const router = useRouter();

  // State
  const [companyName, setCompanyName] = useState(initialClient?.companyName || "");
  const [clientType, setClientType] = useState<ClientType>(
    initialClient?.clientType || "Commercial Real Estate"
  );
  const [contactPerson, setContactPerson] = useState(initialClient?.contactPerson || "");
  const [contactEmail, setContactEmail] = useState(initialClient?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(initialClient?.contactPhone || "");
  const [address, setAddress] = useState(initialClient?.address || "");
  const [city, setCity] = useState(initialClient?.city || "");
  const [state, setState] = useState(initialClient?.state || "");
  const [totalAssetsCount, setTotalAssetsCount] = useState<number>(
    initialClient?.totalAssetsCount || 10
  );
  const [contractStatus, setContractStatus] = useState<ClientContractStatus>(
    initialClient?.contractStatus || "Active Agreement"
  );
  const [numericContractValue, setNumericContractValue] = useState<number>(
    initialClient?.numericContractValue || 1500000
  );
  const [accountManager, setAccountManager] = useState(
    initialClient?.accountManager || accountManagers[0]
  );
  const [nextAuditDate, setNextAuditDate] = useState(initialClient?.nextAuditDate || "");
  const [notes, setNotes] = useState(initialClient?.notes || "");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!companyName.trim()) {
      setErrorMessage("Company / Entity Name is required.");
      return false;
    }
    if (!contactPerson.trim()) {
      setErrorMessage("Primary Contact Person is required.");
      return false;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      setErrorMessage("Please enter a valid official email.");
      return false;
    }
    if (!contactPhone.trim()) {
      setErrorMessage("Contact Phone number is required.");
      return false;
    }
    if (totalAssetsCount < 0) {
      setErrorMessage("Total assets count cannot be negative.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEdit && initialClient) {
        const updateData: UpdateClientInput = {
          companyName: companyName.trim(),
          clientType,
          contactPerson: contactPerson.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          address: address.trim(),
          city: city.trim() || "National Capital Region",
          state: state.trim() || "Delhi NCR",
          totalAssetsCount: Number(totalAssetsCount),
          contractStatus,
          numericContractValue: Number(numericContractValue),
          contractValue: formatStandardINR(Number(numericContractValue)),
          accountManager,
          nextAuditDate: nextAuditDate || undefined,
          notes: notes.trim(),
        };

        await clientService.updateClient(initialClient.id, updateData);
        setSuccessToast(`Client ${initialClient.id} updated successfully!`);
      } else {
        const createData: CreateClientInput = {
          companyName: companyName.trim(),
          clientType,
          contactPerson: contactPerson.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          address: address.trim(),
          city: city.trim() || "New Delhi",
          state: state.trim() || "Delhi NCR",
          totalAssetsCount: Number(totalAssetsCount),
          contractStatus,
          numericContractValue: Number(numericContractValue),
          contractValue: formatStandardINR(Number(numericContractValue)),
          accountManager,
          nextAuditDate: nextAuditDate || undefined,
          notes: notes.trim(),
        };

        const created = await clientService.createClient(createData);
        setSuccessToast(`Client registered successfully with ID: ${created.id}`);
      }

      setTimeout(() => {
        router.push("/clients");
      }, 1200);
    } catch (err: unknown) {
      console.error("Failed to save client:", err);
      const msg = err instanceof Error ? err.message : "Error saving client";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-3.5 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-bounce">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl bg-error-50 p-4 border border-error-200 text-sm text-error-700 dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="font-semibold">Validation Error</h4>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form: 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Corporate Entity Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm4 0h2v2h-2V5zm-4 4h2v2H7V9zm4 0h2v2h-2V9zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Client Organization & Contact
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Registered company name, sector classification, and authorized representative
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Company / Organization Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. DLF CyberCity Developers Ltd or Delhi Metro Rail Corporation"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Industry / Facility Classification
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as ClientType)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                >
                  {clientTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Primary Contact Person <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Arjun Singhal (Director of Facilities)"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Official Email <span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. a.singhal@dlfcybercity.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contact Phone Number <span className="text-error-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98101 23456"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Office / Headquarters Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. DLF CyberHub, Phase 2, DLF City"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Gurugram, Mumbai, New Delhi"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  State / Region
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Haryana, Delhi NCR, Maharashtra"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contractual & Operations Scope */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Audit Contract & Asset Portfolio
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Contract valuation, managed elevator/escalator counts, and timeline
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Managed Assets Inventory Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalAssetsCount}
                  onChange={(e) => setTotalAssetsCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Annual Contract Valuation (₹ INR) <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="10000"
                    min="0"
                    value={numericContractValue}
                    onChange={(e) => setNumericContractValue(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 ps-8 pe-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Formatted: {formatStandardINR(numericContractValue)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Dedicated Account Manager
                </label>
                <select
                  value={accountManager}
                  onChange={(e) => setAccountManager(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                >
                  {accountManagers.map((mgr) => (
                    <option key={mgr} value={mgr}>
                      {mgr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Next Scheduled Comprehensive Audit
                </label>
                <input
                  type="date"
                  value={nextAuditDate}
                  onChange={(e) => setNextAuditDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contract Directives & Account Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Master service level agreement details, site clearance protocols, emergency SLAs..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              Contract Lifecycle
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Agreement Status
                </label>
                <select
                  value={contractStatus}
                  onChange={(e) => setContractStatus(e.target.value as ClientContractStatus)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                >
                  {contractStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {isEdit && initialClient && (
                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/50 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Client Code:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-white">
                      {initialClient.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Client Since:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {initialClient.joinedDate}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isSubmitting}
                  loadingText={isEdit ? "Updating Client..." : "Registering Client..."}
                >
                  {isEdit ? "Update Client Record" : "Register Client Account"}
                </Button>

                <Link href="/clients" className="block">
                  <Button variant="outline" fullWidth>
                    Cancel / Return
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-theme-xs dark:border-gray-800 dark:from-gray-900/80 dark:to-gray-900/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Client Summary Card
              </span>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                {isEdit ? initialClient?.id : "NEW"}
              </span>
            </div>

            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {companyName || "Organization Name"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {clientType} &bull; {city || "India"}
            </p>

            <div className="mt-4 space-y-2 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Managed Units:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {totalAssetsCount} Equipment Units
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Annual Value:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatStandardINR(numericContractValue)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Account Lead:</span>
                <span className="font-medium text-gray-800 dark:text-white truncate max-w-[140px]">
                  {accountManager}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
