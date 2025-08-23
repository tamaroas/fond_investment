import { HttpService } from "./base-services";
import { AgencyUser, AgencyUserCreateDto, AgencyUserResponse, AgencyUserUpdateDto } from "@/utils/type/agency";

class AgencyUserService extends HttpService {
  /**
   * Récupère la liste des utilisateurs d'agence
   * @param page Numéro de page
   * @param size Nombre d'éléments par page
   * @returns Liste paginée des utilisateurs
   */
  public async getAgencyUsers(page: number = 0, size: number = 10): Promise<AgencyUserResponse> {
    return this.get(`/agency-users?page=${page}&size=${size}`);
  }

  /**
   * Récupère les utilisateurs d'une agence spécifique
   * @param agencyId ID de l'agence
   * @param page Numéro de page
   * @param size Nombre d'éléments par page
   * @returns Liste paginée des utilisateurs de l'agence
   */
  public async getUsersByAgency(agencyId: string, page: number = 0, size: number = 10): Promise<AgencyUserResponse> {
    return this.get(`/agency-users/agency/${agencyId}?page=${page}&size=${size}`);
  }

  /**
   * Récupère un utilisateur par son ID
   * @param id ID de l'utilisateur
   * @returns Détails de l'utilisateur
   */
  public async getAgencyUserById(id: string): Promise<AgencyUser> {
    return this.get(`/agency-users/${id}`);
  }

  /**
   * Crée un nouvel utilisateur d'agence
   * @param data Données de l'utilisateur à créer
   * @returns Utilisateur créé
   */
  public async createAgencyUser(data: AgencyUserCreateDto): Promise<AgencyUser> {
    return this.post('/agency-users', data);
  }

  /**
   * Met à jour un utilisateur existant
   * @param id ID de l'utilisateur
   * @param data Données à mettre à jour
   * @returns Utilisateur mis à jour
   */
  public async updateAgencyUser(id: string, data: AgencyUserUpdateDto): Promise<AgencyUser> {
    return this.put(`/agency-users/${id}`, data);
  }

  /**
   * Active ou désactive un utilisateur
   * @param id ID de l'utilisateur
   * @param status Nouveau statut
   * @returns Utilisateur mis à jour
   */
  public async updateAgencyUserStatus(id: string, status: boolean): Promise<AgencyUser> {
    return this.patch(`/agency-users/${id}/status`, { status });
  }

  /**
   * Supprime un utilisateur
   * @param id ID de l'utilisateur
   * @returns Message de confirmation
   */
  public async deleteAgencyUser(id: string): Promise<{ message: string }> {
    return this.delete(`/agency-users/${id}`);
  }

  /**
   * Recherche des utilisateurs par nom ou email
   * @param query Terme de recherche
   * @returns Liste des utilisateurs correspondants
   */
  public async searchAgencyUsers(query: string): Promise<AgencyUserResponse> {
    return this.get(`/agency-users/search?query=${encodeURIComponent(query)}`);
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur
   * @param id ID de l'utilisateur
   * @returns Message de confirmation
   */
  public async resetPassword(id: string): Promise<{ message: string }> {
    return this.post(`/agency-users/${id}/reset-password`, {});
  }
}

const agencyUserService = new AgencyUserService();
export default agencyUserService;
