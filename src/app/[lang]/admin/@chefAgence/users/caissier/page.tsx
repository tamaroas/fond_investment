"use client";

import React from 'react';
import CaissierContent from '@/components/admin-panel/users/CaissierContent';
import { useUserStore } from "@/store/zustandStores";

function ChefAgenceCaissierPage() {
  const { user } = useUserStore();
  const agenceId = user?.agenceId;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des Caissiers</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les caissiers de votre agence • Accès aux mêmes fonctionnalités que l'admin
        </p>
      </div>
      
      {/* Réutiliser le composant de l'admin avec l'agenceId du chef d'agence */}
      <CaissierContent agencyId={agenceId} />
    </div>
  );
}

export default ChefAgenceCaissierPage;
