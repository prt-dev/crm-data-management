import {
  BdeItem,
  CreateBdeInput,
  UpdateBdeInput,
  BdeStats,
  BdeStatus,
} from "@/types/bde";

const STORAGE_KEY = "nleta_crm_bdes_v1";
const BDES_CHANGE_EVENT = "nleta_bdes_updated";

export const initialMockBdes: BdeItem[] = [
  {
    id: "BDE-201",
    employeeCode: "NLETA-BD-011",
    fullName: "Vikram Malhotra",
    email: "vikram.malhotra@nleta.gov.in",
    phone: "+91 98112 45890",
    designation: "Enterprise Account Director",
    region: "Delhi NCR",
    status: "Active",
    quarterlyTarget: "₹ 75,00,000",
    numericTarget: 7500000,
    achievedRevenue: "₹ 68,50,000",
    numericAchieved: 6850000,
    conversionRate: 84,
    activeLeadsCount: 14,
    closedDealsCount: 22,
    joinedDate: "2023-03-15",
    notes: "Top performer for commercial real estate contracts and Metro transit inspection accounts.",
  },
  {
    id: "BDE-202",
    employeeCode: "NLETA-BD-014",
    fullName: "Pooja Singhania",
    email: "pooja.singhania@nleta.gov.in",
    phone: "+91 98201 67234",
    designation: "Regional Sales Lead",
    region: "Mumbai Metro",
    status: "Active",
    quarterlyTarget: "₹ 60,00,000",
    numericTarget: 6000000,
    achievedRevenue: "₹ 54,20,000",
    numericAchieved: 5420000,
    conversionRate: 79,
    activeLeadsCount: 11,
    closedDealsCount: 18,
    joinedDate: "2023-08-01",
    notes: "Specializes in luxury hotel chains, airport terminals, and high-rise commercial towers.",
  },
  {
    id: "BDE-203",
    employeeCode: "NLETA-BD-019",
    fullName: "Karthik Subramanian",
    email: "karthik.s@nleta.gov.in",
    phone: "+91 98450 33211",
    designation: "Senior BD Manager",
    region: "Bengaluru Tech Corridor",
    status: "Active",
    quarterlyTarget: "₹ 55,00,000",
    numericTarget: 5500000,
    achievedRevenue: "₹ 49,80,000",
    numericAchieved: 4980000,
    conversionRate: 76,
    activeLeadsCount: 9,
    closedDealsCount: 16,
    joinedDate: "2024-01-10",
    notes: "Manages IT tech parks, multinational campuses, and hospital network elevators.",
  },
  {
    id: "BDE-204",
    employeeCode: "NLETA-BD-022",
    fullName: "Ananya Deshmukh",
    email: "ananya.d@nleta.gov.in",
    phone: "+91 99234 88129",
    designation: "Key Account Manager",
    region: "Pune & West",
    status: "Active",
    quarterlyTarget: "₹ 45,00,000",
    numericTarget: 4500000,
    achievedRevenue: "₹ 38,00,000",
    numericAchieved: 3800000,
    conversionRate: 72,
    activeLeadsCount: 8,
    closedDealsCount: 12,
    joinedDate: "2024-04-18",
    notes: "Focuses on manufacturing plant freight lifts and automotive assembly elevators.",
  },
  {
    id: "BDE-205",
    employeeCode: "NLETA-BD-027",
    fullName: "Rohan Varma",
    email: "rohan.varma@nleta.gov.in",
    phone: "+91 98310 99441",
    designation: "Business Development Associate",
    region: "Kolkata & East",
    status: "Probation",
    quarterlyTarget: "₹ 35,00,000",
    numericTarget: 3500000,
    achievedRevenue: "₹ 24,50,000",
    numericAchieved: 2450000,
    conversionRate: 64,
    activeLeadsCount: 7,
    closedDealsCount: 7,
    joinedDate: "2024-09-01",
    notes: "Under onboarding probation; expanding municipal transit and shopping mall portfolios.",
  },
  {
    id: "BDE-206",
    employeeCode: "NLETA-BD-008",
    fullName: "Meenakshi Sundaram",
    email: "meenakshi.s@nleta.gov.in",
    phone: "+91 94440 12890",
    designation: "Key Account Manager",
    region: "Chennai & South",
    status: "On Leave",
    quarterlyTarget: "₹ 50,00,000",
    numericTarget: 5000000,
    achievedRevenue: "₹ 41,00,000",
    numericAchieved: 4100000,
    conversionRate: 74,
    activeLeadsCount: 4,
    closedDealsCount: 14,
    joinedDate: "2023-06-20",
    notes: "On medical leave; temporary accounts reassigned to Karthik Subramanian.",
  },
];

export function formatINR(val: number): string {
  return "₹ " + val.toLocaleString("en-IN");
}

class BdeService {
  private getStoredBdes(): BdeItem[] {
    if (typeof window === "undefined") {
      return initialMockBdes;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockBdes));
        return initialMockBdes;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read BDEs from localStorage:", e);
      return initialMockBdes;
    }
  }

  private saveBdes(bdes: BdeItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bdes));
      window.dispatchEvent(new Event(BDES_CHANGE_EVENT));
    } catch (e) {
      console.error("Failed to save BDEs to localStorage:", e);
    }
  }

  public async getAllBdes(): Promise<BdeItem[]> {
    return this.getStoredBdes();
  }

  public async getBdeById(id: string): Promise<BdeItem | null> {
    const bdes = this.getStoredBdes();
    const found = bdes.find((b) => b.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }

  public async createBde(input: CreateBdeInput): Promise<BdeItem> {
    const bdes = this.getStoredBdes();

    // Generate new BDE ID
    let maxIdNum = 200;
    bdes.forEach((b) => {
      const match = b.id.match(/BDE-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxIdNum) maxIdNum = num;
      }
    });
    const newId = `BDE-${maxIdNum + 1}`;

    const newBde: BdeItem = {
      ...input,
      id: newId,
      joinedDate: input.joinedDate || new Date().toISOString().split("T")[0],
      quarterlyTarget: input.quarterlyTarget || formatINR(input.numericTarget || 0),
      achievedRevenue: input.achievedRevenue || formatINR(input.numericAchieved || 0),
    };

    const updated = [newBde, ...bdes];
    this.saveBdes(updated);
    return newBde;
  }

  public async updateBde(id: string, input: UpdateBdeInput): Promise<BdeItem> {
    const bdes = this.getStoredBdes();
    const index = bdes.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      throw new Error(`BDE executive with ID "${id}" was not found.`);
    }

    const current = bdes[index];
    const numericTarget = input.numericTarget !== undefined ? input.numericTarget : current.numericTarget;
    const numericAchieved = input.numericAchieved !== undefined ? input.numericAchieved : current.numericAchieved;

    const updatedBde: BdeItem = {
      ...current,
      ...input,
      numericTarget,
      numericAchieved,
      quarterlyTarget: input.quarterlyTarget || formatINR(numericTarget),
      achievedRevenue: input.achievedRevenue || formatINR(numericAchieved),
    };

    bdes[index] = updatedBde;
    this.saveBdes(bdes);
    return updatedBde;
  }

  public async deleteBde(id: string): Promise<boolean> {
    const bdes = this.getStoredBdes();
    const filtered = bdes.filter((b) => b.id.toLowerCase() !== id.toLowerCase());
    if (filtered.length === bdes.length) return false;
    this.saveBdes(filtered);
    return true;
  }

  public async getBdeStats(): Promise<BdeStats> {
    const bdes = this.getStoredBdes();

    let totalTarget = 0;
    let totalAchieved = 0;
    let totalConversion = 0;

    const statusBreakdown: Record<BdeStatus, number> = {
      Active: 0,
      "On Leave": 0,
      Probation: 0,
      Inactive: 0,
    };

    bdes.forEach((b) => {
      totalTarget += b.numericTarget || 0;
      totalAchieved += b.numericAchieved || 0;
      totalConversion += b.conversionRate || 0;
      if (statusBreakdown[b.status] !== undefined) {
        statusBreakdown[b.status]++;
      }
    });

    const averageConversionRate = bdes.length > 0 ? Math.round(totalConversion / bdes.length) : 0;

    return {
      totalExecutives: bdes.length,
      activeExecutives: statusBreakdown["Active"] || 0,
      totalTarget,
      totalAchieved,
      formattedTotalRevenue: formatINR(totalAchieved),
      formattedTotalTarget: formatINR(totalTarget),
      averageConversionRate,
      statusBreakdown,
    };
  }

  public subscribe(listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(BDES_CHANGE_EVENT, listener);
    return () => {
      window.removeEventListener(BDES_CHANGE_EVENT, listener);
    };
  }
}

export const bdeService = new BdeService();
