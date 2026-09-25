import { leadService } from "./leadService";
import { bdeService } from "./bdeService";
import { LeadItem } from "@/types/lead";
import { BdeItem } from "@/types/bde";

const BDE_LEAD_ASSIGNMENT_EVENT = "nleta_bde_lead_assigned";

class BdeLeadService {
  /**
   * Assign a specific BDE to a single lead
   */
  public async assignBdeToLead(
    leadId: string,
    bdeId: string
  ): Promise<{ lead: LeadItem; bde: BdeItem }> {
    const [bde, lead] = await Promise.all([
      bdeService.getBdeById(bdeId),
      leadService.getLeadById(leadId),
    ]);

    if (!bde) {
      throw new Error(`BDE executive with ID "${bdeId}" not found.`);
    }
    if (!lead) {
      throw new Error(`Lead with ID "${leadId}" not found.`);
    }

    // Update lead record
    const updatedLead = await leadService.updateLead(leadId, {
      assignedBdeId: bde.id,
      assignedBdeName: bde.fullName,
    });

    // Re-sync BDE's active leads count
    await this.syncBdeMetrics(bde.id);

    this.notifySubscribers();
    return { lead: updatedLead, bde };
  }

  /**
   * Assign multiple leads to a single BDE (bulk assignment)
   */
  public async assignLeadsToBde(
    bdeId: string,
    leadIds: string[]
  ): Promise<{ bde: BdeItem; assignedCount: number }> {
    const bde = await bdeService.getBdeById(bdeId);
    if (!bde) {
      throw new Error(`BDE executive with ID "${bdeId}" not found.`);
    }

    for (const leadId of leadIds) {
      await leadService.updateLead(leadId, {
        assignedBdeId: bde.id,
        assignedBdeName: bde.fullName,
      });
    }

    await this.syncBdeMetrics(bde.id);
    this.notifySubscribers();
    return { bde, assignedCount: leadIds.length };
  }

  /**
   * Remove BDE assignment from a lead
   */
  public async unassignBdeFromLead(leadId: string): Promise<LeadItem> {
    const lead = await leadService.getLeadById(leadId);
    if (!lead) {
      throw new Error(`Lead with ID "${leadId}" not found.`);
    }

    const previousBdeId = lead.assignedBdeId;

    const updatedLead = await leadService.updateLead(leadId, {
      assignedBdeId: undefined,
      assignedBdeName: undefined,
    });

    if (previousBdeId) {
      await this.syncBdeMetrics(previousBdeId);
    }

    this.notifySubscribers();
    return updatedLead;
  }

  /**
   * Get all leads assigned to a specific BDE
   */
  public async getLeadsForBde(bdeId: string): Promise<LeadItem[]> {
    const allLeads = await leadService.getAllLeads();
    return allLeads.filter(
      (l) => l.assignedBdeId?.toLowerCase() === bdeId.toLowerCase()
    );
  }

  /**
   * Get the assigned BDE executive for a given lead
   */
  public async getBdeForLead(leadId: string): Promise<BdeItem | null> {
    const lead = await leadService.getLeadById(leadId);
    if (!lead || !lead.assignedBdeId) return null;
    return bdeService.getBdeById(lead.assignedBdeId);
  }

  /**
   * Recalculate BDE's activeLeadsCount based on live lead assignments
   */
  private async syncBdeMetrics(bdeId: string): Promise<void> {
    try {
      const bde = await bdeService.getBdeById(bdeId);
      if (!bde) return;

      const leads = await this.getLeadsForBde(bdeId);
      const activeCount = leads.filter(
        (l) => l.status === "Under Discussion"
      ).length;

      await bdeService.updateBde(bdeId, {
        activeLeadsCount: activeCount,
      });
    } catch (e) {
      console.error("Failed to sync BDE lead metrics:", e);
    }
  }

  private notifySubscribers() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(BDE_LEAD_ASSIGNMENT_EVENT));
    }
  }

  public subscribe(listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    window.addEventListener(BDE_LEAD_ASSIGNMENT_EVENT, listener);
    return () => {
      window.removeEventListener(BDE_LEAD_ASSIGNMENT_EVENT, listener);
    };
  }
}

export const bdeLeadService = new BdeLeadService();
