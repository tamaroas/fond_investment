'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import agencyService from "@/services/agency-services";
import { Agency, AgencyCreateDto, AgencyUpdateDto } from "@/utils/type/agency";

export const useAgency = (page: number = 0, size: number = 10) => {
  const queryClient = useQueryClient();

  // Récupérer la liste des agences
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["agencies", page, size],
    queryFn: async () => {
      const response = await agencyService.getAgencies(page, size);
      return response;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Récupérer une agence par son ID
  const getAgencyById = (id: string) => {
    return useQuery({
      queryKey: ["agency", id],
      queryFn: async () => {
        const response = await agencyService.getAgencyById(id);
        return response;
      },
      enabled: !!id, // Ne s'exécute que si l'ID est fourni
    });
  };

  // Créer une nouvelle agence
  const createAgencyMutation = useMutation({
    mutationFn: async (data: AgencyCreateDto) => {
      return await agencyService.createAgency(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"], refetchType: 'all' });
      toast({
        title: "Agence créée avec succès",
        description: "La nouvelle agence a été ajoutée",
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

  // Mettre à jour une agence
  const updateAgencyMutation = useMutation({
    mutationFn: async (data: AgencyUpdateDto) => {
      return await agencyService.updateAgency(data.publicId, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["agencies"], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ["agency", data.publicId], refetchType: 'all' });
      toast({
        title: "Agence mise à jour",
        description: "Les informations de l'agence ont été mises à jour",
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



  // Supprimer une agence
  const deleteAgencyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await agencyService.deleteAgency(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"], refetchType: 'all' });
      toast({
        title: "Agence supprimée",
        description: "L'agence a été supprimée avec succès",
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

  // Rechercher des agences
  const searchAgencies = async (query: string) => {
    try {
      const response = await agencyService.searchAgencies(query);
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
    getAgencyById,
    createAgencyMutation,
    updateAgencyMutation,
    deleteAgencyMutation,
    searchAgencies,
  };
};
