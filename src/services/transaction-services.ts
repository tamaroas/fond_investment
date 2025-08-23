import { HttpService } from "./base-services";

export type SearchCompteParams = {
  value?: string;
};

export type ClientInfoType = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  statutClient: string;
  dateInscription: string;
  numeroCni: string;
  sexe: string;
  nationalite: string;
  hasCompte: boolean;
  compteDto?: {
    id: string,
    numeroCompte: string,
    cle: string,
    codeAgence: string,
    solde: number,
    dateOuvertureCompte: string,
    dateFermetureCompte: null | string,
    statutSolde: string,
    statut: string,
    nbrelimitetransaction: number,
    montantLimiteTransaction: number,
    periodeLimiteTransaction: number,
    contrats: []
  };
};

export type SearchCompteResponse = {
  message: string;
  status: number;
  content: ClientInfoType[];
};

export type TransactionType = {
  id?: string;
  compteId: string;
  montant: number;
  type: "DEPOT" | "RETRAIT";
  description?: string;
  dateTransaction?: string;
  origineFond?: string;
  agenceId?: string;
};

export type CompteInfoType = {
  id: string,
  numeroCompte: string,
  cle: string,
  codeAgence: string,
  solde: number,
  dateOuvertureCompte: string,
  dateFermetureCompte: null | string,
  statutSolde: string,
  statut: string,
  nbrelimitetransaction: number,
  montantLimiteTransaction: number,
  periodeLimiteTransaction: number,
  client: {
    id: string,
    nom: string,
    prenom: string,
    email: string,
    role: string,
    telephone: string,
    dateNaissance: string,
    lieuNaissance: string,
    adresse: string,
    statutClient: string,
    dateInscription: string,
    numeroCni: string,
    sexe: string,
    nationalite: string,
    hasCompte: boolean,
    compteDto: {
      id: string,
      numeroCompte: string,
      cle: string,
      codeAgence: string,
      solde: number,
      dateOuvertureCompte: string,
      dateFermetureCompte: null | string,
      statutSolde: string,
      statut: string,
      nbrelimitetransaction: number,
      montantLimiteTransaction: number,
      periodeLimiteTransaction: number,
      contrats: []
    }
  },
  contrats: []

};

export type TransactionResponse = {
  message: string;
  status: number;
  content: TransactionType;
};

export type CompteInfoResponse = {
  message: string;
  status: number;
  content: CompteInfoType;
};

export type TransactionsListResponse = {
  message: string;
  status: number;
  content: TransactionType[];
};

export class TransactionService extends HttpService {
  /**
   * Vérifie les informations d'un compte à partir de son numéro
   * @param numeroCompte Le numéro du compte à vérifier
   * @returns Les informations du compte
   */
  public async verifierCompte(numeroCompte: string): Promise<CompteInfoResponse> {
    return this.get(`/compte/numero/${numeroCompte}`);
  }

  /**
   * Effectue un dépôt sur un compte
   * @param data Les données de la transaction
   * @returns La réponse de la transaction
   */
  public async effectuerDepot(data: Omit<TransactionType, 'id' | 'dateTransaction'>): Promise<TransactionResponse> {
    return this.post(`/transaction/depotAgence`, { ...data, type: "DEPOT" });
  }

  /**
   * Effectue un retrait sur un compte
   * @param data Les données de la transaction
   * @returns La réponse de la transaction
   */
  public async effectuerRetrait(data: {
    montant: number;
    compteId: string;
    agenceId: string;
  }): Promise<TransactionResponse> {
    return this.post(`/transaction/retrait`, { ...data });
  }

  /**
   * Effectue un dépôt d'agence sur un compte
   * @param data Les données du dépôt d'agence
   * @returns La réponse de la transaction
   */
  public async effectuerDepotAgence(data: {
    montant: number;
    compteId: string;
    agenceId: string;
  }): Promise<TransactionResponse> {
    return this.post(`/transaction/depotAgence`, data);
  }

  /**
   * Récupère l'historique des transactions d'un compte
   * @param compteId L'identifiant du compte
   * @returns La liste des transactions
   */
  public async getTransactionsByCompteId(compteId: string): Promise<TransactionsListResponse> {
    return this.get(`/transaction/compte/${compteId}`);
  }

  /**
   * Récupère l'historique des transactions d'un caissier
   * @param caissierId L'identifiant du caissier
   * @returns La liste des transactions
   */
  public async getTransactionsByCaissierId(caissierId: string): Promise<TransactionsListResponse> {
    return this.get(`/transaction/caissier/${caissierId}`);
  }

  /**
   * Récupère l'historique des transactions d'une agence
   * @param agenceId L'identifiant de l'agence
   * @returns La liste des transactions
   */
  public async getTransactionsByAgenceId(agenceId: string): Promise<TransactionsListResponse> {
    return this.get(`/transaction/agence/${agenceId}`);
  }

  /**
   * Recherche des comptes selon plusieurs critères
   * @param params Les paramètres de recherche (nom, prénom, numéro de compte, téléphone, email, numéro CNI)
   * @returns La liste des comptes correspondant aux critères
   */
  public async searchComptes(params: SearchCompteParams): Promise<SearchCompteResponse> {
    return this.get(`/client/search?value=${params.value}`);
  }

  /**
   * Effectue une cotisation sur un contrat (épargne ou investissement)
   * @param data Les données de la cotisation
   * @returns La réponse de la cotisation
   */
  public async effectuerCotisation(data: {
    montant: number;
    contratId: string;
  }): Promise<TransactionResponse> {
    return this.post(`/cotisations/cotiser/agence`, data);
  }

  /**
   * Effectue un transfert d'argent vers un autre compte
   * @param data Les données du transfert
   * @returns La réponse de la transaction
   */
  public async effectuerTransfert(data: {
    compteId: string;
    montant: number;
    motif: string;
    agenceId: string;
    numeroCompteRecepteur: string;
    codeAgenceRecepteur: string;
    cleRecepteur: string;
  }): Promise<TransactionResponse> {
    return this.post(`/transaction/transfert`, data);
  }
}

const transactionService = new TransactionService();

export default transactionService;
