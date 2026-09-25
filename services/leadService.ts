import {
  LeadItem,
  CreateLeadInput,
  UpdateLeadInput,
  LeadStats,
  LeadFilterOptions,
  LeadStatus,
} from "@/types/lead";

const STORAGE_KEY = "nleta_crm_leads_v2";
const LEADS_CHANGE_EVENT = "nleta_leads_updated";

import { initialMockLeads } from "@/data/leadsData";
export { initialMockLeads };

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

    const wonCount = leads.filter((l) => l.status === "Won").length;
    const underDiscussionCount = leads.filter((l) => l.status === "Under Discussion").length;
    const lostCount = leads.filter((l) => l.status === "Lost").length;

    const conversionRate =
      totalLeads > 0
        ? `${Math.round((wonCount / totalLeads) * 100 * 10) / 10}%`
        : "0%";

    const statusBreakdown: Record<LeadStatus, number> = {
      Won: 0,
      "Under Discussion": 0,
      Lost: 0,
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
      wonCount,
      underDiscussionCount,
      lostCount,
      conversionRate,
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
