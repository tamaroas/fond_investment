import { HttpService } from "./base-services";
import { Agency, AgencyCreateDto, AgencyResponse, AgencySingleResponse, AgencyUpdateDto, ChefAgenceResponse, ChefAgenceSingleResponse } from "@/utils/type/agency";

class AgencyService extends HttpService {
  /**
   * Récupère la liste des agences
   * @param page Numéro de page
   * @param size Nombre d'éléments par page
   * @returns Liste paginée des agences
   */
  public async getAgencies(page: number = 0, size: number = 10): Promise<AgencyResponse> {
    return this.get(`/agence`);
  }

  /**
   * Récupère une agence par son ID
   * @param id ID de l'agence
   * @returns Détails de l'agence
   */
  public async getAgencyById(id: string): Promise<AgencySingleResponse> {
    return this.get(`/agence/${id}`);
  }
  public async getChefAgencyByIdAgence(idAgence: string): Promise<ChefAgenceSingleResponse> {
    return this.get(`/chef-agence/agence/${idAgence}`);
  }
  /**
   * Crée une nouvelle agence
   * @param data Données de l'agence à créer
   * @returns Agence créée
   */
  public async createAgency(data: AgencyCreateDto): Promise<Agency> {
    return this.post('/agence', data);
  }

  /**
   * Met à jour une agence existante
   * @param id ID de l'agence
   * @param data Données à mettre à jour
   * @returns Agence mise à jour
   */
  public async updateAgency(id: string, data: AgencyUpdateDto): Promise<Agency> {
    return this.put(`/agence/${id}`, data);
  }

  /**
   * Supprime une agence
   * @param id ID de l'agence
   * @returns Message de confirmation
   */
  public async deleteAgency(id: string): Promise<{ message: string }> {
    return this.delete(`/agence/${id}`);
  }

  /**
   * Recherche des agences par nom
   * @param query Terme de recherche
   * @returns Liste des agences correspondantes
   */
  public async searchAgencies(query: string): Promise<AgencyResponse> {
    return this.get(`/agence/search?query=${encodeURIComponent(query)}`);
  }
  /**
   * Crée un chef d'agence pour une agence donnée
   * @param idAgence ID de l'agence
   * @param data Données du chef d'agence
   */
  public async createChefAgence(idAgence: string, data: any) {

    return this.post(`/chef-agence/agence/${idAgence}`, data);
  }

  /**
   * Met à jour le chef d'agence pour une agence donnée
   * @param idAgence ID de l'agence
   * @param data Données du chef d'agence
   */
  public async updateChefAgence(idAgence: string, data: any) {
    return this.put(`/chef-agence/agence/${idAgence}`, data);
  }

  /**
   * Supprime le chef d'agence d'une agence donnée
   * @param idAgence ID de l'agence
   */
  public async deleteChefAgence(idAgence: string) {
    return this.delete(`/chef-agence/${idAgence}`);
  }

  /**
   * Récupère les gestionnaires d'une agence
   * @param agenceId ID de l'agence
   * @returns Liste des gestionnaires
   */
  public async getAgencyManagers(agenceId: string): Promise<AgencyResponse> {
    return this.get(`/agence/${agenceId}/gestionnaires`);
  }

  /**
   * Récupère le chef d'une agence
   * @param agenceId ID de l'agence
   * @returns Chef d'agence
   */
  public async getAgencyChief(agenceId: string): Promise<Agency> {
    return this.get(`/agence/${agenceId}/chef`);
  }
  public async getAllChefAgence(): Promise<ChefAgenceResponse> {
    return this.get(`/chef-agence`);
  }
}

const agencyService = new AgencyService();
export default agencyService;
