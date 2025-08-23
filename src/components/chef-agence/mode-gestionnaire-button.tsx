"use client";

import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import { useUserStore } from "@/store/zustandStores";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface ModeGestionnaireButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function ModeGestionnaireButton({ children, className }: ModeGestionnaireButtonProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const switchToGestionnaireMode = () => {
    if (user?.role === "CHEF_AGENCE") {
      // Temporairement changer le rôle pour accéder aux fonctionnalités gestionnaire
      const gestionnaireUser = {
        ...user,
        originalRole: user.role, // Sauvegarder le rôle original
        role: "GESTIONNAIRE"
      };
      
      setUser(gestionnaireUser);
      
      toast({
        title: "Mode Gestionnaire Activé",
        description: "Vous avez maintenant accès à toutes les fonctionnalités gestionnaire",
      });
      
      // Rediriger vers le dashboard gestionnaire
      router.push("/admin");
      
      // Optionnel : recharger la page pour forcer la mise à jour du layout
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const switchBackToChefMode = () => {
    if (user?.originalRole === "CHEF_AGENCE") {
      const chefUser = {
        ...user,
        role: user.originalRole
      };
      delete chefUser.originalRole;
      
      setUser(chefUser);
      
      toast({
        title: "Mode Chef d'Agence Activé",
        description: "Retour au dashboard chef d'agence",
      });
      
      router.push("/admin");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Si on est en mode gestionnaire temporaire, afficher le bouton de retour
  if (user?.originalRole === "CHEF_AGENCE") {
    return (
      <Button 
        onClick={switchBackToChefMode}
        variant="outline"
        className={className}
      >
        <UserCog className="h-4 w-4 mr-2" />
        Retour Mode Chef
      </Button>
    );
  }

  // Si on est chef d'agence, afficher le bouton pour passer en mode gestionnaire
  if (user?.role === "CHEF_AGENCE") {
    return (
      <Button 
        onClick={switchToGestionnaireMode}
        className={className}
      >
        <UserCog className="h-4 w-4 mr-2" />
        {children || "Mode Gestionnaire"}
      </Button>
    );
  }

  return null;
}