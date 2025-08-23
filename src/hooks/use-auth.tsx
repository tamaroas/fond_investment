'use client'
import { LoginformType } from "@/schemas/auth-schema";
import type { UpdateProfileDTO } from "@/services/auth-services";
import { useMutation } from "@tanstack/react-query";
import AuthService, { updateProfile } from "@/services/auth-services";
import { toast } from "@/components/ui/use-toast";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/zustandStores";

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: async (data: LoginformType) => {

      const response = await AuthService.login(data);
      cookies.set("access_token", response.content.accessToken);
      return response;
    },
    onSuccess: (response): void => {
      setUser({
        ...response.content.user,
        administrator: null,
        customer: null
      });

      toast({
        variant: "default",
        title: "Login successful",
        description: "You have successfully logged in",
      });
      router.push("/admin");
    },
    onError: (error: any) => {
      console.log(error);

      toast({
        title: "Login failed",
        description: error.data.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProfile = () => {
  const { setUser, user } = useUserStore();

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      if (!user?.id) throw new Error("Aucun utilisateur connecté");
      const payload: UpdateProfileDTO = {
        nom: data.nom,
        prenom: data.prenom,
        username: data.username,
        telephone: data.telephone,
        email: data.email,
      };
      const response = await updateProfile(user.id, payload);
      return response;
    },
    onSuccess: (response) => {
      setUser({ ...user, ...response.content });
      toast({
        title: "Profil mis à jour",
        description: response.message || "Vos informations ont été mises à jour avec succès.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error?.data?.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    },
  });
};