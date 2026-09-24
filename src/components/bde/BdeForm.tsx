"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { Link } from "@/i18n/navigation";
import { ChevronDownIcon } from "@/icons";
import { BdeDepartment, BdeStatus, CreateBdeDTO } from "@/types/bde";
import React, { useState } from "react";

interface BdeFormProps {
  initialData?: Partial<CreateBdeDTO>;
  onSubmit: (data: CreateBdeDTO) => Promise<void>;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

const DEPARTMENTS: BdeDepartment[] = [
  "Enterprise Sales",
  "Inbound Sales",
  "Outbound Outreach",
  "Mid-Market",
  "Strategic Accounts",
];

const STATUSES: BdeStatus[] = ["Active", "Probation", "On Leave", "Inactive"];

export default function BdeForm({
  initialData,
  onSubmit,
  isEdit = false,
  isSubmitting = false,
}: BdeFormProps) {
  const [formData, setFormData] = useState<CreateBdeDTO>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "Business Development Executive",
    department: initialData?.department || "Enterprise Sales",
    territory: initialData?.territory || "North America",
    monthlyQuota: initialData?.monthlyQuota ?? 50000,
    achievedRevenue: initialData?.achievedRevenue ?? 0,
    leadsAssigned: initialData?.leadsAssigned ?? 0,
    dealsClosed: initialData?.dealsClosed ?? 0,
    status: initialData?.status || "Active",
    joinedDate:
      initialData?.joinedDate || new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role/designation is required.";
    }

    if (!formData.territory.trim()) {
      newErrors.territory = "Assigned territory is required.";
    }

    if (formData.monthlyQuota < 0) {
      newErrors.monthlyQuota = "Monthly quota must be a positive number.";
    }

    if ((formData.achievedRevenue ?? 0) < 0) {
      newErrors.achievedRevenue = "Achieved revenue cannot be negative.";
    }

    if ((formData.leadsAssigned ?? 0) < 0) {
      newErrors.leadsAssigned = "Leads assigned cannot be negative.";
    }

    if ((formData.dealsClosed ?? 0) < 0) {
      newErrors.dealsClosed = "Deals closed cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-start">
      {/* Section 1: Executive Profile */}
      <div>
        <div className="border-b border-gray-100 pb-3 mb-6 dark:border-white/5">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Personal & Professional Profile
          </h4>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Basic contact and identification details for the Business Development Executive
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <Label htmlFor="bde-name">
              Full Name <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-name"
              name="name"
              placeholder="e.g. Alex Mercer"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              error={!!errors.name}
              hint={errors.name}
            />
          </div>

          {/* Email Address */}
          <div>
            <Label htmlFor="bde-email">
              Work Email <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-email"
              name="email"
              type="email"
              placeholder="e.g. alex.mercer@company.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={!!errors.email}
              hint={errors.email}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="bde-phone">
              Phone Number <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-phone"
              name="phone"
              placeholder="e.g. +1 (555) 234-5678"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
              error={!!errors.phone}
              hint={errors.phone}
            />
          </div>

          {/* Designation / Role */}
          <div>
            <Label htmlFor="bde-role">
              Designation / Role <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-role"
              name="role"
              placeholder="e.g. Senior BDE, Lead Executive"
              value={formData.role}
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value });
                if (errors.role) setErrors({ ...errors, role: "" });
              }}
              error={!!errors.role}
              hint={errors.role}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Department & Territory Assignment */}
      <div>
        <div className="border-b border-gray-100 pb-3 mb-6 dark:border-white/5">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Department & Territorial Placement
          </h4>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Assign the executive to a sales segment, geographic market, and status
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Department */}
          <div>
            <Label htmlFor="bde-dept">Department</Label>
            <div className="relative">
              <select
                id="bde-dept"
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value as BdeDepartment,
                  })
                }
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {DEPARTMENTS.map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                    className="dark:bg-gray-900 dark:text-white/90"
                  >
                    {dept}
                  </option>
                ))}
              </select>
              <span className="inset-e-3 pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Territory */}
          <div>
            <Label htmlFor="bde-territory">
              Territory / Region <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-territory"
              name="territory"
              placeholder="e.g. North America (East)"
              value={formData.territory}
              onChange={(e) => {
                setFormData({ ...formData, territory: e.target.value });
                if (errors.territory) setErrors({ ...errors, territory: "" });
              }}
              error={!!errors.territory}
              hint={errors.territory}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="bde-status">Employment Status</Label>
            <div className="relative">
              <select
                id="bde-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as BdeStatus,
                  })
                }
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                {STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="dark:bg-gray-900 dark:text-white/90"
                  >
                    {status}
                  </option>
                ))}
              </select>
              <span className="inset-e-3 pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <ChevronDownIcon className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Joined Date */}
          <div>
            <Label htmlFor="bde-joined">Joining Date</Label>
            <Input
              id="bde-joined"
              name="joinedDate"
              type="date"
              value={formData.joinedDate}
              onChange={(e) =>
                setFormData({ ...formData, joinedDate: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Section 3: Quota & Pipeline Metrics */}
      <div>
        <div className="border-b border-gray-100 pb-3 mb-6 dark:border-white/5">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Pipeline Targets & Performance Metrics
          </h4>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Set baseline quotas, current revenue achievements, and pipeline allocations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly Quota */}
          <div>
            <Label htmlFor="bde-quota">
              Monthly Quota Target ($) <span className="text-error-500">*</span>
            </Label>
            <Input
              id="bde-quota"
              name="monthlyQuota"
              type="number"
              min={0}
              placeholder="e.g. 50000"
              value={formData.monthlyQuota}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyQuota: Number(e.target.value),
                })
              }
              error={!!errors.monthlyQuota}
              hint={errors.monthlyQuota}
            />
          </div>

          {/* Achieved Revenue */}
          <div>
            <Label htmlFor="bde-achieved">Achieved Revenue ($)</Label>
            <Input
              id="bde-achieved"
              name="achievedRevenue"
              type="number"
              min={0}
              placeholder="e.g. 35000"
              value={formData.achievedRevenue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  achievedRevenue: Number(e.target.value),
                })
              }
              error={!!errors.achievedRevenue}
              hint={errors.achievedRevenue}
            />
          </div>

          {/* Leads Assigned */}
          <div>
            <Label htmlFor="bde-leads">Leads Assigned</Label>
            <Input
              id="bde-leads"
              name="leadsAssigned"
              type="number"
              min={0}
              placeholder="e.g. 30"
              value={formData.leadsAssigned}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  leadsAssigned: Number(e.target.value),
                })
              }
              error={!!errors.leadsAssigned}
              hint={errors.leadsAssigned}
            />
          </div>

          {/* Deals Closed */}
          <div>
            <Label htmlFor="bde-deals">Deals Closed</Label>
            <Input
              id="bde-deals"
              name="dealsClosed"
              type="number"
              min={0}
              placeholder="e.g. 10"
              value={formData.dealsClosed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dealsClosed: Number(e.target.value),
                })
              }
              error={!!errors.dealsClosed}
              hint={errors.dealsClosed}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Notes / Remarks */}
      <div>
        <div className="border-b border-gray-100 pb-3 mb-6 dark:border-white/5">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Notes & Performance Highlights
          </h4>
          <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
            Add context regarding the executive&apos;s specializations, performance reviews, or key client wins
          </p>
        </div>

        <div>
          <Label htmlFor="bde-notes">Executive Notes</Label>
          <TextArea
            placeholder="Add relevant notes, key strengths, accounts managed, or targets..."
            rows={4}
            value={formData.notes || ""}
            onChange={(val) => setFormData({ ...formData, notes: val })}
          />
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
        <Link href="/bde">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="button"
          size="md"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Executive"
            : "Save Executive"}
        </Button>
      </div>
    </form>
  );
}
