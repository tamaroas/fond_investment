import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import caissierService from '../services/cashier-service';
import { toast } from '@/components/ui/use-toast';
import { Caissier } from '@/utils/type/caissier';
import { useParams } from 'next/navigation';
interface UseCaissiersProps {
  agencyId?: string;
}
export default function useCaissiers({ agencyId }: UseCaissiersProps) {
  const queryClient = useQueryClient();

  const {
    data: caissiers = [],
    isLoading: loading,
    error,
    refetch: refetchCaissiers,
  } = useQuery<Caissier[], Error>({
    queryKey: ['caissiers'],
    queryFn: async () => {
      const response = await caissierService.getCaissiers();
      return response?.content;
    },
  });
  const caissiersOfAgency = useQuery<Caissier[], Error>({
    queryKey: ['caissiers' + agencyId],
    queryFn: async () => {
      const response = await caissierService.getCaissiersByAgence(agencyId as string);

      return response?.content;
    },
    enabled: !!agencyId,
  });

  // CREATE
  const addMutation = useMutation({
    mutationFn: async (caissier: Caissier) => await caissierService.createCaissier(caissier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashiers'] });
      toast({
        title: "Caissier ajouté avec succès",
        variant: "default",
      });
      refetchAll();
    },
    onError: (error: any) => {
      console.error("Error adding cashier:", error);
      toast({
        title: "Erreur lors de l'ajout du caissier",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // UPDATE
  const editMutation = useMutation({
    mutationFn: ({ id, caissier }: { id: string; caissier: Partial<Caissier> }) =>
      caissierService.updateCaissier(id, caissier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashiers' + agencyId] });
      toast({
        title: "Caissier modifié avec succès",
        variant: "default",
      });
      refetchAll();
    },
    onError: (error: any) => {
      console.error("Error updating cashier:", error);
      toast({
        title: "Erreur lors de la modification du caissier",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // DELETE
  const removeMutation = useMutation({
    mutationFn: (id: string) => caissierService.deleteCaissier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashiers'] });
      toast({
        title: "Caissier supprimé avec succès",
        variant: "default",
      });
      refetchAll();
    },
    onError: (error: any) => {
      console.error("Error deleting cashier:", error);
      toast({
        title: "Erreur lors de la suppression du caissier",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const addCaissier = async (caissier: Caissier) => {
    await addMutation.mutateAsync(caissier);
  };

  const editCaissier = async (id: string, caissier: Partial<Caissier>) => {
    await editMutation.mutateAsync({ id, caissier });
  };

  const removeCaissier = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };
  function refetchAll() {
    refetchCaissiers();
    caissiersOfAgency.refetch();
  };
  return {
    caissiers: agencyId ? caissiersOfAgency?.data : caissiers,
    loading,
    error,
    addCaissier,
    editCaissier,
    caissiersOfAgency: caissiersOfAgency?.data,
    removeCaissier,
    fetchCaissiers: () => queryClient.invalidateQueries({ queryKey: ['caissiers'] }),
  };
}
