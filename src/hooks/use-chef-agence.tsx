import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chefAgenceService, { AgencyStats } from '@/services/chef-agence-services';
import { AgencyUser } from '@/utils/type/agency';
import { toast } from '@/components/ui/use-toast';

export const useChefAgence = (agenceId: string) => {
  const queryClient = useQueryClient();

  // Hook pour récupérer les statistiques de l'agence
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats
  } = useQuery<AgencyStats>({
    queryKey: ['agencyStats', agenceId],
    queryFn: () => chefAgenceService.getAgencyStats(agenceId),
    enabled: !!agenceId,
  });

  // Hook pour récupérer les utilisateurs de l'agence
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery<AgencyUser[]>({
    queryKey: ['agencyUsers', agenceId],
    queryFn: () => chefAgenceService.getAgencyUsers(agenceId),
    enabled: !!agenceId,
  });

  // Mutation pour activer/désactiver un utilisateur
  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: boolean }) =>
      chefAgenceService.toggleUserStatus(userId, status),
    onSuccess: (success, { status }) => {
      if (success) {
        toast({
          title: "Succès",
          description: `Utilisateur ${status ? 'activé' : 'désactivé'} avec succès`,
        });
        // Refetch users data
        queryClient.invalidateQueries({ queryKey: ['agencyUsers', agenceId] });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le statut de l'utilisateur",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut",
        variant: "destructive",
      });
    },
  });

  return {
    // Stats
    stats,
    isStatsLoading,
    statsError,
    refetchStats,
    
    // Users
    users,
    isUsersLoading,
    usersError,
    refetchUsers,
    
    // Mutations
    toggleUserStatus: toggleUserStatusMutation.mutate,
    isToggling: toggleUserStatusMutation.isPending,
  };
};