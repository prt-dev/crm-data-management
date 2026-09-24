import {
  LeadItem,
  CreateLeadInput,
  UpdateLeadInput,
  LeadStats,
  LeadFilterOptions,
  LeadStatus,
} from "@/types/lead";

const STORAGE_KEY = "nleta_crm_leads_v1";
const LEADS_CHANGE_EVENT = "nleta_leads_updated";

export const initialMockLeads: LeadItem[] = [
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
    priority: "High",
    assignedBdeId: "BDE-201",
    assignedBdeName: "Vikram Malhotra",
    location: "Greater Noida, Uttar Pradesh",
    createdDate: "2026-09-18",
    scheduledDate: "2026-09-28",
    notes: "Mandatory annual inspection for 10 escalators and 4 high-speed glass observation elevators.",
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
    priority: "High",
    assignedBdeId: "BDE-202",
    assignedBdeName: "Pooja Singhania",
    location: "New Delhi, NCR",
    createdDate: "2026-09-20",
    scheduledDate: "2026-09-26",
    notes: "Critical emergency inspection requested following seismic sensor recalibration.",
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
    priority: "High",
    assignedBdeId: "BDE-201",
    assignedBdeName: "Vikram Malhotra",
    location: "Lucknow, Uttar Pradesh",
    createdDate: "2026-09-12",
    scheduledDate: "2026-10-02",
    notes: "Full safety commissioning clearance before official opening of Terminal 2 subway interconnect.",
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
    priority: "Medium",
    assignedBdeId: "BDE-203",
    assignedBdeName: "Karthik Subramanian",
    location: "Gurugram, Haryana",
    createdDate: "2026-09-22",
    scheduledDate: "2026-10-05",
    notes: "Client replacing legacy drive controls with regenerative VFD drives; requires BIS code verification.",
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
    priority: "Medium",
    assignedBdeId: "BDE-201",
    assignedBdeName: "Vikram Malhotra",
    location: "Bengaluru, Karnataka",
    createdDate: "2026-09-10",
    scheduledDate: "2026-09-16",
    notes: "Full clearance certificate issued valid until September 2027.",
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
    priority: "Low",
    assignedBdeId: "BDE-202",
    assignedBdeName: "Pooja Singhania",
    location: "Jaipur, Rajasthan",
    createdDate: "2026-09-21",
    scheduledDate: "2026-09-30",
    notes: "Annual certification required ahead of International Trade Summit.",
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
    priority: "High",
    location: "Saket, New Delhi",
    createdDate: "2026-09-08",
    scheduledDate: "2026-09-14",
    notes: "Urgent pressure valve testing completed. Clean safety report issued.",
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
    priority: "Medium",
    location: "Faridabad, Haryana",
    createdDate: "2026-09-19",
    scheduledDate: "2026-10-08",
    notes: "Quotation for dynamic brake drop test and static overload certification submitted.",
  },
];

// INR Currency Formatter Helper
export function formatINR(value: number): string {
  if (isNaN(value)) return "₹0";
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Format exact Indian Rupee string like ₹4,20,000
export function formatStandardINR(value: number): string {
  if (isNaN(value)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Parse string currency to number
export function parseINR(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Internal Storage Helper
function getStoredLeads(): LeadItem[] {
  if (typeof window === "undefined") {
    return initialMockLeads;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockLeads));
      return initialMockLeads;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockLeads));
      return initialMockLeads;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading leads from storage:", err);
    return initialMockLeads;
  }
}

function saveLeadsToStorage(leads: LeadItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new Event(LEADS_CHANGE_EVENT));
  } catch (err) {
    console.error("Error writing leads to storage:", err);
  }
}

// Generate unique lead ID
function generateNextLeadId(leads: LeadItem[]): string {
  const ids = leads
    .map((l) => {
      const match = l.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxId = ids.length > 0 ? Math.max(...ids) : 500;
  return `LD-${maxId + 1}`;
}

export const leadService = {
  /**
   * Fetch all leads with optional filtering
   */
  async getAllLeads(filters?: LeadFilterOptions): Promise<LeadItem[]> {
    const leads = getStoredLeads();
    if (!filters) return [...leads];

    return leads.filter((item) => {
      // 1. Text Search across facility, person, email, equipment, BDE
      if (filters.search && filters.search.trim() !== "") {
        const query = filters.search.toLowerCase();
        const matchesQuery =
          item.facilityName.toLowerCase().includes(query) ||
          item.contactPerson.toLowerCase().includes(query) ||
          item.contactEmail.toLowerCase().includes(query) ||
          item.contactPhone.toLowerCase().includes(query) ||
          item.equipmentType.toLowerCase().includes(query) ||
          (item.assignedBdeName && item.assignedBdeName.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query));

        if (!matchesQuery) return false;
      }

      // 2. Status Filter
      if (filters.status && filters.status !== "ALL") {
        if (item.status !== filters.status) return false;
      }

      // 3. Facility Type Filter
      if (filters.facilityType && filters.facilityType !== "ALL") {
        if (item.facilityType !== filters.facilityType) return false;
      }

      // 4. Audit Type Filter
      if (filters.auditType && filters.auditType !== "ALL") {
        if (item.auditType !== filters.auditType) return false;
      }

      return true;
    });
  },

  /**
   * Get single lead by ID
   */
  async getLeadById(id: string): Promise<LeadItem | null> {
    const leads = getStoredLeads();
    const found = leads.find((l) => l.id.toLowerCase() === id.toLowerCase());
    return found ? { ...found } : null;
  },

  /**
   * Create a new lead record
   */
  async createLead(input: CreateLeadInput): Promise<LeadItem> {
    const leads = getStoredLeads();
    const newId = generateNextLeadId(leads);
    const today = new Date().toISOString().split("T")[0];

    const numericVal =
      input.numericValue !== undefined
        ? input.numericValue
        : parseINR(input.estimatedValue || "0");

    const formattedVal =
      input.estimatedValue && input.estimatedValue.trim() !== ""
        ? input.estimatedValue
        : formatStandardINR(numericVal);

    const newLead: LeadItem = {
      ...input,
      id: newId,
      createdDate: input.createdDate || today,
      numericValue: numericVal,
      estimatedValue: formattedVal,
      status: input.status || "New Inquiry",
      priority: input.priority || "Medium",
    };

    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    return newLead;
  },

  /**
   * Update an existing lead record
   */
  async updateLead(id: string, updates: UpdateLeadInput): Promise<LeadItem> {
    const leads = getStoredLeads();
    const index = leads.findIndex((l) => l.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const current = leads[index];
    const numericVal =
      updates.numericValue !== undefined
        ? updates.numericValue
        : updates.estimatedValue !== undefined
        ? parseINR(updates.estimatedValue)
        : current.numericValue;

    const formattedVal =
      updates.estimatedValue !== undefined
        ? updates.estimatedValue
        : updates.numericValue !== undefined
        ? formatStandardINR(updates.numericValue)
        : current.estimatedValue;

    const updatedLead: LeadItem = {
      ...current,
      ...updates,
      id: current.id, // Never mutate ID
      numericValue: numericVal,
      estimatedValue: formattedVal,
    };

    leads[index] = updatedLead;
    saveLeadsToStorage(leads);
    return updatedLead;
  },

  /**
   * Delete a lead by ID
   */
  async deleteLead(id: string): Promise<boolean> {
    const leads = getStoredLeads();
    const filtered = leads.filter((l) => l.id.toLowerCase() !== id.toLowerCase());

    if (filtered.length === leads.length) {
      return false;
    }

    saveLeadsToStorage(filtered);
    return true;
  },

  /**
   * Get calculated real-time KPI statistics
   */
  async getLeadStats(): Promise<LeadStats> {
    const leads = getStoredLeads();
    const totalLeads = leads.length;

    const activePipelineValue = leads.reduce(
      (sum, l) => sum + (l.numericValue || 0),
      0
    );

    const scheduledAudits = leads.filter(
      (l) => l.status === "Audit Scheduled" || l.status === "Under Review"
    ).length;

    const approvedCertified = leads.filter(
      (l) => l.status === "Approved & Certified"
    ).length;

    const newInquiries = leads.filter(
      (l) => l.status === "New Inquiry"
    ).length;

    const conversionRate =
      totalLeads > 0
        ? `${Math.round((approvedCertified / totalLeads) * 100 * 10) / 10}%`
        : "0%";

    const statusBreakdown: Record<LeadStatus, number> = {
      "New Inquiry": 0,
      "Audit Scheduled": 0,
      "Under Review": 0,
      "Quotation Sent": 0,
      "Approved & Certified": 0,
      "Rejected / Inactive": 0,
    };

    leads.forEach((l) => {
      if (statusBreakdown[l.status] !== undefined) {
        statusBreakdown[l.status]++;
      }
    });

    return {
      totalLeads,
      activePipelineValue,
      formattedPipelineValue: formatINR(activePipelineValue),
      scheduledAudits,
      approvedCertified,
      conversionRate,
      newInquiries,
      statusBreakdown,
    };
  },

  /**
   * Reset data to default seed leads
   */
  async resetToDefault(): Promise<LeadItem[]> {
    saveLeadsToStorage(initialMockLeads);
    return [...initialMockLeads];
  },

  /**
   * Subscribe to lead updates across the application
   */
  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = () => callback();
    window.addEventListener(LEADS_CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(LEADS_CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

export default leadService;
