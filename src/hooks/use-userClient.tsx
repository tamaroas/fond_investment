'use client'
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { UserClientType } from "@/schemas/userClient-schema";
import userClientService from "@/services/userClient-services";
import { useQueryClient } from "@tanstack/react-query";

export const useUserClient = () => {
 const queryClient = useQueryClient();


  const createUserClientMutation = useMutation({
    mutationFn: async (data: UserClientType) => {
      const response = await userClientService.createUserClient(data);
      return response;
    },
    onSuccess: (response): void => {
      queryClient.invalidateQueries({ queryKey: ["userClients"] });
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
      queryClient.invalidateQueries({ queryKey: ["userClients"] });
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
      queryClient.invalidateQueries({ queryKey: ["userClients"] });
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

  const {data, isLoading, error} = useQuery({
    queryKey: ["userClients"],
    queryFn: async () => {
      const response = await userClientService.getUserClients();
      
      return response;
    },
  });

  return {
    createUserClientMutation,
    data,
    isLoading,
    error,
    editUserClientMutation,
    deleteUserClientMutation,
  };
};
