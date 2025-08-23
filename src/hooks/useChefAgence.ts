import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import agencyService from "@/services/agency-services";
import { toast } from "@/components/ui/use-toast";
import { ChefAgenceFormType } from "@/lib/zodSchema";

export type ChefAgenceForm = {
  agenceId: string;
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  email: string;
  mot2passe: string;
};

const initialChefForm: ChefAgenceForm = {
  agenceId: '',
  nom: '',
  prenom: '',
  username: '',
  telephone: '',
  email: '',
  mot2passe: '',
};

export function useChefAgence() {
  // Modals states
  const [showChefCreate, setShowChefCreate] = useState(false);
  const [showChefEdit, setShowChefEdit] = useState(false);
  const [showChefDelete, setShowChefDelete] = useState(false);
  const [chefForm, setChefForm] = useState<ChefAgenceForm>(initialChefForm);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch agency info (for chefAgence)
  // const { data: chefAgence, refetch: refetchChefAgence, isLoading: isLoadingChefAgence } = useQuery({
  //   queryKey: ["chefAgence"],
  //   queryFn: async () => {
  //     const response = await agencyService.getChefAgencyByIdAgence(agencyId);
  //     return response.content;
  //   },
  //   enabled: !!agencyId,
  // });
  const { data: chefAgences, refetch: refetchChefAgences, isLoading: isLoadingChefAgences } = useQuery({
    queryKey: ["chefAgences"],
    queryFn: async () => {
      const response = await agencyService.getAllChefAgence();
      return response.content;
    },
  });

  // Create chef d'agence
  const createChefMutation = useMutation({
    mutationFn:async (data: ChefAgenceFormType) => await agencyService.createChefAgence(data.agenceId, data),
    onSuccess: () => {
      toast({ title: "Chef d'agence créé avec succès" });
      setShowChefCreate(false);
      refetchChefAgences?.();
    },
    onError: (error:any) => toast({ title: "Erreur lors de la création", variant: "destructive", description:error.data?.message }),
  });

  // Update chef d'agence
  const updateChefMutation = useMutation({
    mutationFn: (data: ChefAgenceFormType) => agencyService.updateChefAgence(data.agenceId, data),
    onSuccess: () => {
      toast({ title: "Chef d'agence modifié avec succès" });
      setShowChefEdit(false);

    },
    onError: (error:any) => toast({ title: "Erreur lors de la modification", variant: "destructive", description:error.data?.message }),
  });

  // Delete chef d'agence
  const deleteChefMutation = useMutation({
    mutationFn: (chefId: string) => agencyService.deleteChefAgence(chefId),
    onSuccess: () => {
      toast({ title: "Chef d'agence supprimé avec succès" });
      setShowChefDelete(false);
      refetchChefAgences?.();
    },
            onError: (error:any) => {
                toast({ title: "Erreur lors de la suppression", variant: "destructive" ,description: error.data?.message });
            },
  });

  // Handlers
  const handleChefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChefForm({ ...chefForm, [e.target.name]: e.target.value });
  };
  async function  handleChefSubmit (values: ChefAgenceFormType) {
    if (showChefCreate) await createChefMutation.mutateAsync(values);
    else if (showChefEdit)await updateChefMutation.mutateAsync(values);
  };

  return {
    chefForm,
    setChefForm,
    showChefCreate,
    setShowChefCreate,
    showChefEdit,
    setShowChefEdit,
    showChefDelete,
    setShowChefDelete,
    isLoading,
    chefAgences,
    handleChefSubmit,
    createChefMutation,
    updateChefMutation,
    deleteChefMutation,
  };
}
