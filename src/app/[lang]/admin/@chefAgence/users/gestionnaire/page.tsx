
"use client";

import React from 'react';
import GestionnaireContent from '@/components/admin-panel/users/GestionnaireContent';
import { useUserStore } from "@/store/zustandStores";

function ChefAgenceGestionnairePage() {
  const { user } = useUserStore();
  const agenceId = user?.agenceId;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des Gestionnaires</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les gestionnaires de votre agence • Accès aux mêmes fonctionnalités que l'admin
        </p>
      </div>
      
      {/* Réutiliser le composant de l'admin avec l'agenceId du chef d'agence */}
      <GestionnaireContent agencyId={agenceId} />
    </div>
  );
}

export default ChefAgenceGestionnairePage;
