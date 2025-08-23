'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import transactionService, { TransactionType, SearchCompteParams, CompteInfoType, ClientInfoType } from "@/services/transaction-services";
import { useState } from "react";

export const useTransaction = () => {
  const queryClient = useQueryClient();
  const [compteInfo, setCompteInfo] = useState<any>(null);
  const [compteRecepteurInfo, setCompteRecepteurInfo] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerifyingRecepteur, setIsVerifyingRecepteur] = useState(false);
  const [searchResults, setSearchResults] = useState<ClientInfoType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mutation pour vérifier un compte
  const verifierCompteMutation = useMutation({
    mutationFn: async (numeroCompte: string) => {
      setIsVerifying(true);
      try {
        const response = await transactionService.verifierCompte(numeroCompte);
        setCompteInfo(response.content);
        return response;
      } finally {
        setIsVerifying(false);
      }
    },
    onSuccess: (response) => {
      toast({
        variant: "default",
        title: "Compte vérifié",
        description: `Compte de ${response.content.client.nom} ${response.content.client.prenom} trouvé`,
      });
    },
    onError: (error: any) => {
      setCompteInfo(null);
      toast({
        title: "Erreur lors de la vérification du compte",
        description: error.data?.message || "Numéro de compte introuvable",
        variant: "destructive",
      });
    },
  });

  // Mutation pour effectuer un dépôt
  const effectuerDepotMutation = useMutation({
    mutationFn: async (data: Omit<TransactionType, 'id' | 'dateTransaction'>) => {
      const response = await transactionService.effectuerDepot(data);
      return response;
    },
    onSuccess: (response) => {
      // Invalider les requêtes pour forcer un refetch
      if (compteInfo) {
        queryClient.invalidateQueries({ queryKey: ["transactions", compteInfo.id], refetchType: 'all' });
      }

      toast({
        variant: "default",
        title: "Dépôt effectué avec succès",
        description: `Un dépôt de ${response.content.montant} a été effectué avec succès`,
      });
      setCompteInfo({
        ...compteInfo,
        solde: compteInfo.solde + response.content.montant,
      });

      // Réinitialiser les informations du compte pour forcer une nouvelle vérification
      // setCompteInfo(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors du dépôt",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Mutation pour effectuer un retrait
  const effectuerRetraitMutation = useMutation({
    mutationFn: async (data: {
      montant: number;
      compteId: string;
      agenceId: string;
    }) => {
      console.log(data);
      debugger;
      const response = await transactionService.effectuerRetrait(data);
      return response;
    },
    onSuccess: (response) => {
      // Invalider les requêtes pour forcer un refetch
      if (compteInfo) {
        queryClient.invalidateQueries({ queryKey: ["transactions", compteInfo.id], refetchType: 'all' });
        setCompteInfo({
          ...compteInfo,
          solde: compteInfo.solde - response.content.montant,
        });
      }

      toast({
        variant: "default",
        title: "Retrait effectué avec succès",
        description: `Un retrait de ${response.content.montant} a été effectué avec succès`,
      });

      // Réinitialiser les informations du compte pour forcer une nouvelle vérification
      // setCompteInfo(null);
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors du retrait",
        description: error.data?.message || "Solde insuffisant ou autre erreur",
        variant: "destructive",
      });
    },
  });

  // Mutation pour effectuer un dépôt d'agence
  const effectuerDepotAgenceMutation = useMutation({
    mutationFn: async (data: {
      montant: number;
      origineFond?: string;
      compteId: string;
      agenceId: string;
    }) => {
      console.log(data);
      debugger;
      
      const response = await transactionService.effectuerDepotAgence(data);
      return response;
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Dépôt d'agence effectué",
        description: `Le dépôt d'agence a été effectué avec succès`,
      });
      setCompteInfo({
        ...compteInfo,
        solde: compteInfo.solde + data.content.montant,
      });
      // Réinitialiser les champs
      // setMontant('');
      // setOrigineFond('');
      // setAgenceId('');

      // Mettre à jour les informations du compte
      // verifierCompteMutation.mutate(numeroCompte);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur lors du dépôt d'agence",
        description: error.message || "Une erreur est survenue lors du dépôt d'agence",
      });
    },
  });

  // Mutation pour effectuer une cotisation sur un contrat
  const effectuerCotisationMutation = useMutation({
    mutationFn: async (data: {
      montant: number;
      origineFond: string;
      contratId: string;
    }) => {
      const response = await transactionService.effectuerCotisation(data);
      return response;
    },
    onSuccess: (data) => {
      toast({
        variant: "default",
        title: "Cotisation effectuée",
        description: `La cotisation a été effectuée avec succès`,
      });
      setCompteInfo({
        ...compteInfo,
        solde: compteInfo.solde - data.content.montant,
      });
      // Réinitialiser les champs
      // setMontant('');
      // setOrigineFond('');

      // Mettre à jour les informations du compte
      // verifierCompteMutation.mutate(numeroCompte);
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erreur lors de la cotisation",
        description: error.data?.message || "Une erreur est survenue lors de la cotisation",
      });
    },
  });

  // Mutation pour effectuer un transfert d'argent vers un autre compte
  const effectuerTransfertMutation = useMutation({
    mutationFn: async (data: {
      compteId: string;
      montant: number;
      motif: string;
      agenceId: string;
      numeroCompteRecepteur: string;
      codeAgenceRecepteur: string;
      cleRecepteur: string;
    }) => {
      const response = await transactionService.effectuerTransfert(data);
      return response;
    },
    onSuccess: (response) => {
      // Invalider les requêtes pour forcer un refetch
      if (compteInfo) {
        queryClient.invalidateQueries({ queryKey: ["transactions", compteInfo.id], refetchType: 'all' });
        setCompteInfo({
          ...compteInfo,
          solde: compteInfo.solde - response.content.montant,
        });
      }

      toast({
        variant: "default",
        title: "Transfert effectué avec succès",
        description: `Un transfert de ${response.content.montant} a été effectué avec succès`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors du transfert",
        description: error.data?.message || "Une erreur est survenue lors du transfert",
        variant: "destructive",
      });
    },
  });

  // Récupérer l'historique des transactions pour un compte
  const { data: transactionsData = [], isLoading: isLoadingTransactions, refetch: refetchTransactions } = useQuery({
    queryKey: ["transactions" + compteInfo?.id],
    queryFn: async () => {
      if (!compteInfo?.id) return [];
      const response = await transactionService.getTransactionsByCompteId(compteInfo.id);
      return response.content || [];
    },
    // enabled: !!compteInfo?.id,
  });

  // Mutation pour rechercher des comptes avec plusieurs critères
  const searchComptesMutation = useMutation({
    mutationFn: async (params: SearchCompteParams) => {
      setIsSearching(true);
      try {
        const response = await transactionService.searchComptes(params);
        setSearchResults(response.content || []);
        return response;
      } finally {
        setIsSearching(false);
      }
    },
    onError: (error: any) => {
      setSearchResults([]);
      toast({
        title: "Erreur lors de la recherche",
        description: error.data?.message || "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    },
  });

  // Sélectionner un compte parmi les résultats de recherche
  const selectCompte = (client: ClientInfoType) => {
    // Vérifier si le client a un compte
    if (!client.hasCompte || !client.compteDto) {
      toast({
        variant: "destructive",
        title: "Aucun compte associé",
        description: `${client.prenom} ${client.nom} n'a pas de compte associé`,
      });
      return;
    }

    // Adapter la structure du compte pour qu'elle corresponde à CompteInfoType
    const compteInfo: CompteInfoType = {
      ...client.compteDto,
      client: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: client.role,
        telephone: client.telephone,
        dateNaissance: client.dateNaissance,
        lieuNaissance: client.lieuNaissance,
        adresse: client.adresse,
        statutClient: client.statutClient,
        dateInscription: client.dateInscription,
        numeroCni: client.numeroCni,
        sexe: client.sexe,
        nationalite: client.nationalite,
        hasCompte: client.hasCompte,
        compteDto: client.compteDto
      }
    };

    setCompteInfo(compteInfo);
    setSearchResults([]);
    toast({
      variant: "default",
      title: "Compte sélectionné",
      description: `Compte de ${client.nom} ${client.prenom} sélectionné`,
    });
  };

  // Mutation pour vérifier un compte destinataire
  const verifierCompteRecepteurMutation = useMutation({
    mutationFn: async (data: { numeroCompte: string, codeAgence: string, cle: string }) => {
      setIsVerifyingRecepteur(true);
      try {
        const response = await transactionService.verifierCompte(data.numeroCompte);
        // Vérifier si le code agence et la clé correspondent
        if (response.content.codeAgence !== data.codeAgence || response.content.cle !== data.cle) {
          throw new Error('Les informations du compte destinataire ne correspondent pas');
        }
        setCompteRecepteurInfo(response.content);
        return response;
      } finally {
        setIsVerifyingRecepteur(false);
      }
    },
    onSuccess: (response) => {
      toast({
        variant: "default",
        title: "Compte destinataire vérifié",
        description: `Compte de ${response.content.client.nom} ${response.content.client.prenom} trouvé`,
      });
    },
    onError: (error: any) => {
      setCompteRecepteurInfo(null);
      toast({
        title: "Erreur lors de la vérification du compte destinataire",
        description: error.message || error.data?.message || "Informations du compte destinataire incorrectes",
        variant: "destructive",
      });
    },
  });

  return {
    compteInfo,
    compteRecepteurInfo,
    isVerifying,
    isVerifyingRecepteur,
    verifierCompteMutation,
    verifierCompteRecepteurMutation,
    effectuerDepotMutation,
    effectuerRetraitMutation,
    effectuerDepotAgenceMutation,
    effectuerCotisationMutation,
    effectuerTransfertMutation,
    transactions: transactionsData,
    isLoadingTransactions,
    refetchTransactions,
    resetCompteInfo: () => setCompteInfo(null),
    resetCompteRecepteurInfo: () => setCompteRecepteurInfo(null),
    // Nouvelles fonctionnalités pour la recherche multi-critères
    searchComptesMutation,
    searchResults,
    isSearching,
    selectCompte,
    clearSearchResults: () => setSearchResults([]),
  };
};
