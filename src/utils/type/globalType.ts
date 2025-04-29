type DictionaryType = { [key: string]: string }

type ResponseUseFetch = {
    message: string,
    status: number,
    content: any | null
    success?: boolean
}

type ResponseUseFetchClient = ResponseUseFetch & {
    // success?: boolean
    statusText?: string
}

type CallBackResponseUseFetch = (response: ResponseUseFetchClient) => void

type CustomCookie = {
    access_token: string | null,
    deleteAccessToken: (key: string) => void
    setAccessTokenWithExpiry: (value: string | null, maxAge: number) => void
}

type Help = {
    code_authentication: number,
    local_api_url?: string,
    api_key?: string,
    api_url?: string,
    client_api_key?: string,
}

type Role = {
    id: number;
    name: string;
    selug: string;
}

type Roles = {
    role: Role[]
}

type Administrator = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined
    roles: Roles
}

type Customer = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    tel: number;
    callingCode: number;
    company: string;
    identityType: string;
    identity: string;
    publicKey: string;
    privateKey: string;
    status: boolean;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined;
    roles: Roles;
}

type UserCustomer = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    tel: number;
    callingCode: number;
    company: string;
    identityType: string;
    identity: string;
    publicKey: string;
    privateKey: string;
    status: boolean;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined;
    roles: Roles;
    createdAt: string;
    updatedAt: string;
}
enum Sexe {
    M = "MASCULIN",
    F = "FEMININ"
}
enum StatutClient {
    actif = "ACTIF",
    inactif = "INACTIF"
}
type User = {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    telephone: string;
    dateNaissance: string;
    lieuNaissance: string;
    adresse: string;
    statutClient: StatutClient;
    dateInscription: string;
    numeroCni: string;
    sexe: Sexe;
    nationalite: string;
    nbreCompte: number;
};

