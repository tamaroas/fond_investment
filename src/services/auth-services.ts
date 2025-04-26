import { HttpService } from "./base-services";

export interface LoginResponse {
    message: string;
    status: number;
    content: {
        user: {
            id: string;
            nom: string;
            prenom: string;
            email: string;
            role: string;
            telephone: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

export class AuthService extends HttpService {

public async login(data: any): Promise<LoginResponse> {
    return this.post(`/auth/login`, data);
  }
}

const authService = new AuthService();

export default authService;