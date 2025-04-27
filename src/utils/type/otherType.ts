

export type Customer = {
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
    wallet: Wallet
}

export type ViaziCustomer = {
    access_token: string;
    token_type: string;
    expire: number;
    customer: Customer | null;
    administrator: Administrator | null
}

export type UserType = {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    telephone: string;
    agenceId?: string;
}

