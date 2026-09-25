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

import { initialMockClients } from "@/data/clientsData";
export { initialMockClients };

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
