import {
  BDE,
  BdeFilterOptions,
  BdeListResponse,
  BdeStats,
  CreateBdeDTO,
  UpdateBdeDTO,
} from "@/types/bde";

const STORAGE_KEY = "crm_bde_records_v1";

const initialBdes: BDE[] = [
  {
    id: "bde-1",
    bdeId: "BDE-1001",
    name: "Alex Mercer",
    email: "alex.mercer@nletacrm.com",
    phone: "+1 (555) 234-5678",
    role: "Senior BDE",
    department: "Enterprise Sales",
    territory: "North America (East)",
    monthlyQuota: 75000,
    achievedRevenue: 62500,
    leadsAssigned: 42,
    dealsClosed: 14,
    conversionRate: 33.3,
    status: "Active",
    joinedDate: "2024-01-15",
    notes: "Top performer for Q1 enterprise software expansions and renewals.",
  },
  {
    id: "bde-2",
    bdeId: "BDE-1002",
    name: "Sophia Martinez",
    email: "sophia.m@nletacrm.com",
    phone: "+1 (555) 345-6789",
    role: "Business Development Executive",
    department: "Inbound Sales",
    territory: "West Coast",
    monthlyQuota: 50000,
    achievedRevenue: 48000,
    leadsAssigned: 55,
    dealsClosed: 21,
    conversionRate: 38.2,
    status: "Active",
    joinedDate: "2024-03-01",
    notes: "Expert at inbound qualification and fast demo scheduling.",
  },
  {
    id: "bde-3",
    bdeId: "BDE-1003",
    name: "Liam O'Connor",
    email: "liam.oc@nletacrm.com",
    phone: "+1 (555) 456-7890",
    role: "Lead BDE",
    department: "Strategic Accounts",
    territory: "EMEA",
    monthlyQuota: 90000,
    achievedRevenue: 72000,
    leadsAssigned: 30,
    dealsClosed: 9,
    conversionRate: 30.0,
    status: "Active",
    joinedDate: "2023-11-10",
    notes: "Managing EMEA cross-border strategic client partnerships.",
  },
  {
    id: "bde-4",
    bdeId: "BDE-1004",
    name: "Elena Rostova",
    email: "elena.r@nletacrm.com",
    phone: "+1 (555) 567-8901",
    role: "Business Development Executive",
    department: "Outbound Outreach",
    territory: "APAC",
    monthlyQuota: 45000,
    achievedRevenue: 28000,
    leadsAssigned: 48,
    dealsClosed: 11,
    conversionRate: 22.9,
    status: "Probation",
    joinedDate: "2024-06-15",
    notes: "Undergoing outbound pitch coaching; pipeline growth is accelerating.",
  },
  {
    id: "bde-5",
    bdeId: "BDE-1005",
    name: "Devon Washington",
    email: "devon.w@nletacrm.com",
    phone: "+1 (555) 678-9012",
    role: "Senior BDE",
    department: "Mid-Market",
    territory: "Midwest",
    monthlyQuota: 60000,
    achievedRevenue: 64500,
    leadsAssigned: 38,
    dealsClosed: 16,
    conversionRate: 42.1,
    status: "Active",
    joinedDate: "2023-08-20",
    notes: "Exceeded quota 4 consecutive months. Potential team lead candidate.",
  },
  {
    id: "bde-6",
    bdeId: "BDE-1006",
    name: "Chloe Bennett",
    email: "chloe.b@nletacrm.com",
    phone: "+1 (555) 789-0123",
    role: "Junior BDE",
    department: "Inbound Sales",
    territory: "Southeast",
    monthlyQuota: 40000,
    achievedRevenue: 18500,
    leadsAssigned: 28,
    dealsClosed: 6,
    conversionRate: 21.4,
    status: "On Leave",
    joinedDate: "2024-04-10",
    notes: "On planned parental leave until next month.",
  },
  {
    id: "bde-7",
    bdeId: "BDE-1007",
    name: "Marcus Vance",
    email: "marcus.v@nletacrm.com",
    phone: "+1 (555) 890-1234",
    role: "Business Development Executive",
    department: "Enterprise Sales",
    territory: "Southwest",
    monthlyQuota: 70000,
    achievedRevenue: 51000,
    leadsAssigned: 35,
    dealsClosed: 10,
    conversionRate: 28.6,
    status: "Active",
    joinedDate: "2024-02-18",
    notes: "Handling energy and manufacturing enterprise deals.",
  },
  {
    id: "bde-8",
    bdeId: "BDE-1008",
    name: "Amina Al-Mansoor",
    email: "amina.m@nletacrm.com",
    phone: "+1 (555) 901-2345",
    role: "Senior BDE",
    department: "Strategic Accounts",
    territory: "Global Accounts",
    monthlyQuota: 85000,
    achievedRevenue: 89000,
    leadsAssigned: 26,
    dealsClosed: 12,
    conversionRate: 46.2,
    status: "Active",
    joinedDate: "2023-05-12",
    notes: "Highest quota attainment in Q2 across global accounts.",
  },
];

// Helper to access in-memory copy during SSR or localStorage in browser
function getStoredBdes(): BDE[] {
  if (typeof window === "undefined") {
    return initialBdes;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBdes));
      return initialBdes;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read BDE records from localStorage:", error);
    return initialBdes;
  }
}

function saveStoredBdes(bdes: BDE[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bdes));
    } catch (error) {
      console.error("Failed to persist BDE records to localStorage:", error);
    }
  }
}

export const bdeService = {
  /**
   * Fetch all BDEs with optional search, status/department filtering, and pagination
   */
  async getBdes(filters?: BdeFilterOptions): Promise<BdeListResponse> {
    // Artificial small tick to simulate realistic service latency without lag
    await new Promise((resolve) => setTimeout(resolve, 50));

    let items = [...getStoredBdes()];

    if (filters) {
      const { search, status, department } = filters;

      if (search && search.trim() !== "") {
        const query = search.toLowerCase().trim();
        items = items.filter(
          (bde) =>
            bde.name.toLowerCase().includes(query) ||
            bde.bdeId?.toLowerCase().includes(query) ||
            bde.email.toLowerCase().includes(query) ||
            bde.role.toLowerCase().includes(query) ||
            bde.territory.toLowerCase().includes(query) ||
            bde.department.toLowerCase().includes(query)
        );
      }

      if (status && status !== "ALL") {
        items = items.filter((bde) => bde.status === status);
      }

      if (department && department !== "ALL") {
        items = items.filter((bde) => bde.department === department);
      }
    }

    const total = items.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      total,
      page,
      totalPages,
    };
  },

  /**
   * Fetch a single BDE by ID or bdeId
   */
  async getBdeById(id: string): Promise<BDE | null> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const items = getStoredBdes();
    const found = items.find((item) => item.id === id || item.bdeId === id);
    return found || null;
  },

  /**
   * Create a new BDE executive
   */
  async createBde(dto: CreateBdeDTO): Promise<BDE> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const items = getStoredBdes();

    // Auto-generate ID and BDE code
    const count = items.length + 1;
    const nextCodeNumber = 1000 + count;
    const id = `bde-${Date.now()}`;
    const bdeId = `BDE-${nextCodeNumber}`;

    const leads = dto.leadsAssigned ?? 0;
    const deals = dto.dealsClosed ?? 0;
    const conversion =
      leads > 0 ? Number(((deals / leads) * 100).toFixed(1)) : 0;

    const newBde: BDE = {
      id,
      bdeId,
      name: dto.name.trim(),
      email: dto.email.trim(),
      phone: dto.phone.trim(),
      role: dto.role.trim(),
      department: dto.department,
      territory: dto.territory.trim(),
      monthlyQuota: Number(dto.monthlyQuota) || 0,
      achievedRevenue: Number(dto.achievedRevenue) || 0,
      leadsAssigned: leads,
      dealsClosed: deals,
      conversionRate: conversion,
      status: dto.status,
      joinedDate:
        dto.joinedDate || new Date().toISOString().split("T")[0],
      notes: dto.notes?.trim() || "",
    };

    const updated = [newBde, ...items];
    saveStoredBdes(updated);
    return newBde;
  },

  /**
   * Update an existing BDE record
   */
  async updateBde(id: string, dto: UpdateBdeDTO): Promise<BDE> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const items = getStoredBdes();
    const index = items.findIndex(
      (item) => item.id === id || item.bdeId === id
    );

    if (index === -1) {
      throw new Error(`BDE with ID "${id}" was not found.`);
    }

    const current = items[index];

    const leads =
      dto.leadsAssigned !== undefined
        ? Number(dto.leadsAssigned)
        : current.leadsAssigned;
    const deals =
      dto.dealsClosed !== undefined
        ? Number(dto.dealsClosed)
        : current.dealsClosed;
    const conversion =
      leads > 0 ? Number(((deals / leads) * 100).toFixed(1)) : 0;

    const updatedBde: BDE = {
      ...current,
      name: dto.name !== undefined ? dto.name.trim() : current.name,
      email: dto.email !== undefined ? dto.email.trim() : current.email,
      phone: dto.phone !== undefined ? dto.phone.trim() : current.phone,
      role: dto.role !== undefined ? dto.role.trim() : current.role,
      department: dto.department !== undefined ? dto.department : current.department,
      territory:
        dto.territory !== undefined ? dto.territory.trim() : current.territory,
      monthlyQuota:
        dto.monthlyQuota !== undefined
          ? Number(dto.monthlyQuota)
          : current.monthlyQuota,
      achievedRevenue:
        dto.achievedRevenue !== undefined
          ? Number(dto.achievedRevenue)
          : current.achievedRevenue,
      leadsAssigned: leads,
      dealsClosed: deals,
      conversionRate: conversion,
      status: dto.status !== undefined ? dto.status : current.status,
      joinedDate:
        dto.joinedDate !== undefined ? dto.joinedDate : current.joinedDate,
      notes: dto.notes !== undefined ? dto.notes.trim() : current.notes,
    };

    items[index] = updatedBde;
    saveStoredBdes(items);
    return updatedBde;
  },

  /**
   * Delete a BDE record
   */
  async deleteBde(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const items = getStoredBdes();
    const filtered = items.filter(
      (item) => item.id !== id && item.bdeId !== id
    );

    if (filtered.length === items.length) {
      return false;
    }

    saveStoredBdes(filtered);
    return true;
  },

  /**
   * Compute aggregated statistics for the BDE pipeline
   */
  async getBdeStats(): Promise<BdeStats> {
    const items = getStoredBdes();

    const totalBdes = items.length;
    const activeBdes = items.filter((b) => b.status === "Active").length;
    const totalTargetQuota = items.reduce(
      (acc, b) => acc + (b.monthlyQuota || 0),
      0
    );
    const totalAchievedRevenue = items.reduce(
      (acc, b) => acc + (b.achievedRevenue || 0),
      0
    );
    const totalDealsClosed = items.reduce(
      (acc, b) => acc + (b.dealsClosed || 0),
      0
    );

    const averageQuotaAttainment =
      totalTargetQuota > 0
        ? Number(((totalAchievedRevenue / totalTargetQuota) * 100).toFixed(1))
        : 0;

    return {
      totalBdes,
      activeBdes,
      totalTargetQuota,
      totalAchievedRevenue,
      averageQuotaAttainment,
      totalDealsClosed,
    };
  },

  /**
   * Reset data to initial demo state
   */
  async resetBdes(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBdes));
    }
  },
};
