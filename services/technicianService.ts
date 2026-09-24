import {
  TechnicianItem,
  CreateTechnicianInput,
  UpdateTechnicianInput,
  TechnicianStats,
  TechnicianStatus,
} from "@/types/technician";

const STORAGE_KEY = "nleta_crm_technicians_v1";
const TECHNICIANS_CHANGE_EVENT = "nleta_technicians_updated";

export const initialMockTechnicians: TechnicianItem[] = [
  {
    id: "TECH-501",
    badgeNumber: "NLETA-T-101",
    fullName: "Rajesh Sharma",
    email: "rajesh.sharma@nleta.gov.in",
    phone: "+91 98110 54321",
    skillSpecialization: "Traction & High-Rise Lifts",
    certificationLevel: "Master Auditor (Lead Inspector)",
    operatingZone: "North Zone (Delhi/NCR)",
    status: "Available on Field",
    assignedAuditsCount: 6,
    completedAuditsCount: 142,
    safetyRating: 4.95,
    licenseExpiryDate: "2027-11-30",
    emergencyAvailable: true,
    joinedDate: "2021-02-10",
    notes: "Specialist in high-speed traction passenger lifts and rope elongation stress tests. BIS certified.",
  },
  {
    id: "TECH-502",
    badgeNumber: "NLETA-T-104",
    fullName: "Amitav Sen",
    email: "amitav.sen@nleta.gov.in",
    phone: "+91 98301 22345",
    skillSpecialization: "Heavy Duty Transit Escalators",
    certificationLevel: "Senior Certified Inspector (Level 3)",
    operatingZone: "East Zone (Kolkata)",
    status: "On-Site Inspection",
    assignedAuditsCount: 8,
    completedAuditsCount: 118,
    safetyRating: 4.88,
    licenseExpiryDate: "2027-06-15",
    emergencyAvailable: false,
    joinedDate: "2022-04-18",
    notes: "Conducting dynamic load testing and combplate sensor clearance audits on metro line stations.",
  },
  {
    id: "TECH-503",
    badgeNumber: "NLETA-T-109",
    fullName: "Meera Joshi",
    email: "meera.joshi@nleta.gov.in",
    phone: "+91 98220 98765",
    skillSpecialization: "Electronics & Speed Governors",
    certificationLevel: "Senior Certified Inspector (Level 3)",
    operatingZone: "West Zone (Mumbai/Pune)",
    status: "Available on Field",
    assignedAuditsCount: 4,
    completedAuditsCount: 96,
    safetyRating: 4.92,
    licenseExpiryDate: "2028-01-20",
    emergencyAvailable: true,
    joinedDate: "2022-09-01",
    notes: "Expertise in microcontroller safety circuits, overspeed trip calibration, and seismic sensor triggers.",
  },
  {
    id: "TECH-504",
    badgeNumber: "NLETA-T-115",
    fullName: "Harish Chander",
    email: "harish.chander@nleta.gov.in",
    phone: "+91 98452 44321",
    skillSpecialization: "Moving Walkways & Travelators",
    certificationLevel: "Certified Field Engineer (Level 2)",
    operatingZone: "South Zone (Bengaluru)",
    status: "In Transit",
    assignedAuditsCount: 5,
    completedAuditsCount: 78,
    safetyRating: 4.82,
    licenseExpiryDate: "2026-12-10",
    emergencyAvailable: true,
    joinedDate: "2023-05-15",
    notes: "En route to Kempegowda Airport Terminal 2 for routine step pallet alignment verification.",
  },
  {
    id: "TECH-505",
    badgeNumber: "NLETA-T-121",
    fullName: "Priya Sundaram",
    email: "priya.s@nleta.gov.in",
    phone: "+91 94441 55678",
    skillSpecialization: "Full-Scope Certified Inspector",
    certificationLevel: "Master Auditor (Lead Inspector)",
    operatingZone: "Chennai & Coastal Hub",
    status: "Available on Field",
    assignedAuditsCount: 7,
    completedAuditsCount: 134,
    safetyRating: 4.97,
    licenseExpiryDate: "2028-08-30",
    emergencyAvailable: true,
    joinedDate: "2021-08-01",
    notes: "Handles coastal environment corrosion inspections, rope degradation, and humidity-related brake wear.",
  },
  {
    id: "TECH-506",
    badgeNumber: "NLETA-T-128",
    fullName: "Mohammad Tanveer",
    email: "mohammad.t@nleta.gov.in",
    phone: "+91 98490 88712",
    skillSpecialization: "Hydraulic & Freight Systems",
    certificationLevel: "Certified Field Engineer (Level 2)",
    operatingZone: "South Central (Hyderabad)",
    status: "On Leave",
    assignedAuditsCount: 2,
    completedAuditsCount: 64,
    safetyRating: 4.79,
    licenseExpiryDate: "2027-03-25",
    emergencyAvailable: false,
    joinedDate: "2023-11-12",
    notes: "Annual leave until next Monday. Industrial freight elevator and hydraulic rupture valve specialist.",
  },
];

class TechnicianService {
  private getStoredTechnicians(): TechnicianItem[] {
    if (typeof window === "undefined") {
      return initialMockTechnicians;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockTechnicians));
        return initialMockTechnicians;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to read technicians from localStorage:", e);
      return initialMockTechnicians;
    }
  }

  private saveTechnicians(technicians: TechnicianItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(technicians));
      window.dispatchEvent(new Event(TECHNICIANS_CHANGE_EVENT));
    } catch (e) {
      console.error("Failed to save technicians to localStorage:", e);
    }
  }

  public async getAllTechnicians(): Promise<TechnicianItem[]> {
    return this.getStoredTechnicians();
  }

  public async getTechnicianById(id: string): Promise<TechnicianItem | null> {
    const list = this.getStoredTechnicians();
    const found = list.find((t) => t.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }

  public async createTechnician(input: CreateTechnicianInput): Promise<TechnicianItem> {
    const list = this.getStoredTechnicians();

    let maxIdNum = 500;
    list.forEach((t) => {
      const match = t.id.match(/TECH-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxIdNum) maxIdNum = num;
      }
    });
    const newId = `TECH-${maxIdNum + 1}`;

    const newTechnician: TechnicianItem = {
      ...input,
      id: newId,
      joinedDate: input.joinedDate || new Date().toISOString().split("T")[0],
      assignedAuditsCount: input.assignedAuditsCount ?? 0,
      completedAuditsCount: input.completedAuditsCount ?? 0,
      safetyRating: input.safetyRating ?? 4.8,
    };

    const updated = [newTechnician, ...list];
    this.saveTechnicians(updated);
    return newTechnician;
  }

  public async updateTechnician(
    id: string,
    input: UpdateTechnicianInput
  ): Promise<TechnicianItem> {
    const list = this.getStoredTechnicians();
    const index = list.findIndex((t) => t.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      throw new Error(`Technician with ID "${id}" was not found.`);
    }

    const current = list[index];
    const updated: TechnicianItem = {
      ...current,
      ...input,
    };

    list[index] = updated;
    this.saveTechnicians(list);
    return updated;
  }

  public async deleteTechnician(id: string): Promise<boolean> {
    const list = this.getStoredTechnicians();
    const filtered = list.filter((t) => t.id.toLowerCase() !== id.toLowerCase());
    if (filtered.length === list.length) return false;
    this.saveTechnicians(filtered);
    return true;
  }

  public async getTechnicianStats(): Promise<TechnicianStats> {
    const list = this.getStoredTechnicians();

    let totalRating = 0;
    let totalCompleted = 0;

    const statusBreakdown: Record<TechnicianStatus, number> = {
      "Available on Field": 0,
      "On-Site Inspection": 0,
      "In Transit": 0,
      "On Leave": 0,
      "Training / Off-Duty": 0,
    };

    list.forEach((t) => {
      totalRating += t.safetyRating || 0;
      totalCompleted += t.completedAuditsCount || 0;
      if (statusBreakdown[t.status] !== undefined) {
        statusBreakdown[t.status]++;
      }
    });

    const averageRating =
      list.length > 0 ? Number((totalRating / list.length).toFixed(2)) : 0;

    return {
      totalTechnicians: list.length,
      availableOnField: statusBreakdown["Available on Field"] || 0,
      onSiteInspection: statusBreakdown["On-Site Inspection"] || 0,
      averageRating,
      totalCompletedAudits: totalCompleted,
      statusBreakdown,
    };
  }

  public subscribe(listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(TECHNICIANS_CHANGE_EVENT, listener);
    return () => {
      window.removeEventListener(TECHNICIANS_CHANGE_EVENT, listener);
    };
  }
}

export const technicianService = new TechnicianService();
