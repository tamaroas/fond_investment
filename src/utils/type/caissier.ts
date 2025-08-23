
export type Caissier = {
    id?: string;
    nom: string;
    prenom: string;
    username: string;
    telephone: string;
    email: string;
    mot2passe: string;
    agenceId?: string;
};

export type CaissierResponse = {
    content: Caissier[];
    totalElements: number;
    totalPages: number;
    message?: string;
};

export type CaissierSingleResponse = {
    content: Caissier;
    message?: string;
};