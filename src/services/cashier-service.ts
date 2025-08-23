import { Caissier, CaissierResponse, CaissierSingleResponse } from '@/utils/type/caissier';
import { HttpService } from './base-services';



class CaissierService extends HttpService {
  async getCaissiers(): Promise<CaissierResponse> {
    return this.get<CaissierResponse>('/caissier');
  }

  async getCaissierById(id: string): Promise<CaissierSingleResponse> {
    return this.get<CaissierSingleResponse>(`/caissier/${id}`);
  }

  async createCaissier(caissier: Caissier): Promise<CaissierSingleResponse> {
    return this.post<CaissierSingleResponse>('/caissier', caissier);
  }

  async updateCaissier(id: string, caissier: Partial<Caissier>): Promise<CaissierSingleResponse> {
    return this.put<CaissierSingleResponse>(`/caissier/${id}`, caissier);
  }

  async deleteCaissier(id: string): Promise<CaissierSingleResponse> {
    return this.delete<CaissierSingleResponse>(`/caissier/${id}`);
  }

  async getCaissiersByAgence(id: string): Promise<CaissierResponse> {
    return this.get<CaissierResponse>(`/caissier/agence/${id}`);
  }
}

const caissierService = new CaissierService();
export default caissierService;
