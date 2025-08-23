import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import typeContratService from "@/services/type-contrat-service";
import { TypeContrat } from "@/schemas/type-contrat.schema";
import { toast } from "@/components/ui/use-toast";

export const useTypeContrats = () => {
  const queryClient = useQueryClient();

  const query = useQuery<TypeContrat[]>({
    queryKey: ["type-contrats"],
    queryFn: async () => {
      const res = await typeContratService.getTypeContrats();
      return res.content;
    },
  });

  const create = useMutation({
    mutationFn: async (payload: Omit<TypeContrat, 'id'>) => {
      const res = await typeContratService.createTypeContrat(payload);
      return res.content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['type-contrats'] });
      toast({
        title: "Type de contrat modifié avec succès",
        variant: "default",
      });
      query.refetch();
    },
    onError: (error: any) => {
      console.error("Error updating cashier:", error);
      toast({
        title: "Erreur lors de la modification du plan",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<TypeContrat> }) => {
      const res = await typeContratService.updateTypeContrat(id, payload);
      return res.content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-contrats"] });
      toast({
        title: "Type de contrat modifié avec succès",
        variant: "default",
      });
      query.refetch();
    },
    onError: (error: any) => {
      console.error("Error updating cashier:", error);
      toast({
        title: "Erreur lors de la modification du plan",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await typeContratService.deleteTypeContrat(id);
      return res.content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["type-contrats"] });
      toast({
        title: "Type de contrat supprimé avec succès",
        variant: "default",
      });
      query.refetch();
    },
    onError: (error: any) => {
      console.error("Error deleting plan:", error);
      toast({
        title: "Erreur lors de la suppression du plan",
        description: error.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    },
  });

  return { ...query, create, update, remove };
};
