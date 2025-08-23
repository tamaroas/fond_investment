'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AffiliationType, CompteType, UserClientType } from "@/schemas/userClient-schema";
import userClientService from "@/services/userClient-services";
import { useQueryClient } from "@tanstack/react-query";
import compteService from "@/services/compte-services";

export const useUserClient = () => {
 const queryClient = useQueryClient();


  const createUserClientMutation = useMutation({
    mutationFn: async (data: UserClientType) => {
      const response = await userClientService.createUserClient(data);
      return response;
    },
    onSuccess: (response): void => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["userClients"], refetchType: 'all' });
      toast({
        variant: "default",
        title: "Client créé avec succès",
        description: "Le client a été créé avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Error creating user client:", error);
      toast({
        title: "Erreur lors de la création du client",
        description: error.data.message,
        variant: "destructive",
      });
    },
  });
  const editUserClientMutation = useMutation({
    mutationFn: async (data:UserClientType) => {
      return await userClientService.updateUserClient(data?.id || "", data);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["userClients"], refetchType: 'all' });
      toast({
        title: "Client modifié avec succès",
        description: "Les informations du client ont été mises à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la modification",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Delete user client mutation
  const deleteUserClientMutation = useMutation({
    mutationFn: async (id: string) => {
      return await userClientService.deleteUserClient(id);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["userClients"], refetchType: 'all' });
      toast({
        title: "Client supprimé avec succès",
        description: "Le client a été supprimé de la base de données",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la suppression",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ["userClients"],
    queryFn: async () => {
      const response = await userClientService.getUserClients();
      return response;
    },
    // Ajouter staleTime pour contrôler quand les données sont considérées comme périmées
    staleTime: 1000 * 60, // 1 minute
  });

  // Activate user client mutation
  const activateUserClientMutation = useMutation({
    mutationFn: async (id: string) => {
      return await userClientService.activateUserClient(id);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["userClients"], refetchType: 'all' });
      toast({
        title: "Client activé avec succès",
        description: "Le client a été activé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de l'activation",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Deactivate user client mutation
  const deactivateUserClientMutation = useMutation({
    mutationFn: async (id: string) => {
      return await userClientService.deactivateUserClient(id);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["userClients"], refetchType: 'all' });
      toast({
        title: "Client désactivé avec succès",
        description: "Le client a été désactivé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la désactivation",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  return {
    createUserClientMutation,
    data,
    isLoading,
    error,
    refetch, // Exporter la fonction refetch pour permettre des actualisations manuelles
    editUserClientMutation,
    deleteUserClientMutation,
    activateUserClientMutation,
    deactivateUserClientMutation,
  };
};



export const useCompteClient = (clientId: string) => {
  const queryClient = useQueryClient();
 
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ["userClients"],
    queryFn: async () => {
      const response = await userClientService.getUserClients();
      return response;
    },
    // Ajouter staleTime pour contrôler quand les données sont considérées comme périmées
    staleTime: 1000 * 60, // 1 minute
  });
  const {data:listContrats, isLoading:isLoadingContrats, error:errorContrats, refetch:refetchContrats} = useQuery({
    queryKey: ["contrat"+ clientId],
    queryFn: async () => {
      const response = await compteService.getContratsByClientId(clientId);
      return response.content || [];
    },
    initialData: () => queryClient.getQueryData(["contrat"+ clientId])
  });
   const createCompteMutation = useMutation({
     mutationFn: async (data: CompteType) => {
       const response = await compteService.createCompte(data);
       return response;
     },
     onSuccess: (response): void => {
       queryClient.invalidateQueries({ queryKey: ["comptes"+ clientId], refetchType: 'all' });
       refetch();
       refetchContrats();
       toast({
         variant: "default",
         title: "Compte créé avec succès",
         description: "Le compte a été créé avec succès",
       });
     },
     onError: (error: any) => {
       console.error("Error creating compte:", error);
       toast({
         title: "Erreur lors de la création du compte",
         description: error.data.message,
         variant: "destructive",
       });
     },
   });
   const editCompteMutation = useMutation({
     mutationFn: async (data:CompteType) => {
       return await compteService.updateCompte(data?.id || "", data);
     },
     onSuccess: () => {
       // Invalider la requête et forcer un refetch immédiat
       queryClient.invalidateQueries({ queryKey: ["comptes"+ clientId], refetchType: 'all' });
       toast({
         title: "Compte modifié avec succès",
         description: "Les informations du compte ont été mises à jour",
       });
     },
     onError: (error: any) => {
       toast({
         title: "Erreur lors de la modification",
         description: error.message || "Une erreur est survenue",
         variant: "destructive",
       });
     },
   });
 
   const deleteCompteMutation = useMutation({
     mutationFn: async (id: string) => {
       return await compteService.deleteCompte(id);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["comptes"+ clientId], refetchType: 'all' });
       toast({
         title: "Compte supprimé avec succès",
         description: "Le compte a été supprimé de la base de données",
       });
     },
     onError: (error: any) => {
       toast({
         title: "Erreur lors de la suppression",
         description: error.message || "Une erreur est survenue",
         variant: "destructive",
       });
     },
   });
 
 
 

   const CreateContratCompteMutation = useMutation({
    mutationFn: async (data:AffiliationType) => {
      return await compteService.createContratCompte(data);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["contrat"+ clientId], refetchType: 'all' });
      toast({
        title: "Contrat créé avec succès",
        description: "Le contrat a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la création du contrat",
        description: error.data.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });
function refetchContratAll() {
  refetch();
  refetchContrats();
}

   return {
     data,
     isLoading,
     error,
     refetch:refetchContratAll, // Exporter la fonction refetch pour permettre des actualisations manuelles
     createCompteMutation,
     editCompteMutation,
     deleteCompteMutation,
     CreateContratCompteMutation,
     listContrats: listContrats,
   };
 };
 