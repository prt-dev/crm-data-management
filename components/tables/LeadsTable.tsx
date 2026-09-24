"use client";

import React, { useMemo, useState } from "react";
import Button from "../ui/Button";
import Pagination from "../pagination/Pagination";

export interface LeadItem {
  id: string;
  facilityName: string;
  facilityType: "Commercial Complex" | "Hospital" | "Transit Hub" | "Residential Tower" | "Tech Park";
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  equipmentType: string;
  unitsCount: number;
  auditType: "Annual Safety Audit" | "New Commissioning" | "Modernization Testing" | "Emergency Inspection";
  estimatedValue: string;
  numericValue: number;
  source: "Government Portal" | "Inbound Call" | "Direct Referral" | "Annual Renewal";
  status: "New Inquiry" | "Audit Scheduled" | "Under Review" | "Quotation Sent" | "Approved & Certified";
  assignedInspector: string;
  createdDate: string;
}

const initialLeads: LeadItem[] = [
  {
    id: "LD-501",
    facilityName: "Grand Venice Mall",
    facilityType: "Commercial Complex",
    contactPerson: "Vikram Malhotra",
    contactEmail: "v.malhotra@grandvenice.in",
    contactPhone: "+91 98112 45890",
    equipmentType: "Heavy Duty Escalators & Passenger Lifts",
    unitsCount: 14,
    auditType: "Annual Safety Audit",
    estimatedValue: "₹4,20,000",
    numericValue: 420000,
    source: "Annual Renewal",
    status: "Audit Scheduled",
    assignedInspector: "Inspector Rajesh Sharma",
    createdDate: "2026-09-18",
  },
  {
    id: "LD-502",
    facilityName: "Apollo MedCity Tower A & B",
    facilityType: "Hospital",
    contactPerson: "Dr. Sunita Kulkarni",
    contactEmail: "s.kulkarni@apollomed.org",
    contactPhone: "+91 98230 77123",
    equipmentType: "High-Speed Bed/Stretcher & Emergency Lifts",
    unitsCount: 8,
    auditType: "Emergency Inspection",
    estimatedValue: "₹2,80,000",
    numericValue: 280000,
    source: "Inbound Call",
    status: "Under Review",
    assignedInspector: "Inspector Amitav Sen",
    createdDate: "2026-09-20",
  },
  {
    id: "LD-503",
    facilityName: "Lucknow Metro Central Station",
    facilityType: "Transit Hub",
    contactPerson: "S. K. Srivastava",
    contactEmail: "sk.srivastava@upmetrorail.gov.in",
    contactPhone: "+91 94150 11984",
    equipmentType: "Heavy Transit Public Escalators & Moving Walkways",
    unitsCount: 22,
    auditType: "New Commissioning",
    estimatedValue: "₹8,90,000",
    numericValue: 890000,
    source: "Government Portal",
    status: "Quotation Sent",
    assignedInspector: "Senior Eng. Harish Chander",
    createdDate: "2026-09-12",
  },
  {
    id: "LD-504",
    facilityName: "Apex Heights Highrise Towers",
    facilityType: "Residential Tower",
    contactPerson: "Rohan Singhania",
    contactEmail: "rohan@apexheights-rwa.com",
    contactPhone: "+91 97188 33451",
    equipmentType: "Traction Passenger Lifts (G+32)",
    unitsCount: 10,
    auditType: "Modernization Testing",
    estimatedValue: "₹3,50,000",
    numericValue: 350000,
    source: "Direct Referral",
    status: "New Inquiry",
    assignedInspector: "Inspector Rajesh Sharma",
    createdDate: "2026-09-22",
  },
  {
    id: "LD-505",
    facilityName: "CyberCity IT Park Block 4",
    facilityType: "Tech Park",
    contactPerson: "Priya Nair",
    contactEmail: "priya.nair@cybercity-tech.com",
    contactPhone: "+91 99401 22899",
    equipmentType: "Smart Destination Control Lifts",
    unitsCount: 16,
    auditType: "Annual Safety Audit",
    estimatedValue: "₹5,40,000",
    numericValue: 540000,
    source: "Annual Renewal",
    status: "Approved & Certified",
    assignedInspector: "Inspector Meera Joshi",
    createdDate: "2026-09-10",
  },
  {
    id: "LD-506",
    facilityName: "Radisson Blu Convention Center",
    facilityType: "Commercial Complex",
    contactPerson: "Manish Chawla",
    contactEmail: "m.chawla@radissonblu-events.in",
    contactPhone: "+91 98104 67012",
    equipmentType: "Panoramic Glass Lifts & Service Elevators",
    unitsCount: 6,
    auditType: "Annual Safety Audit",
    estimatedValue: "₹1,95,000",
    numericValue: 195000,
    source: "Inbound Call",
    status: "Audit Scheduled",
    assignedInspector: "Inspector Amitav Sen",
    createdDate: "2026-09-21",
  },
  {
    id: "LD-507",
    facilityName: "Max Super Specialty Hospital",
    facilityType: "Hospital",
    contactPerson: "Col. Sanjeev Roy (Retd.)",
    contactEmail: "ops@maxhealthcare-west.org",
    contactPhone: "+91 98119 55432",
    equipmentType: "Hydraulic Cleanroom Lifts",
    unitsCount: 5,
    auditType: "Emergency Inspection",
    estimatedValue: "₹1,80,000",
    numericValue: 180000,
    source: "Government Portal",
    status: "Approved & Certified",
    assignedInspector: "Inspector Meera Joshi",
    createdDate: "2026-09-08",
  },
  {
    id: "LD-508",
    facilityName: "Vajra Industrial Logistics Hub",
    facilityType: "Tech Park",
    contactPerson: "Gurpreet Singh",
    contactEmail: "gurpreet@vajralogistics.com",
    contactPhone: "+91 98722 43210",
    equipmentType: "Heavy Freight Elevators (5 Ton Capacity)",
    unitsCount: 4,
    auditType: "New Commissioning",
    estimatedValue: "₹3,10,000",
    numericValue: 310000,
    source: "Direct Referral",
    status: "Quotation Sent",
    assignedInspector: "Senior Eng. Harish Chander",
    createdDate: "2026-09-19",
  },
];

export default function LeadsTable() {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [facilityFilter, setFacilityFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<keyof LeadItem>("createdDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lead Form State
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityType, setNewFacilityType] = useState<LeadItem["facilityType"]>("Commercial Complex");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newEquipmentType, setNewEquipmentType] = useState("Passenger Lifts & Escalators");
  const [newAuditType, setNewAuditType] = useState<LeadItem["auditType"]>("Annual Safety Audit");
  const [newEstimatedValue, setNewEstimatedValue] = useState("₹2,50,000");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleSort = (field: keyof LeadItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchTerm === "" ||
        lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.assignedInspector.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      const matchesFacility = facilityFilter === "ALL" || lead.facilityType === facilityFilter;

      return matchesSearch && matchesStatus && matchesFacility;
    });
  }, [leads, searchTerm, statusFilter, facilityFilter]);

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredLeads, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName || !newContactPerson) {
      showToast("Please provide both Facility Name and Contact Person");
      return;
    }

    const newLead: LeadItem = {
      id: `LD-${500 + leads.length + 1}`,
      facilityName: newFacilityName,
      facilityType: newFacilityType,
      contactPerson: newContactPerson,
      contactEmail: `${newContactPerson.toLowerCase().replace(/\s+/g, ".")}@${newFacilityName.toLowerCase().replace(/[^a-z]/g, "")}.in`,
      contactPhone: newContactPhone || "+91 98000 12345",
      equipmentType: newEquipmentType,
      unitsCount: 6,
      auditType: newAuditType,
      estimatedValue: newEstimatedValue,
      numericValue: parseInt(newEstimatedValue.replace(/[^0-9]/g, "")) || 250000,
      source: "Government Portal",
      status: "New Inquiry",
      assignedInspector: "Inspector Rajesh Sharma",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);
    setNewFacilityName("");
    setNewContactPerson("");
    setNewContactPhone("");
    showToast(`Lead created for ${newLead.facilityName} (${newLead.id})`);
  };

  const getStatusBadge = (status: LeadItem["status"]) => {
    switch (status) {
      case "Approved & Certified":
        return "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400 border-success-200 dark:border-success-800";
      case "Audit Scheduled":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Quotation Sent":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "Under Review":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "New Inquiry":
      default:
        return "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 border-brand-200 dark:border-brand-800";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900/70">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-99999 flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-theme-xl dark:bg-white dark:text-gray-900 animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-success-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Inspection &amp; Certification Leads Pipeline
              </h3>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-400">
                NLETA Active Pipeline
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Manage incoming lift &amp; escalator testing requests, compliance audits, and commercial certifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search facility, contact, ID..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 ps-9 pe-3 text-xs text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-800/80 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="ALL">All Pipeline Stages</option>
              <option value="New Inquiry">New Inquiry</option>
              <option value="Audit Scheduled">Audit Scheduled</option>
              <option value="Under Review">Under Review</option>
              <option value="Quotation Sent">Quotation Sent</option>
              <option value="Approved & Certified">Approved &amp; Certified</option>
            </select>

            {/* Facility Filter */}
            <select
              value={facilityFilter}
              onChange={(e) => {
                setFacilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="ALL">All Facility Types</option>
              <option value="Commercial Complex">Commercial Complex</option>
              <option value="Hospital">Hospital</option>
              <option value="Transit Hub">Transit Hub</option>
              <option value="Residential Tower">Residential Tower</option>
              <option value="Tech Park">Tech Park</option>
            </select>

            {/* Add Lead Button */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
              }
            >
              New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-start text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <th
                onClick={() => handleSort("id")}
                className="cursor-pointer px-5 py-3.5 text-left font-semibold hover:text-brand-600"
              >
                Lead ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("facilityName")}
                className="cursor-pointer px-5 py-3.5 text-left font-semibold hover:text-brand-600"
              >
                Facility &amp; Contact {sortField === "facilityName" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("equipmentType")}
                className="cursor-pointer px-5 py-3.5 text-left font-semibold hover:text-brand-600"
              >
                Equipment / Scope {sortField === "equipmentType" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("auditType")}
                className="cursor-pointer px-5 py-3.5 text-left font-semibold hover:text-brand-600"
              >
                Audit Type
              </th>
              <th
                onClick={() => handleSort("numericValue")}
                className="cursor-pointer px-5 py-3.5 text-right font-semibold hover:text-brand-600"
              >
                Estimated Fee {sortField === "numericValue" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="cursor-pointer px-5 py-3.5 text-left font-semibold hover:text-brand-600"
              >
                Pipeline Stage {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-5 py-3.5 text-center font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="cursor-pointer transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                >
                  {/* Lead ID */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                      {lead.id}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      {lead.createdDate}
                    </span>
                  </td>

                  {/* Facility & Contact */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 font-bold text-xs dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-900/40">
                        {lead.facilityName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="block font-semibold text-gray-800 dark:text-white">
                          {lead.facilityName}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {lead.contactPerson} &bull; {lead.contactPhone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Equipment Type */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="block font-medium text-gray-700 dark:text-gray-300">
                      {lead.equipmentType}
                    </span>
                    <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {lead.unitsCount} Units &bull; {lead.facilityType}
                    </span>
                  </td>

                  {/* Audit Type */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {lead.auditType}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      via {lead.source}
                    </span>
                  </td>

                  {/* Estimated Value */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {lead.estimatedValue}
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      Est. Inspection Fee
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {lead.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        title="View Full Profile"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Audit schedule email dispatched for ${lead.facilityName}`);
                        }}
                        title="Schedule Field Inspector"
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-success-600 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-500">
                  No inspection leads matched your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Theme-based Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={sortedLeads.length}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={(p) => setCurrentPage(p)}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      {/* Modal: Lead Detail Drawer */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 font-bold text-sm">
                  {selectedLead.facilityName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {selectedLead.facilityName}
                  </h4>
                  <span className="text-xs font-mono text-red-600 font-semibold">
                    {selectedLead.id} &bull; {selectedLead.facilityType}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-gray-400">Contact Person</span>
                <p className="font-semibold text-gray-800 dark:text-white text-sm mt-0.5">
                  {selectedLead.contactPerson}
                </p>
                <p className="text-gray-500">{selectedLead.contactEmail}</p>
                <p className="text-gray-500">{selectedLead.contactPhone}</p>
              </div>

              <div>
                <span className="text-gray-400">Assigned Inspector</span>
                <p className="font-semibold text-gray-800 dark:text-white text-sm mt-0.5">
                  {selectedLead.assignedInspector}
                </p>
                <span className="text-xs text-brand-600 font-medium">NLETA Certified Field Officer</span>
              </div>

              <div className="col-span-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                <span className="text-gray-400 font-medium">Equipment Scope</span>
                <p className="font-semibold text-gray-800 dark:text-white mt-1">
                  {selectedLead.equipmentType} ({selectedLead.unitsCount} total units)
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-gray-500">Audit Classification:</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{selectedLead.auditType}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gray-500">Estimated Value:</span>
                  <span className="font-bold text-success-600 dark:text-success-400">{selectedLead.estimatedValue}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Button size="sm" variant="outline" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  showToast(`Inspection notice sent to ${selectedLead.contactPerson}`);
                  setSelectedLead(null);
                }}
              >
                Send Audit Notification
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Lead */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Register New NLETA Inspection Lead
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Facility / Building Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phoenix Palassio Mall, Hazratganj"
                  value={newFacilityName}
                  onChange={(e) => setNewFacilityName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Facility Type
                  </label>
                  <select
                    value={newFacilityType}
                    onChange={(e) => setNewFacilityType(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                  >
                    <option value="Commercial Complex">Commercial Complex</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Transit Hub">Transit Hub</option>
                    <option value="Residential Tower">Residential Tower</option>
                    <option value="Tech Park">Tech Park</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Audit Category
                  </label>
                  <select
                    value={newAuditType}
                    onChange={(e) => setNewAuditType(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                  >
                    <option value="Annual Safety Audit">Annual Safety Audit</option>
                    <option value="New Commissioning">New Commissioning</option>
                    <option value="Emergency Inspection">Emergency Inspection</option>
                    <option value="Modernization Testing">Modernization Testing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Chief Engineer / Estate Head"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98XXX XXXXX"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Equipment Details
                </label>
                <input
                  type="text"
                  value={newEquipmentType}
                  onChange={(e) => setNewEquipmentType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800 dark:bg-gray-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button size="sm" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
