import { CompteType } from "@/schemas/userClient-schema";
import { HttpService } from "./base-services";

export type CompteResponse = {
    message: string;
    status: number;
    content: CompteType;
}

export type GetCompteResponse = {
    message: string;
    status: number;
    content: CompteType[];
}

export class CompteService extends HttpService {
  public async createCompte(data: Omit<CompteType, 'id' | 'numeroCompte' | 'solde' | 'dateCreation'>): Promise<CompteResponse> {
    return this.post(`/compte`, data);
  }

  public async getComptes(): Promise<GetCompteResponse> {
    return this.get(`/compte`);
  }
  
  public async getComptesByClientId(clientId: string): Promise<GetCompteResponse> {
    return this.get(`/compte?clientId=${clientId}`);
  }
  
  public async updateCompte(id: string, data: Partial<CompteType>): Promise<CompteResponse> {
    return this.put(`/compte/${id}`, data);
  }
  
  public async deleteCompte(id: string): Promise<CompteResponse> {
    return this.delete(`/compte/${id}`);
  }
  
  public async getCompteById(id: string): Promise<CompteResponse> {
    return this.get(`/compte/${id}`);
  }
}

const compteService = new CompteService();

export default compteService;
