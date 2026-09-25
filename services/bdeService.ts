import {
  BdeItem,
  CreateBdeInput,
  UpdateBdeInput,
  BdeStats,
  BdeStatus,
} from "@/types/bde";

const STORAGE_KEY = "nleta_crm_bdes_v1";
const BDES_CHANGE_EVENT = "nleta_bdes_updated";

import { initialMockBdes } from "@/data/bdeData";
export { initialMockBdes };

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
