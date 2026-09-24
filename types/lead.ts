export type FacilityType =
  | "Commercial Complex"
  | "Hospital"
  | "Transit Hub"
  | "Residential Tower"
  | "Tech Park"
  | "Industrial / Warehouse"
  | "Educational Campus";

export type AuditType =
  | "Annual Safety Audit"
  | "New Commissioning"
  | "Modernization Testing"
  | "Emergency Inspection";

export type LeadSource =
  | "Government Portal"
  | "Inbound Call"
  | "Direct Referral"
  | "Annual Renewal"
  | "Website Form";

export type LeadStatus =
  | "New Inquiry"
  | "Audit Scheduled"
  | "Under Review"
  | "Quotation Sent"
  | "Approved & Certified"
  | "Rejected / Inactive";

export type LeadPriority = "High" | "Medium" | "Low";

export interface LeadItem {
  id: string;
  facilityName: string;
  facilityType: FacilityType;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  equipmentType: string;
  unitsCount: number;
  auditType: AuditType;
  estimatedValue: string;
  numericValue: number;
  source: LeadSource;
  status: LeadStatus;
  priority?: LeadPriority;
  assignedInspector: string;
  location?: string;
  createdDate: string;
  scheduledDate?: string;
  notes?: string;
}

export type CreateLeadInput = Omit<LeadItem, "id" | "createdDate"> & {
  createdDate?: string;
};

export type UpdateLeadInput = Partial<Omit<LeadItem, "id">>;

export interface LeadStats {
  totalLeads: number;
  activePipelineValue: number;
  formattedPipelineValue: string;
  scheduledAudits: number;
  approvedCertified: number;
  conversionRate: string;
  newInquiries: number;
  statusBreakdown: Record<LeadStatus, number>;
}

export interface LeadFilterOptions {
  search?: string;
  status?: string;
  facilityType?: string;
  auditType?: string;
}
