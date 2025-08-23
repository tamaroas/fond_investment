'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import agencyUserService from "@/services/agency-user-services";
import { AgencyUserCreateDto, AgencyUserUpdateDto } from "@/utils/type/agency";

export const useAgencyUser = (page: number = 0, size: number = 10, agencyId?: string) => {
  const queryClient = useQueryClient();

  // Récupérer la liste des utilisateurs d'agence
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["agencyUsers", page, size, agencyId],
    queryFn: async () => {
      if (agencyId) {
        return await agencyUserService.getUsersByAgency(agencyId, page, size);
      }
      return await agencyUserService.getAgencyUsers(page, size);
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Récupérer un utilisateur par son ID
  const getAgencyUserById = (id: string) => {
    return useQuery({
      queryKey: ["agencyUser", id],
      queryFn: async () => {
        const response = await agencyUserService.getAgencyUserById(id);
        return response;
      },
      enabled: !!id, // Ne s'exécute que si l'ID est fourni
    });
  };

  // Créer un nouvel utilisateur d'agence
  const createAgencyUserMutation = useMutation({
    mutationFn: async (data: AgencyUserCreateDto) => {
      return await agencyUserService.createAgencyUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyUsers"], refetchType: 'all' });
      toast({
        title: "Utilisateur créé avec succès",
        description: "Le nouvel utilisateur a été ajouté",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la création",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Mettre à jour un utilisateur
  const updateAgencyUserMutation = useMutation({
    mutationFn: async (data: AgencyUserUpdateDto) => {
      return await agencyUserService.updateAgencyUser(data.id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agencyUsers"], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ["agencyUser", data.id], refetchType: 'all' });
      toast({
        title: "Utilisateur mis à jour",
        description: "Les informations de l'utilisateur ont été mises à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Mettre à jour le statut d'un utilisateur
  const updateAgencyUserStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      return await agencyUserService.updateAgencyUserStatus(id, status);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agencyUsers"], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ["agencyUser", data.id], refetchType: 'all' });
      toast({
        title: "Statut mis à jour",
        description: `L'utilisateur a été mis à jour`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la mise à jour du statut",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Supprimer un utilisateur
  const deleteAgencyUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await agencyUserService.deleteAgencyUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencyUsers"], refetchType: 'all' });
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la suppression",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Réinitialiser le mot de passe d'un utilisateur
  const resetPasswordMutation = useMutation({
    mutationFn: async (id: string) => {
      return await agencyUserService.resetPassword(id);
    },
    onSuccess: () => {
      toast({
        title: "Mot de passe réinitialisé",
        description: "Un nouveau mot de passe a été envoyé à l'utilisateur",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la réinitialisation",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // Rechercher des utilisateurs
  const searchAgencyUsers = async (query: string) => {
    try {
      const response = await agencyUserService.searchAgencyUsers(query);
      return response;
    } catch (error: any) {
      toast({
        title: "Erreur lors de la recherche",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    getAgencyUserById,
    createAgencyUserMutation,
    updateAgencyUserMutation,
    updateAgencyUserStatusMutation,
    deleteAgencyUserMutation,
    resetPasswordMutation,
    searchAgencyUsers,
  };
};
