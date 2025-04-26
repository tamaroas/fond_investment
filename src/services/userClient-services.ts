import { UserClientType } from "@/schemas/userClient-schema";
import { HttpService } from "./base-services";

export type UserClientResponse = {
    message: string;
    status: number;
    content: UserClientType;
}

export type GetUserClientResponse = {
    message: string;
    status: number;
    content: UserClientType[];
}

export class UserClientService extends HttpService {

  public async createUserClient(data: any): Promise<UserClientResponse> {
    return this.post(`/client`, data);
  }

  public async getUserClients(): Promise<GetUserClientResponse> {
    return this.get(`/client`);
  }
  
  public async updateUserClient(id: string, data: Partial<UserClientType>): Promise<UserClientResponse> {
    return this.put(`/client/${id}`, data);
  }
  
  public async deleteUserClient(id: string): Promise<UserClientResponse> {
    return this.delete(`/client/${id}`);
  }
  
  public async getUserClientById(id: string): Promise<UserClientResponse> {
    return this.get(`/client/${id}`);
  }
}

const userClientService = new UserClientService();

export default userClientService;