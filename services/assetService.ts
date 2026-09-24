import {
  AssetRecord,
  CreateAssetInput,
  UpdateAssetInput,
  AssetStats,
  AssetFilterOptions,
  AssetOperationalStatus,
} from "@/types/asset";

const STORAGE_KEY = "nleta_crm_assets_v1";
const ASSETS_CHANGE_EVENT = "nleta_assets_updated";

export const initialMockAssets: AssetRecord[] = [
  {
    id: "AST-301",
    clientId: "CL-101",
    clientName: "DLF CyberCity Developers Ltd",
    assetName: "High-Rise Passenger Lift #04",
    equipmentType: "Traction Passenger Lift",
    facilityName: "DLF CyberHub Tower B",
    locationInFacility: "Core 2, Shaft L4 (Floors G - 32)",
    manufacturer: "Schindler 7000",
    installationYear: 2021,
    capacity: "1600 kg / 21 Persons",
    speed: "3.5 m/s",
    status: "Certified & Operational",
    lastAuditDate: "2025-10-12",
    nextAuditDueDate: "2026-10-12",
    assignedInspector: "Inspector Rajesh Sharma",
    safetyComplianceScore: 98,
    notes: "Overspeed governor test passed. Rope elongation within 1.2% tolerance.",
  },
  {
    id: "AST-302",
    clientId: "CL-101",
    clientName: "DLF CyberCity Developers Ltd",
    assetName: "Atrium Heavy Duty Escalator #01",
    equipmentType: "Heavy Transit Escalator",
    facilityName: "DLF CyberHub Central Promenade",
    locationInFacility: "Ground to 1st Floor Amphitheatre Entry",
    manufacturer: "Otis 515 NPE",
    installationYear: 2020,
    capacity: "9000 Persons/hr",
    speed: "0.65 m/s",
    status: "Due for Audit",
    lastAuditDate: "2025-09-15",
    nextAuditDueDate: "2026-09-30",
    assignedInspector: "Inspector Amitav Sen",
    safetyComplianceScore: 91,
    notes: "Combplate step sensors need routine lubrication and torque re-verification.",
  },
  {
    id: "AST-303",
    clientId: "CL-102",
    clientName: "Delhi Metro Rail Corporation (DMRC)",
    assetName: "Platform Escalator ESC-06B",
    equipmentType: "Heavy Transit Escalator",
    facilityName: "Rajiv Chowk Metro Interchange",
    locationInFacility: "Concourse to Platform 2 (Yellow Line)",
    manufacturer: "ThyssenKrupp / TK Elevator Victoria",
    installationYear: 2019,
    capacity: "11500 Persons/hr",
    speed: "0.75 m/s",
    status: "Certified & Operational",
    lastAuditDate: "2026-06-20",
    nextAuditDueDate: "2026-12-20",
    assignedInspector: "Senior Eng. Harish Chander",
    safetyComplianceScore: 99,
    notes: "Heavy transit continuous duty cycle certified. Auxiliary emergency pawl brake tested.",
  },
  {
    id: "AST-304",
    clientId: "CL-103",
    clientName: "Max Healthcare Institute Ltd",
    assetName: "Emergency ICU Bed Lift #02",
    equipmentType: "Hydraulic Bed Elevator",
    facilityName: "Max Super Specialty Hospital Saket",
    locationInFacility: "West Wing Surgical Block, Floors B1 to 6",
    manufacturer: "Mitsubishi Electric Diamond Bed Series",
    installationYear: 2022,
    capacity: "2000 kg / 26 Persons (Dual Stretcher)",
    speed: "1.5 m/s",
    status: "Audit In-Progress",
    lastAuditDate: "2025-09-20",
    nextAuditDueDate: "2026-09-28",
    assignedInspector: "Inspector Meera Joshi",
    safetyComplianceScore: 94,
    notes: "Cleanroom filtration micro-switch and door dwell-time synchronization currently under review.",
  },
  {
    id: "AST-305",
    clientId: "CL-104",
    clientName: "Phoenix Mills Commercial Parks",
    assetName: "Scenic Glass Observation Lift #01",
    equipmentType: "Panoramic Observation Lift",
    facilityName: "Phoenix Palladium Mall",
    locationInFacility: "North Atrium Plaza",
    manufacturer: "KONE MiniSpace",
    installationYear: 2021,
    capacity: "1350 kg / 18 Persons",
    speed: "2.0 m/s",
    status: "Defect Rectification",
    lastAuditDate: "2026-08-10",
    nextAuditDueDate: "2026-10-01",
    assignedInspector: "Inspector Priya Sundaram",
    safetyComplianceScore: 82,
    notes: "Minor optical curtain sensor flicker detected. Client replacing optical emitter harness.",
  },
  {
    id: "AST-306",
    clientId: "CL-105",
    clientName: "Oberoi Sky City Towers RWA",
    assetName: "High-Speed Sky Tower Lift #01",
    equipmentType: "Traction Passenger Lift",
    facilityName: "Sky City Tower A",
    locationInFacility: "Tower A Express Bank (Floors G to 54)",
    manufacturer: "Schindler 7000 Smart Transit",
    installationYear: 2023,
    capacity: "1800 kg / 24 Persons",
    speed: "5.0 m/s",
    status: "Certified & Operational",
    lastAuditDate: "2026-01-15",
    nextAuditDueDate: "2027-01-15",
    assignedInspector: "Inspector Rajesh Sharma",
    safetyComplianceScore: 97,
    notes: "High-speed aerodynamic buffer and seismic counterweight roller guides certified.",
  },
  {
    id: "AST-307",
    clientId: "CL-106",
    clientName: "RMZ Corp Tech Parks",
    assetName: "Destination Control Passenger Lift #08",
    equipmentType: "Traction Passenger Lift",
    facilityName: "RMZ Infinity Tech Park",
    locationInFacility: "Building 3 Central Core",
    manufacturer: "KONE DX Connected Class",
    installationYear: 2024,
    capacity: "1600 kg / 21 Persons",
    speed: "2.5 m/s",
    status: "Certified & Operational",
    lastAuditDate: "2026-08-05",
    nextAuditDueDate: "2027-08-05",
    assignedInspector: "Senior Eng. Harish Chander",
    safetyComplianceScore: 99,
    notes: "IoT sensor telemetry reporting real-time vibration and temperature data to NLETA portal.",
  },
];

function getStoredAssets(): AssetRecord[] {
  if (typeof window === "undefined") {
    return initialMockAssets;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockAssets));
      return initialMockAssets;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockAssets));
      return initialMockAssets;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading assets from storage:", err);
    return initialMockAssets;
  }
}

function saveAssetsToStorage(assets: AssetRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    window.dispatchEvent(new Event(ASSETS_CHANGE_EVENT));
  } catch (err) {
    console.error("Error writing assets to storage:", err);
  }
}

function generateNextAssetId(assets: AssetRecord[]): string {
  const ids = assets
    .map((a) => {
      const match = a.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxId = ids.length > 0 ? Math.max(...ids) : 300;
  return `AST-${maxId + 1}`;
}

export const assetService = {
  async getAllAssets(filters?: AssetFilterOptions): Promise<AssetRecord[]> {
    const assets = getStoredAssets();
    if (!filters) return [...assets];

    return assets.filter((item) => {
      if (filters.search && filters.search.trim() !== "") {
        const query = filters.search.toLowerCase();
        const matches =
          item.assetName.toLowerCase().includes(query) ||
          item.clientName.toLowerCase().includes(query) ||
          item.facilityName.toLowerCase().includes(query) ||
          item.manufacturer.toLowerCase().includes(query) ||
          item.locationInFacility.toLowerCase().includes(query) ||
          item.assignedInspector.toLowerCase().includes(query);

        if (!matches) return false;
      }

      if (filters.equipmentType && filters.equipmentType !== "ALL") {
        if (item.equipmentType !== filters.equipmentType) return false;
      }

      if (filters.status && filters.status !== "ALL") {
        if (item.status !== filters.status) return false;
      }

      if (filters.clientId && filters.clientId !== "ALL") {
        if (item.clientId !== filters.clientId) return false;
      }

      return true;
    });
  },

  async getAssetById(id: string): Promise<AssetRecord | null> {
    const assets = getStoredAssets();
    const found = assets.find((a) => a.id.toLowerCase() === id.toLowerCase());
    return found ? { ...found } : null;
  },

  async createAsset(input: CreateAssetInput): Promise<AssetRecord> {
    const assets = getStoredAssets();
    const newId = generateNextAssetId(assets);

    const newAsset: AssetRecord = {
      ...input,
      id: newId,
      safetyComplianceScore: input.safetyComplianceScore ?? 95,
      status: input.status || "Certified & Operational",
    };

    const updated = [newAsset, ...assets];
    saveAssetsToStorage(updated);
    return newAsset;
  },

  async updateAsset(id: string, updates: UpdateAssetInput): Promise<AssetRecord> {
    const assets = getStoredAssets();
    const index = assets.findIndex((a) => a.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    const current = assets[index];
    const updatedAsset: AssetRecord = {
      ...current,
      ...updates,
      id: current.id,
    };

    assets[index] = updatedAsset;
    saveAssetsToStorage(assets);
    return updatedAsset;
  },

  async deleteAsset(id: string): Promise<boolean> {
    const assets = getStoredAssets();
    const filtered = assets.filter((a) => a.id.toLowerCase() !== id.toLowerCase());

    if (filtered.length === assets.length) {
      return false;
    }

    saveAssetsToStorage(filtered);
    return true;
  },

  async getAssetStats(): Promise<AssetStats> {
    const assets = getStoredAssets();
    const totalAssets = assets.length;

    const certifiedOperational = assets.filter(
      (a) => a.status === "Certified & Operational"
    ).length;

    const dueForAudit = assets.filter((a) => a.status === "Due for Audit").length;

    const auditInProgress = assets.filter(
      (a) => a.status === "Audit In-Progress"
    ).length;

    const averageSafetyScore =
      totalAssets > 0
        ? Math.round(
            (assets.reduce((sum, a) => sum + (a.safetyComplianceScore || 90), 0) /
              totalAssets) *
              10
          ) / 10
        : 100;

    const statusBreakdown: Record<AssetOperationalStatus, number> = {
      "Certified & Operational": 0,
      "Due for Audit": 0,
      "Audit In-Progress": 0,
      "Defect Rectification": 0,
      "Decommissioned": 0,
    };

    assets.forEach((a) => {
      if (statusBreakdown[a.status] !== undefined) {
        statusBreakdown[a.status]++;
      }
    });

    return {
      totalAssets,
      certifiedOperational,
      dueForAudit,
      auditInProgress,
      averageSafetyScore,
      statusBreakdown,
    };
  },

  async resetToDefault(): Promise<AssetRecord[]> {
    saveAssetsToStorage(initialMockAssets);
    return [...initialMockAssets];
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = () => callback();
    window.addEventListener(ASSETS_CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(ASSETS_CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

export default assetService;
