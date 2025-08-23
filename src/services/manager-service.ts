import { Manager, ManagerResponse, ManagerSingleResponse } from '@/utils/type/gestionnaire';
import { HttpService } from './base-services';





class ManagerService extends HttpService {
  public async getManagers(): Promise<ManagerResponse> {

    return this.get('/gestionnaire');
  }

  public async getManagerById(id: string): Promise<ManagerSingleResponse> {
    return this.get(`/gestionnaire/${id}`);
  }

  public async createManager(manager: Manager): Promise<ManagerSingleResponse> {
    return this.post('/gestionnaire', manager);
  }

  public async updateManager(id: string, manager: Partial<Manager>): Promise<ManagerSingleResponse> {
    return this.put(`/gestionnaire/${id}`, manager);
  }

  public async deleteManager(id: string): Promise<void> {
    return this.delete(`/gestionnaire/${id}`);
  }

  public async getManagersByAgence(id: string): Promise<ManagerResponse> {
    return this.get(`/gestionnaire/agence/${id}`);
  }
}

const managerService = new ManagerService();
export default managerService;
