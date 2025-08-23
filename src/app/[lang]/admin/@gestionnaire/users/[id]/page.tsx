"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserClientType } from "@/schemas/userClient-schema";
import userClientService from "@/services/userClient-services";
import { Loader2, Eye, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import CompteUserClientTab from '@/components/userClient/compteUserClientTab';
import AffiliationUserClientTab from '@/components/userClient/affiliationUserClientTab';



type DictionaryType = {
  [key: string]: string;
};

function SingleUserClientPage() {
  const params = useParams();
  const id = params.id as string;
  const lang = params.lang as string;
  const [client, setClient] = useState<UserClientType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isIdentityDialogOpen, setIsIdentityDialogOpen] = useState(false);


  const dictionary: DictionaryType = {
    logout: "Déconnexion",
    profile: "Profil",
    settings: "Paramètres",
  };
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await userClientService.getUserClientById(id);
        setClient(response.content);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du client",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [id]);

  const handleViewIdentity = () => {
    // Pour l'instant, nous simulons l'affichage d'une pièce d'identité
    // Dans un vrai système, cela pourrait récupérer le fichier depuis le serveur
    setIsIdentityDialogOpen(true);
  };
  

  

  
  if (loading) {
    return (
      <ContentLayout title="Chargement..." dictionary={dictionary}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ContentLayout>
    );
  }
  
  if (!client) {
    return (
      <ContentLayout title="Client non trouvé" dictionary={dictionary}>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold">Client non trouvé</h2>
          <p className="text-muted-foreground">Le client demandé n`&apos;`existe pas ou a été supprimé.</p>
        </div>
      </ContentLayout>
    );
  }
  
  return (
    <ContentLayout title={`Client: ${client.nom} ${client.prenom}`} dictionary={dictionary}>
      <div className="mb-4">
        <BreadcrumbCustom
          options={[
            { label: "Accueil", path: `/${lang}/admin` },
            { label: "Clients", path: `/${lang}/admin/users` },
            { label: `${client.nom} ${client.prenom}` },
          ]}
        />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Client: {client.nom} {client.prenom}
        </h1>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Détails du client</TabsTrigger>
          <TabsTrigger value="comptes">Comptes</TabsTrigger>
          <TabsTrigger value="affiliations">Affiliations</TabsTrigger>
        </TabsList>
        
        {/* Onglet Détails */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Détails du client {client.nom} {client.prenom}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Nom:</span> {client.nom}
                  </div>
                  <div>
                    <span className="font-semibold">Prénom:</span> {client.prenom}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {client.email}
                  </div>
                  <div>
                    <span className="font-semibold">Téléphone:</span> {client.telephone}
                  </div>
                  <div>
                    <span className="font-semibold">Sexe:</span> {client.sexe}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Date de naissance:</span> {client.dateNaissance}
                  </div>
                  <div>
                    <span className="font-semibold">Lieu de naissance:</span> {client.lieuNaissance}
                  </div>
                  <div>
                    <span className="font-semibold">Adresse:</span> {client.adresse}
                  </div>
                  <div>
                    <span className="font-semibold">Nationalité:</span> {client.nationalite}
                  </div>
                  <div>
                    <span className="font-semibold">Numéro CNI:</span> {client.numeroCni}
                  </div>
                </div>
              </div>
              
              {/* Bouton pour afficher la pièce d'identité */}
              <div className="mt-6 pt-4 border-t">
                <Dialog open={isIdentityDialogOpen} onOpenChange={setIsIdentityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={handleViewIdentity}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Afficher pièce d'identité
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Pièce d'identité - {client.nom} {client.prenom}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
                      <FileText className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="text-gray-600 text-center">
                        Aucune pièce d'identité disponible pour ce client.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        La fonctionnalité d'affichage sera implémentée avec l'intégration backend.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Comptes */}
        <TabsContent value="comptes">
          <CompteUserClientTab />
        </TabsContent>
        
        {/* Onglet Affiliations */}
        <TabsContent value="affiliations">
          <AffiliationUserClientTab />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}

export default SingleUserClientPage;
