"use client";

import { Button } from "@/components/ui/button";
import { UserCog, Crown, Users, Calculator } from "lucide-react";
import { useUserStore } from "@/store/zustandStores";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface RoleSwitcherButtonProps {
  targetRole: "CHEF_AGENCE" | "GESTIONNAIRE" | "CAISSIER";
  children?: React.ReactNode;
  className?: string;
}

export function RoleSwitcherButton({ targetRole, children, className }: RoleSwitcherButtonProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const roleConfig = {
    CHEF_AGENCE: {
      icon: Crown,
      label: "Mode Chef d'Agence",
      description: "Accès aux fonctionnalités chef d'agence"
    },
    GESTIONNAIRE: {
      icon: UserCog,
      label: "Mode Gestionnaire", 
      description: "Accès aux fonctionnalités gestionnaire"
    },
    CAISSIER: {
      icon: Calculator,
      label: "Mode Caissier",
      description: "Accès aux fonctionnalités caissier"
    }
  };

  const switchToRole = () => {
    if (user?.administrator || user?.role === "ADMIN" || user?.role === "ADMINISTRATEUR") {
      // Temporairement changer le rôle pour accéder aux fonctionnalités du rôle cible
      const tempUser = {
        ...user,
        originalAdministrator: user.administrator, // Sauvegarder le statut admin original
        originalRole: user.role, // Sauvegarder le rôle original
        administrator: false, // Désactiver le statut admin temporairement
        role: targetRole
      };
      
      setUser(tempUser);
      
      toast({
        title: `${roleConfig[targetRole].label} Activé`,
        description: roleConfig[targetRole].description,
      });
      
      // Rediriger vers le dashboard approprié
      router.push("/admin");
      
      // Optionnel : recharger la page pour forcer la mise à jour du layout
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const switchBackToAdmin = () => {
    if (user?.originalAdministrator !== undefined) {
      const adminUser = {
        ...user,
        administrator: user.originalAdministrator,
        role: user.originalRole
      };
      delete adminUser.originalAdministrator;
      delete adminUser.originalRole;
      
      setUser(adminUser);
      
      toast({
        title: "Mode Admin Activé",
        description: "Retour au dashboard administrateur",
      });
      
      router.push("/admin");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Si on est en mode temporaire, afficher le bouton de retour
  if (user?.originalAdministrator !== undefined) {
    const IconComponent = Users;
    return (
      <Button 
        onClick={switchBackToAdmin}
        variant="outline"
        className={className}
      >
        <IconComponent className="h-4 w-4 mr-2" />
        Retour Mode Admin
      </Button>
    );
  }

  // Si on est admin, afficher le bouton pour passer au rôle cible
  if (user?.administrator || user?.role === "ADMIN" || user?.role === "ADMINISTRATEUR") {
    const IconComponent = roleConfig[targetRole].icon;
    return (
      <Button 
        onClick={switchToRole}
        className={className}
      >
        <IconComponent className="h-4 w-4 mr-2" />
        {children || roleConfig[targetRole].label}
      </Button>
    );
  }

  return null;
}