import { AffiliationType, CompteType, TypeContratType } from "@/schemas/userClient-schema";
import { HttpService } from "./base-services";

export type CompteResponse = {
    message: string;
    status: number;
    content: CompteType;
}

export type GetCompteResponse = {
    message: string;
    status: number;
    content: CompteType;
}

export type GetTypeCompteResponse = {
  message: string;
  status: number;
  content: TypeContratType[];
}

export type CreateContratCompteResponse = {
  message: string;
  status: number;
  content: AffiliationType;
}

export type GetContratResponse = {
  message: string;
  status: number;
  content: AffiliationType[];
}

export class CompteService extends HttpService {
  public async createCompte(data: Omit<CompteType, 'id' | 'numeroCompte' | 'solde' | 'dateCreation'>): Promise<CompteResponse> {
    return this.post(`/compte`, data);
  }

  public async getComptes(): Promise<GetCompteResponse> {
    return this.get(`/compte`);
  }
  
  public async getComptesByClientId(clientId: string): Promise<GetCompteResponse> {
    return this.get(`/compte/client/${clientId}`);
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

  public async getTypeContrats(): Promise<GetTypeCompteResponse> {
    return this.get(`/type-contrat`);
  }
  public async createContratCompte(data: AffiliationType): Promise<CreateContratCompteResponse> {
    return this.post(`/contrat`, data);
  }
  public async getContratsByClientId(clientId: string): Promise<GetContratResponse> {
    return this.get(`/contrat/client/${clientId}`);
  }
}

const compteService = new CompteService();

export default compteService;
