'use client'
import { LoginformType } from "@/schemas/auth-schema";
import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/auth-services";
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
      setUser(response.content.user);
      
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