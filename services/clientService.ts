import {
  ClientItem,
  CreateClientInput,
  UpdateClientInput,
  ClientStats,
  ClientFilterOptions,
  ClientContractStatus,
} from "@/types/client";
import { formatINR, formatStandardINR, parseINR } from "./leadService";

const STORAGE_KEY = "nleta_crm_clients_v1";
const CLIENTS_CHANGE_EVENT = "nleta_clients_updated";

export const initialMockClients: ClientItem[] = [
  {
    id: "CL-101",
    companyName: "DLF CyberCity Developers Ltd",
    clientType: "Commercial Real Estate",
    contactPerson: "Arjun Singhal",
    contactEmail: "a.singhal@dlfcybercity.com",
    contactPhone: "+91 98101 23456",
    address: "DLF CyberHub, Phase 2",
    city: "Gurugram",
    state: "Haryana",
    totalAssetsCount: 48,
    contractStatus: "Active Agreement",
    contractValue: "₹34,50,000",
    numericContractValue: 3450000,
    accountManager: "Vikramaditya Rao",
    joinedDate: "2024-03-15",
    nextAuditDate: "2026-10-15",
    notes: "Master safety audit contract covering 32 passenger lifts and 16 atrium escalators across Buildings 9 & 10.",
  },
  {
    id: "CL-102",
    companyName: "Delhi Metro Rail Corporation (DMRC)",
    clientType: "Government / Transit",
    contactPerson: "Er. Rameshwar Dayal",
    contactEmail: "r.dayal@delhimetrorail.com",
    contactPhone: "+91 98681 44550",
    address: "Metro Bhawan, Fire Brigade Lane, Barakhamba Road",
    city: "New Delhi",
    state: "Delhi NCR",
    totalAssetsCount: 96,
    contractStatus: "Active Agreement",
    contractValue: "₹78,00,000",
    numericContractValue: 7800000,
    accountManager: "Vikramaditya Rao",
    joinedDate: "2023-08-10",
    nextAuditDate: "2026-11-01",
    notes: "Quarterly preventative escalator brake checks and emergency evacuation lift certifications on Yellow & Magenta Lines.",
  },
  {
    id: "CL-103",
    companyName: "Max Healthcare Institute Ltd",
    clientType: "Healthcare",
    contactPerson: "Dr. K. N. Banerjee",
    contactEmail: "ops@maxhealthcare.com",
    contactPhone: "+91 98111 88990",
    address: "1 Press Enclave Marg, Saket",
    city: "New Delhi",
    state: "Delhi NCR",
    totalAssetsCount: 22,
    contractStatus: "Under Audit",
    contractValue: "₹18,20,000",
    numericContractValue: 1820000,
    accountManager: "Sunita Deshmukh",
    joinedDate: "2024-11-20",
    nextAuditDate: "2026-09-30",
    notes: "Bed elevators and cleanroom OT lifts require zero-downtime micro-level vibration testing.",
  },
  {
    id: "CL-104",
    companyName: "Phoenix Mills Commercial Parks",
    clientType: "Commercial Real Estate",
    contactPerson: "Kavita Sethi",
    contactEmail: "kavita.sethi@phoenixmills.com",
    contactPhone: "+91 98200 55112",
    address: "Phoenix Palladium, Senapati Bapat Marg, Lower Parel",
    city: "Mumbai",
    state: "Maharashtra",
    totalAssetsCount: 36,
    contractStatus: "Pending Renewal",
    contractValue: "₹26,80,000",
    numericContractValue: 2680000,
    accountManager: "Karan Johar",
    joinedDate: "2023-05-12",
    nextAuditDate: "2026-10-05",
    notes: "Contract renewal proposal submitted with complimentary thermal imaging testing included.",
  },
  {
    id: "CL-105",
    companyName: "Oberoi Sky City Towers RWA",
    clientType: "Residential RWA",
    contactPerson: "Shekhar Varma",
    contactEmail: "management@skycity-borivali.in",
    contactPhone: "+91 99302 77441",
    address: "Western Express Highway, Borivali East",
    city: "Mumbai",
    state: "Maharashtra",
    totalAssetsCount: 18,
    contractStatus: "Active Agreement",
    contractValue: "₹12,40,000",
    numericContractValue: 1240000,
    accountManager: "Sunita Deshmukh",
    joinedDate: "2025-01-18",
    nextAuditDate: "2026-12-10",
    notes: "High-speed 4m/s traction lifts operating across G+54 residential luxury towers.",
  },
  {
    id: "CL-106",
    companyName: "RMZ Corp Tech Parks",
    clientType: "Commercial Real Estate",
    contactPerson: "Deepak Nambiar",
    contactEmail: "d.nambiar@rmzcorp.com",
    contactPhone: "+91 98450 33887",
    address: "RMZ Infinity, Old Madras Road",
    city: "Bengaluru",
    state: "Karnataka",
    totalAssetsCount: 30,
    contractStatus: "Onboarding",
    contractValue: "₹21,50,000",
    numericContractValue: 2150000,
    accountManager: "Vikramaditya Rao",
    joinedDate: "2026-08-01",
    nextAuditDate: "2026-10-25",
    notes: "New account. Baseline safety audit scheduled for Destination Control System lifts.",
  },
];

function getStoredClients(): ClientItem[] {
  if (typeof window === "undefined") {
    return initialMockClients;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockClients));
      return initialMockClients;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockClients));
      return initialMockClients;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading clients from storage:", err);
    return initialMockClients;
  }
}

function saveClientsToStorage(clients: ClientItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    window.dispatchEvent(new Event(CLIENTS_CHANGE_EVENT));
  } catch (err) {
    console.error("Error writing clients to storage:", err);
  }
}

function generateNextClientId(clients: ClientItem[]): string {
  const ids = clients
    .map((c) => {
      const match = c.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxId = ids.length > 0 ? Math.max(...ids) : 100;
  return `CL-${maxId + 1}`;
}

export const clientService = {
  async getAllClients(filters?: ClientFilterOptions): Promise<ClientItem[]> {
    const clients = getStoredClients();
    if (!filters) return [...clients];

    return clients.filter((item) => {
      if (filters.search && filters.search.trim() !== "") {
        const query = filters.search.toLowerCase();
        const matches =
          item.companyName.toLowerCase().includes(query) ||
          item.contactPerson.toLowerCase().includes(query) ||
          item.contactEmail.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.state.toLowerCase().includes(query) ||
          item.accountManager.toLowerCase().includes(query);

        if (!matches) return false;
      }

      if (filters.clientType && filters.clientType !== "ALL") {
        if (item.clientType !== filters.clientType) return false;
      }

      if (filters.contractStatus && filters.contractStatus !== "ALL") {
        if (item.contractStatus !== filters.contractStatus) return false;
      }

      return true;
    });
  },

  async getClientById(id: string): Promise<ClientItem | null> {
    const clients = getStoredClients();
    const found = clients.find((c) => c.id.toLowerCase() === id.toLowerCase());
    return found ? { ...found } : null;
  },

  async createClient(input: CreateClientInput): Promise<ClientItem> {
    const clients = getStoredClients();
    const newId = generateNextClientId(clients);
    const today = new Date().toISOString().split("T")[0];

    const numericVal =
      input.numericContractValue !== undefined
        ? input.numericContractValue
        : parseINR(input.contractValue || "0");

    const formattedVal =
      input.contractValue && input.contractValue.trim() !== ""
        ? input.contractValue
        : formatStandardINR(numericVal);

    const newClient: ClientItem = {
      ...input,
      id: newId,
      joinedDate: input.joinedDate || today,
      numericContractValue: numericVal,
      contractValue: formattedVal,
      contractStatus: input.contractStatus || "Active Agreement",
    };

    const updated = [newClient, ...clients];
    saveClientsToStorage(updated);
    return newClient;
  },

  async updateClient(id: string, updates: UpdateClientInput): Promise<ClientItem> {
    const clients = getStoredClients();
    const index = clients.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      throw new Error(`Client with ID ${id} not found`);
    }

    const current = clients[index];
    const numericVal =
      updates.numericContractValue !== undefined
        ? updates.numericContractValue
        : updates.contractValue !== undefined
        ? parseINR(updates.contractValue)
        : current.numericContractValue;

    const formattedVal =
      updates.contractValue !== undefined
        ? updates.contractValue
        : updates.numericContractValue !== undefined
        ? formatStandardINR(updates.numericContractValue)
        : current.contractValue;

    const updatedClient: ClientItem = {
      ...current,
      ...updates,
      id: current.id,
      numericContractValue: numericVal,
      contractValue: formattedVal,
    };

    clients[index] = updatedClient;
    saveClientsToStorage(clients);
    return updatedClient;
  },

  async deleteClient(id: string): Promise<boolean> {
    const clients = getStoredClients();
    const filtered = clients.filter((c) => c.id.toLowerCase() !== id.toLowerCase());

    if (filtered.length === clients.length) {
      return false;
    }

    saveClientsToStorage(filtered);
    return true;
  },

  async getClientStats(): Promise<ClientStats> {
    const clients = getStoredClients();
    const totalClients = clients.length;

    const activeContracts = clients.filter(
      (c) => c.contractStatus === "Active Agreement"
    ).length;

    const pendingRenewals = clients.filter(
      (c) => c.contractStatus === "Pending Renewal"
    ).length;

    const totalContractValue = clients.reduce(
      (sum, c) => sum + (c.numericContractValue || 0),
      0
    );

    const totalAssetsManaged = clients.reduce(
      (sum, c) => sum + (c.totalAssetsCount || 0),
      0
    );

    const statusBreakdown: Record<ClientContractStatus, number> = {
      "Active Agreement": 0,
      "Pending Renewal": 0,
      "Under Audit": 0,
      "Expired": 0,
      "Onboarding": 0,
    };

    clients.forEach((c) => {
      if (statusBreakdown[c.contractStatus] !== undefined) {
        statusBreakdown[c.contractStatus]++;
      }
    });

    return {
      totalClients,
      activeContracts,
      totalContractValue,
      formattedTotalValue: formatINR(totalContractValue),
      totalAssetsManaged,
      pendingRenewals,
      statusBreakdown,
    };
  },

  async resetToDefault(): Promise<ClientItem[]> {
    saveClientsToStorage(initialMockClients);
    return [...initialMockClients];
  },

  subscribe(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {};

    const handler = () => callback();
    window.addEventListener(CLIENTS_CHANGE_EVENT, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(CLIENTS_CHANGE_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

export default clientService;
