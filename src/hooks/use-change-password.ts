import { useMutation } from "@tanstack/react-query";
import { changePassword, ChangePasswordDTO } from "@/services/auth-services";
import { toast } from "@/components/ui/use-toast";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordDTO) => {
      return await changePassword(data);
    },
    onSuccess: (data) => {
      toast({
        title: "Mot de passe changé",
        description: data.message || "Votre mot de passe a été modifié avec succès.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.data?.message || "Une erreur est survenue lors du changement de mot de passe.",
        variant: "destructive",
      });
    },
  });
}
