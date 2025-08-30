import { HttpService } from "./base-services";
import { AgencyUser, AgencyUserResponse } from "@/utils/type/agency";

export interface AgencyStats {
  nombreComptes: number;
  nombrePlans: number;
  totalSoldes: number;
  totalDepots: number;
  totalRetraits: number;
  soldePlans: number;
}

class ChefAgenceService extends HttpService {

  async getAgencyStats(agenceId: string): Promise<AgencyStats> {
    try {
      const response = await this.get<{content: AgencyStats}>(`/chef-agence/stats/${agenceId}`);
      return response.content || {
        nombreComptes: 0,
        nombrePlans: 0,
        totalSoldes: 0,
        totalDepots: 0,
        totalRetraits: 0,
        soldePlans: 0
      };
    } catch (error) {
      console.error('Erreur getAgencyStats:', error);
      // En cas d'erreur API, retourner des valeurs par défaut
      return {
        nombreComptes: 0,
        nombrePlans: 0,
        totalSoldes: 0,
        totalDepots: 0,
        totalRetraits: 0,
        soldePlans: 0
      };
    }
  }

  async getAgencyUsers(agenceId: string): Promise<AgencyUser[]> {
    try {
      const response = await this.get<AgencyUserResponse>(`/agency-users/agency/${agenceId}`);
      return response.content || [];
    } catch (error) {
      console.error('Erreur getAgencyUsers:', error);
      // En cas d'erreur API, retourner un tableau vide
      return [];
    }
  }

  async toggleUserStatus(userId: string, status: boolean): Promise<boolean> {
    try {
      await this.patch(`/agency-users/${userId}/status`, { status });
      return true;
    } catch (error) {
      console.error('Erreur toggleUserStatus:', error);
      return false;
    }
  }
}

const chefAgenceService = new ChefAgenceService();
export default chefAgenceService;