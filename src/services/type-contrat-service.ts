import { TypeContrat } from "@/schemas/type-contrat.schema";
import { HttpService } from "./base-services";

export type TypeContratResponse = {
  message: string;
  status: number;
  content: TypeContrat;
};

export type GetTypeContratResponse = {
  message: string;
  status: number;
  content: TypeContrat[];
};

export class TypeContratService extends HttpService {
  public async createTypeContrat(data: Omit<TypeContrat, 'id'>): Promise<TypeContratResponse> {
    console.log(data);
    // debugger;

    return this.post(`/type-contrat`, data);
  }

  public async getTypeContrats(): Promise<GetTypeContratResponse> {
    return this.get(`/type-contrat`);
  }

  public async updateTypeContrat(id: string, data: Partial<TypeContrat>): Promise<TypeContratResponse> {
    return this.put(`/type-contrat/${id}`, data);
  }

  public async deleteTypeContrat(id: string): Promise<TypeContratResponse> {
    return this.delete(`/type-contrat/${id}`);
  }

  public async getTypeContratById(id: string): Promise<TypeContratResponse> {
    return this.get(`/type-contrat/${id}`);
  }
}

const typeContratService = new TypeContratService();
export default typeContratService;
