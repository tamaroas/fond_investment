
export type Manager = {
    id?: string;
    nom: string;
    prenom: string;
    username: string;
    telephone: string;
    email: string;
    mot2passe?: string;
    agenceId?: string;
    role?: string;
}

export type ManagerResponse = {
    content: Manager[];
    totalElements: number;
    totalPages: number;
    message?: string;
};

export type ManagerSingleResponse = {
    content: Manager;
    message?: string;
};