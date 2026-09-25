"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LeadItem,
  CreateLeadInput,
  UpdateLeadInput,
  FacilityType,
  AuditType,
  LeadSource,
  LeadStatus,
  LeadPriority,
} from "@/types/lead";
import { leadService, formatStandardINR } from "@/services/leadService";
import { bdeService } from "@/services/bdeService";
import { bdeLeadService } from "@/services/bdeLeadService";
import { BdeItem } from "@/types/bde";
import Button from "@/components/ui/Button";

interface LeadFormProps {
  initialLead?: LeadItem;
  isEdit?: boolean;
}

const facilityTypes: FacilityType[] = [
  "Commercial Complex",
  "Hospital",
  "Transit Hub",
  "Residential Tower",
  "Tech Park",
  "Industrial / Warehouse",
  "Educational Campus",
];

const auditTypes: AuditType[] = [
  "Annual Safety Audit",
  "New Commissioning",
  "Modernization Testing",
  "Emergency Inspection",
];

const leadSources: LeadSource[] = [
  "Government Portal",
  "Inbound Call",
  "Direct Referral",
  "Annual Renewal",
  "Website Form",
];

const leadStatuses: LeadStatus[] = [
  "Won",
  "Under Discussion",
  "Lost",
];


export default function LeadForm({ initialLead, isEdit = false }: LeadFormProps) {
  const router = useRouter();

  // Form State
  const [facilityName, setFacilityName] = useState(initialLead?.facilityName || "");
  const [facilityType, setFacilityType] = useState<FacilityType>(
    initialLead?.facilityType || "Commercial Complex"
  );
  const [location, setLocation] = useState(initialLead?.location || "");
  const [contactPerson, setContactPerson] = useState(initialLead?.contactPerson || "");
  const [contactEmail, setContactEmail] = useState(initialLead?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(initialLead?.contactPhone || "");
  const [equipmentType, setEquipmentType] = useState(
    initialLead?.equipmentType || "Passenger Lifts & Escalators"
  );
  const [unitsCount, setUnitsCount] = useState<number>(initialLead?.unitsCount || 4);
  const [auditType, setAuditType] = useState<AuditType>(
    initialLead?.auditType || "Annual Safety Audit"
  );
  const [numericValue, setNumericValue] = useState<number>(
    initialLead?.numericValue || 250000
  );
  const [source, setSource] = useState<LeadSource>(
    initialLead?.source || "Inbound Call"
  );
  const [status, setStatus] = useState<LeadStatus>(
    initialLead?.status || "Under Discussion"
  );
  const [priority, setPriority] = useState<LeadPriority>(
    initialLead?.priority || "Medium"
  );
  const [assignedBdeId, setAssignedBdeId] = useState<string>(
    initialLead?.assignedBdeId || ""
  );
  const [assignedBdeName, setAssignedBdeName] = useState<string>(
    initialLead?.assignedBdeName || ""
  );
  const [bdesList, setBdesList] = useState<BdeItem[]>([]);

  useEffect(() => {
    async function loadBdes() {
      try {
        const list = await bdeService.getAllBdes();
        setBdesList(list);
      } catch (err) {
        console.error("Failed to load BDEs in LeadForm:", err);
      }
    }
    loadBdes();
  }, []);

  const [scheduledDate, setScheduledDate] = useState(
    initialLead?.scheduledDate || ""
  );
  const [notes, setNotes] = useState(initialLead?.notes || "");

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Validation
  const validateForm = (): boolean => {
    if (!facilityName.trim()) {
      setErrorMessage("Facility Name is required.");
      return false;
    }
    if (!contactPerson.trim()) {
      setErrorMessage("Contact Person is required.");
      return false;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      setErrorMessage("Please enter a valid Contact Email.");
      return false;
    }
    if (!contactPhone.trim()) {
      setErrorMessage("Contact Phone number is required.");
      return false;
    }
    if (unitsCount < 1) {
      setErrorMessage("Units count must be at least 1.");
      return false;
    }
    if (numericValue < 0) {
      setErrorMessage("Estimated deal value cannot be negative.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEdit && initialLead) {
        const updateData: UpdateLeadInput = {
          facilityName: facilityName.trim(),
          facilityType,
          location: location.trim(),
          contactPerson: contactPerson.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          equipmentType: equipmentType.trim(),
          unitsCount: Number(unitsCount),
          auditType,
          numericValue: Number(numericValue),
          estimatedValue: formatStandardINR(Number(numericValue)),
          source,
          status,
          priority,
          assignedBdeId: assignedBdeId || undefined,
          assignedBdeName: assignedBdeName || undefined,
          scheduledDate: scheduledDate || undefined,
          notes: notes.trim(),
        };

        await leadService.updateLead(initialLead.id, updateData);

        // Sync with BDE service
        if (assignedBdeId) {
          await bdeLeadService.assignBdeToLead(initialLead.id, assignedBdeId);
        } else {
          await bdeLeadService.unassignBdeFromLead(initialLead.id);
        }

        setSuccessToast(`Lead ${initialLead.id} updated successfully!`);
      } else {
        const createData: CreateLeadInput = {
          facilityName: facilityName.trim(),
          facilityType,
          location: location.trim() || "National Capital Region",
          contactPerson: contactPerson.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          equipmentType: equipmentType.trim(),
          unitsCount: Number(unitsCount),
          auditType,
          numericValue: Number(numericValue),
          estimatedValue: formatStandardINR(Number(numericValue)),
          source,
          status,
          priority,
          assignedBdeId: assignedBdeId || undefined,
          assignedBdeName: assignedBdeName || undefined,
          scheduledDate: scheduledDate || undefined,
          notes: notes.trim(),
        };

        const created = await leadService.createLead(createData);

        // Sync with BDE service
        if (assignedBdeId) {
          await bdeLeadService.assignBdeToLead(created.id, assignedBdeId);
        }

        setSuccessToast(`Lead created successfully with ID: ${created.id}`);
      }

      // Smooth redirection to view page
      setTimeout(() => {
        router.push("/leads");
      }, 1200);
    } catch (err: unknown) {
      console.error("Failed to save lead:", err);
      const message = err instanceof Error ? err.message : "An error occurred while saving the lead.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Toast Notification */}
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
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="font-semibold">Validation Error</h4>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form Fields: 2 Columns on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Facility & Client Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm4 0h2v2h-2V5zm-4 4h2v2H7V9zm4 0h2v2h-2V9zm-4 4h2v2H7v-2zm4 0h2v2h-2v-2z" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Facility & Client Information
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Site details and primary safety point of contact
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Facility Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Facility / Building Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. Grand Venice Mall or Apollo MedCity Tower A"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              {/* Facility Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Facility Type
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value as FacilityType)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                >
                  {facilityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New Delhi, Mumbai, Bengaluru"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contact Person Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Vikram Malhotra or Dr. Sunita Kulkarni"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contact Phone <span className="text-error-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 98112 45890"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              {/* Contact Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Contact Email <span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. v.malhotra@grandvenice.in"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical & Audit Scope */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  Equipment Specifications & Audit Scope
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Define lift, escalator inventory and testing classification
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Equipment Type */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Equipment Description / Categories
                </label>
                <input
                  type="text"
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  placeholder="e.g. Heavy Duty Escalators & Passenger Lifts"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              {/* Units Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Number of Units / Lifts <span className="text-error-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={unitsCount}
                  onChange={(e) => setUnitsCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                  required
                />
              </div>

              {/* Audit Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Audit / Inspection Type
                </label>
                <select
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value as AuditType)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                >
                  {auditTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Target Inspection Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>

              {/* Assigned BDE Executive */}
              <div className="">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Assigned Business Development Executive (BDE)
                </label>
                <div className="relative">
                  <select
                    value={assignedBdeId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setAssignedBdeId(id);
                      const bde = bdesList.find((b) => b.id === id);
                      setAssignedBdeName(bde ? bde.fullName : "");
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="">-- Unassigned (General Inquiry Pool) --</option>
                    {bdesList.map((bde) => (
                      <option key={bde.id} value={bde.id}>
                        {bde.fullName} ({bde.employeeCode} &bull; {bde.designation} &bull; {bde.region})
                      </option>
                    ))}
                  </select>
                </div>
                {assignedBdeName ? (
                  <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Assigned to {assignedBdeName} ({assignedBdeId})
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-gray-400">
                    Lead is in general inbound pool. Select a BDE executive to assign direct pipeline ownership.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Commercials & Technical Notes */}
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
                  Deal Valuation & Audit Notes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Estimated fees, client requirements, and testing parameters
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Numeric Value */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Estimated Certification Value (₹ INR) <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-gray-500 font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={numericValue}
                      onChange={(e) => setNumericValue(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 ps-8 pe-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                      required
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Formatted: {formatStandardINR(numericValue)}
                  </p>
                </div>

                {/* Lead Source */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Lead Acquisition Source
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as LeadSource)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {leadSources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Inspection Notes & Special Testing Directives
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention specific safety parameters, BIS compliance codes, previous audit history, or site access restrictions..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Live Lead Card: 1 Column on desktop */}
        <div className="space-y-6">
          {/* Status & Priority Control Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/60">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
              Workflow Status
            </h3>

            <div className="space-y-4">
              {/* Lead Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Pipeline Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                >
                  {leadStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Inspection Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Low", "Medium", "High"] as LeadPriority[]).map((p) => {
                    const isSelected = priority === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`rounded-xl py-2 text-xs font-semibold transition border ${isSelected
                            ? p === "High"
                              ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40"
                              : p === "Medium"
                                ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                                : "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lead ID metadata if edit */}
              {isEdit && initialLead && (
                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  <div className="flex justify-between py-1">
                    <span>Record ID:</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-white">
                      {initialLead.id}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Created Date:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {initialLead.createdDate}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                loadingText={isEdit ? "Updating Lead..." : "Creating Lead..."}
                leftIcon={
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                {isEdit ? "Update Lead Record" : "Save & Register Lead"}
              </Button>

              <Link href="/leads" className="block">
                <Button variant="outline" fullWidth>
                  Cancel / Return to Leads
                </Button>
              </Link>
            </div>
          </div>

          {/* Real-time Lead Preview Card */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-theme-xs dark:border-gray-800 dark:from-gray-900/80 dark:to-gray-900/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Live Lead Summary
              </span>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                {isEdit ? initialLead?.id || "PREVIEW" : "NEW"}
              </span>
            </div>

            <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {facilityName || "Facility Name Preview"}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {facilityType} &bull; {location || "NCR / India"}
            </p>

            <div className="mt-4 space-y-2 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Contact:</span>
                <span className="font-semibold text-gray-800 dark:text-white truncate max-w-[140px]">
                  {contactPerson || "Contact Name"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Equipment:</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {unitsCount} Units
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Audit Value:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatStandardINR(numericValue)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Assigned BDE:</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 truncate max-w-[140px]">
                  {assignedBdeName || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
