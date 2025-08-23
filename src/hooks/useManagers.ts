"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import managerService from '../services/manager-service';
import { toast } from '@/components/ui/use-toast';
import { Manager } from '@/utils/type/gestionnaire';
interface UseManagersProps {
  agencyId?: string;
}

export default function useManagers({ agencyId }: UseManagersProps) {
  const queryClient = useQueryClient();

  // GET managers
  const {
    data: managers = [],
    isLoading: loading,
    error,
    refetch: refetchManagers,
  } = useQuery<Manager[], Error>({
    queryKey: ['managers'],
    queryFn: async () => {
      const response = await managerService.getManagers();
      return response.content;
    },
  });

  const managersOfAgency = useQuery<Manager[], Error>({
    queryKey: ['managers', agencyId],
    queryFn: async () => {
      const response = await managerService.getManagersByAgence(agencyId || "");
      return response.content;
    },
    enabled: !!agencyId,
  });
  // CREATE
  const addMutation = useMutation({
    mutationFn: async (manager: Manager) => {
      return await managerService.createManager(manager);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      toast({
        title: "Gestionnaire ajouté avec succès",
        variant: "default",
      });
      refetchAll()
    },
    onError: (error: any) => {
      console.error("Error adding manager:", error);
      toast({
        title: "Erreur lors de l'ajout du gestionnaire",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // UPDATE
  const editMutation = useMutation({
    mutationFn: ({ id, manager }: { id: string; manager: Partial<Manager> }) =>
      managerService.updateManager(id, manager),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers', agencyId] });
      toast({
        title: "Gestionnaire modifié avec succès",
        variant: "default",
      });
      refetchAll()
    },
    onError: (error: any) => {
      console.error("Error updating manager:", error);
      toast({
        title: "Erreur lors de la modification du gestionnaire",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  // DELETE
  const removeMutation = useMutation({
    mutationFn: (id: string) => managerService.deleteManager(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managers'] });
      toast({
        title: "Gestionnaire supprimé avec succès",
        variant: "default",
      });
      refetchAll()
    },
    onError: (error: any) => {
      console.error("Error deleting manager:", error);
      toast({
        title: "Erreur lors de la suppression du gestionnaire",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const addManager = async (manager: Manager) => {
    await addMutation.mutateAsync(manager);
  };

  const editManager = async (id: string, manager: Partial<Manager>) => {
    await editMutation.mutateAsync({ id, manager });
  };

  const removeManager = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  function refetchAll() {
    refetchManagers();
    managersOfAgency.refetch();
  };
  return {
    managers: agencyId ? managersOfAgency?.data : managers,
    loading,
    error,
    addManager,
    managersOfAgency: managersOfAgency?.data,
    editManager,
    removeManager,
    fetchManagers: () => queryClient.invalidateQueries({ queryKey: ['managers'] }),
    refetchAll,
  };
}
