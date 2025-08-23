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

export interface ChangePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateProfileDTO {
    nom: string;
    prenom: string;
    username: string;
    telephone: string;
    email: string;
    mot2passe?: string;
}

export class AuthService extends HttpService {
    public async login(data: any): Promise<LoginResponse> {
        return this.post(`/auth/login`, data);
    }

    public async changePassword(data: ChangePasswordDTO): Promise<{ message: string; status: number }> {
        return this.post(`/auth/change-password`, data);
    }

    // Ajout: mise à jour du profil utilisateur (PUT /auth/user/{id})
    public async updateProfile(id: string, data: UpdateProfileDTO): Promise<{ message: string; status: number; content: any }> {
        return this.put(`/auth/user/${id}`, data);
    }
}

const authService = new AuthService();

export default authService;
export const changePassword = authService.changePassword.bind(authService);
export const updateProfile = authService.updateProfile.bind(authService);