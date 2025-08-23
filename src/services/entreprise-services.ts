import { EntrepriseType } from "@/schemas/entreprise-schema";
import { HttpService } from "./base-services";

export class EntrepriseService extends HttpService {

  createEntreprise = async (data: EntrepriseType) => {
    return this.post("/entreprise", data);
  };
  
  getEntreprises = async () => {
    return this.get("/entreprise");
  };
  
  getEntrepriseById = async (id: string) => {
    return this.get(`/entreprise/${id}`);
  };
  
  updateEntreprise = async (id: string, data: EntrepriseType) => {
    return this.put(`/entreprise/${id}`, data);
  };
  
  deleteEntreprise = async (id: string) => {
    return this.delete(`/entreprise/${id}`);
  };
  
}

// Create and export a singleton instance
const entrepriseService = new EntrepriseService();
export default entrepriseService;

