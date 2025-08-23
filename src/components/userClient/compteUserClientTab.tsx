"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Plus, Loader2, Printer } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompteSchema, CompteType } from "@/schemas/userClient-schema";
import compteService from "@/services/compte-services";
import userClientService from "@/services/userClient-services";
import { useCompteClient } from '@/hooks/use-userClient';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { useUserStore } from '@/store/zustandStores';

// Type pour les props du TableRowCompte
interface TableRowCompteProps {
  compte: CompteType;
  onPrint: (compte: CompteType) => void;
}

// Composant pour afficher une ligne de compte avec actions
function TableRowCompte({ compte, onPrint }: TableRowCompteProps) {
  return (
    <TableRow key={compte.id}>
      <TableCell>{compte.id}</TableCell>
      <TableCell>{compte.codeAgence}-{compte.numeroCompte || "N/A"}-{compte.cle || "N/A"}</TableCell>
      <TableCell>{compte.typeCompte}</TableCell>
      <TableCell>{compte.solde !== undefined ? `${compte.solde.toLocaleString().replace(/\s/g, ' ')} FCFA` : "N/A"}</TableCell>
      <TableCell>{compte.dateOuvertureCompte || "N/A"}</TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onPrint(compte)}
          title="Imprimer le relevé de compte"
        >
          <Printer className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

const CompteUserClientTab = () => {
  const params = useParams();
  const clientId = params.id as string;
  
  const [isCompteDialogOpen, setIsCompteDialogOpen] = useState(false);
  const {user} = useUserStore();
  
  // Utiliser le hook useCompteClient
  const { createCompteMutation } = useCompteClient(clientId);
  

  // Récupérer les comptes du client
  const { data: comptesData, isLoading: isComptesLoading } = useQuery({
    queryKey: ['comptes' + clientId],
    queryFn: async () => {
      const response = await compteService.getComptesByClientId(clientId);
      return response.content || [];
    }
  });
  
  // Formulaire pour la création de compte
  const compteForm = useForm<CompteType>({
    resolver: zodResolver(CompteSchema),
    defaultValues: {
      clientId: clientId,
      gestionnaireId: user?.id || "",
      agenceId: "",
      typeCompte: "PARTICULIER",
      montantPremierVersement: 0,
    },
  });
  
  
  // Mettre à jour le gestionnaireId dans le formulaire lorsqu'il est disponible
  useEffect(() => {
    if (user) {
      compteForm.reset({
        clientId: clientId,
        gestionnaireId: user.id,
        agenceId: user.agenceId || "",
        typeCompte: "PARTICULIER",
        montantPremierVersement: 0,
      });
    }
  }, [user?.id, compteForm]);
  
  // Gérer la création d'un compte
  const handleCreateCompte = async (data: CompteType) => {
    try {
      // Assurez-vous que le clientId est défini
      const compteData = {
        ...data,
        clientId: clientId,
        gestionnaireId: user?.id || "",
      };
      
      // Utiliser la mutation de création de compte
      await createCompteMutation.mutateAsync(compteData);
      
      // Fermer le dialogue et réinitialiser le formulaire
      setIsCompteDialogOpen(false);
      compteForm.reset({
        clientId: clientId,
        gestionnaireId: user?.id || "",
        agenceId: user?.agenceId || "",
        typeCompte: "PARTICULIER",
        montantPremierVersement: 0,
      });
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
    }
  };

  
  
  // Fonction pour imprimer le relevé de compte
  const handlePrintReleve = (compte: CompteType) => {
    // Créer le contenu HTML du relevé
    const printContent = `
      <html>
        <head>
          <title>Relevé de Compte - ${compte.numeroCompte}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .account-info { margin-bottom: 20px; }
            .account-info table { width: 100%; border-collapse: collapse; }
            .account-info td { padding: 8px; border: 1px solid #ddd; }
            .account-info td:first-child { font-weight: bold; background-color: #f5f5f5; }
            h1 { color: #333; }
            h2 { color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELEVÉ DE COMPTE</h1>
            <p>Date d'impression: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div class="account-info">
            <h2>Informations du Compte</h2>
            <table>
              <tr>
                <td>ID du Compte</td>
                <td>${compte.id}</td>
              </tr>
              <tr>
                <td>RIB</td>
                <td>${compte.codeAgence}-${compte.numeroCompte || "N/A"}-${compte.cle || "N/A"}</td>
              </tr>
              <tr>
                <td>Type de Compte</td>
                <td>${compte.typeCompte}</td>
              </tr>
              <tr>
                <td>Solde Actuel</td>
                <td>${compte.solde !== undefined ? `${compte.solde.toLocaleString().replace(/\s/g, ' ')} FCFA` : "N/A"}</td>
              </tr>
              <tr>
                <td>Date d'Ouverture</td>
                <td>${compte.dateOuvertureCompte || "N/A"}</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
  
  const isLoading = isComptesLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Compte</CardTitle>
          <CardDescription>Comptes du client</CardDescription>
        </div>
        { (!comptesData)&&<Dialog open={isCompteDialogOpen} onOpenChange={setIsCompteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nouveau compte
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Créer un nouveau compte</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau compte pour ce client.
              </DialogDescription>
            </DialogHeader>
            <Form {...compteForm}>
              <form onSubmit={compteForm.handleSubmit(handleCreateCompte)} className="space-y-4">
                <FormField
                  control={compteForm.control}
                  name="agenceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de l`&apos;`agence</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Entrez l`&apos;`ID de l`&apos;`agence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={compteForm.control}
                  name="typeCompte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de compte</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type de compte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PARTICULIER">Particulier</SelectItem>
                          <SelectItem value="COURANT">Courant</SelectItem>
                          <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={compteForm.control}
                  name="montantPremierVersement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant du premier versement</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Entrez le montant du premier versement" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={createCompteMutation.isPending}>
                    {createCompteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      "Créer le compte"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>}
      </CardHeader>
      <CardContent>
        {!comptesData ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucun compte trouvé pour ce client.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>RIB</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Solde</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             
                <TableRowCompte 
                  key={comptesData.id} 
                  compte={comptesData} 
                  onPrint={handlePrintReleve}
                />
            
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CompteUserClientTab;
