export type BdeStatus = "Active" | "Probation" | "On Leave" | "Inactive";

export type BdeDepartment =
  | "Enterprise Sales"
  | "Inbound Sales"
  | "Outbound Outreach"
  | "Mid-Market"
  | "Strategic Accounts";

export interface BDE {
  id?: string;
  bdeId?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: BdeDepartment;
  territory: string;
  monthlyQuota: number;
  achievedRevenue: number;
  leadsAssigned: number;
  dealsClosed: number;
  conversionRate: number;
  status: BdeStatus;
  joinedDate: string;
  notes?: string;
}

export interface CreateBdeDTO {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: BdeDepartment;
  territory: string;
  monthlyQuota: number;
  achievedRevenue?: number;
  leadsAssigned?: number;
  dealsClosed?: number;
  status: BdeStatus;
  joinedDate?: string;
  notes?: string;
}

export type UpdateBdeDTO = Partial<CreateBdeDTO>;

export interface BdeStats {
  totalBdes: number;
  activeBdes: number;
  totalTargetQuota: number;
  totalAchievedRevenue: number;
  averageQuotaAttainment: number;
  totalDealsClosed: number;
}

export interface BdeFilterOptions {
  search?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
}

export interface BdeListResponse {
  data: BDE[];
  total: number;
  page: number;
  totalPages: number;
}
