'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { EntrepriseType } from "@/schemas/entreprise-schema";

// Import the entrepriseService instance
import entrepriseService from "@/services/entreprise-services";

export const useEntreprise = () => {
  const queryClient = useQueryClient();

  const createEntrepriseMutation = useMutation({
    mutationFn: async (data: EntrepriseType) => {
      const response = await entrepriseService.createEntreprise(data);
      return response;
    },
    onSuccess: (response): void => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["entreprises"], refetchType: 'all' });
      toast({
        variant: "default",
        title: "Entreprise créée avec succès",
        description: "L'entreprise a été créée avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Error creating entreprise:", error);
      toast({
        title: "Erreur lors de la création de l'entreprise",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const editEntrepriseMutation = useMutation({
    mutationFn: async (data: EntrepriseType) => {
      return await entrepriseService.updateEntreprise(data?.id || "", data);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["entreprises"], refetchType: 'all' });
      toast({
        title: "Entreprise modifiée avec succès",
        description: "Les informations de l'entreprise ont été mises à jour",
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

  // Delete entreprise mutation
  const deleteEntrepriseMutation = useMutation({
    mutationFn: async (id: string) => {
      return await entrepriseService.deleteEntreprise(id);
    },
    onSuccess: () => {
      // Invalider la requête et forcer un refetch immédiat
      queryClient.invalidateQueries({ queryKey: ["entreprises"], refetchType: 'all' });
      toast({
        title: "Entreprise supprimée avec succès",
        description: "L'entreprise a été supprimée de la base de données",
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
    queryKey: ["entreprises"],
    queryFn: async () => {
      const response = await entrepriseService.getEntreprises();
      return response;
    },
    // Ajouter staleTime pour contrôler quand les données sont considérées comme périmées
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    createEntrepriseMutation,
    data,
    isLoading,
    error,
    refetch,
    editEntrepriseMutation,
    deleteEntrepriseMutation,
  };
};
