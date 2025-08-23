export type TimeObject = {
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

export type AgencyUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  agenceId: string;
};

export type Agency = {
  publicId: string;
  nom: string;
  numero: string;
  adresse: string;
  telephone: string;
  email: string;
  fax: string;
  heureOuverture: TimeObject | string;
  heureFermeture: TimeObject | string;
  jourOuverture: string;
  jourFermeture: string;
  servicesProposes: string;
  gestionnaire: AgencyUser[];
  chefAgence: AgencyUser;
  gestionnaires: AgencyUser[];
  caissiers: AgencyUser[];
};
export type ChefAgenceResponse = {
  content: ChefAgence[];
  totalElements: number;
  totalPages: number;
};

export type LittleAgency = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  agenceId: string;
}

export type AgencyResponse = {
  content: Agency[];
  totalElements: number;
  totalPages: number;
};

export type AgencySingleResponse = {
  content: Agency;
  message: string;
};
export type ChefAgence = {
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  email: string;
  mot2passe: string;
};
export type ChefAgenceSingleResponse = {
  content: ChefAgence;
  message: string;
};

export type AgencyUserResponse = {
  content: AgencyUser[];
  totalElements: number;
  totalPages: number;
};

export type AgencyUserCreateDto = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  role: string;
  agenceId: string;
};

export type AgencyUserUpdateDto = {
  id: string;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  role?: string;
  agenceId?: string;
};

export type AgencyManagerDto = {
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  email: string;
  mot2passe: string;
};

export type AgencyCreateDto = {
  nom: string;
  numero: string;
  adresse: string;
  telephone: string;
  email: string;
  fax: string;
  heureOuverture: string;
  heureFermeture: string;
  jourOuverture: string;
  jourFermeture: string;
  servicesProposes: string;

};

export type AgencyUpdateDto = {
  publicId: string;
  nom?: string;
  numero?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  fax?: string;
  heureOuverture?: string;
  heureFermeture?: string;
  jourOuverture?: string;
  jourFermeture?: string;
  servicesProposes?: string;
};
