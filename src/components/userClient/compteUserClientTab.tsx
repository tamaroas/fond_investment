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
import { Plus, Loader2, Pencil, Trash } from "lucide-react";
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
  onDelete: (id: string) => Promise<void>;
  onEdit: (compte: CompteType) => void;
  isDeleting: boolean;
}

// Composant pour afficher une ligne de compte avec actions
function TableRowCompte({ compte, onDelete, onEdit, isDeleting }: TableRowCompteProps) {
  return (
    <TableRow key={compte.id}>
      <TableCell>{compte.id}</TableCell>
      <TableCell>{compte.codeAgence}-{compte.numeroCompte || "N/A"}-{compte.cle || "N/A"}</TableCell>
      <TableCell>{compte.typeCompte}</TableCell>
      <TableCell>{compte.solde !== undefined ? `${compte.solde} FCFA` : "N/A"}</TableCell>
      <TableCell>{compte.dateOuvertureCompte || "N/A"}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            disabled
            onClick={() => onEdit(compte)}
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled 
            onClick={() => onDelete(compte.id || "")}
          >
            <Trash className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const CompteUserClientTab = () => {
  const params = useParams();
  const clientId = params.id as string;
  
  const [isCompteDialogOpen, setIsCompteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const {user} = useUserStore();
  const [selectedCompte, setSelectedCompte] = useState<CompteType | null>(null);
  
  // Utiliser le hook useCompteClient
  const { createCompteMutation, editCompteMutation, deleteCompteMutation } = useCompteClient(clientId);
  

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
  
  // Formulaire pour l'édition de compte
  const editCompteForm = useForm<CompteType>({
    resolver: zodResolver(CompteSchema),
    defaultValues: {
      id: "",
      clientId: clientId,
      gestionnaireId:  user?.id || "",
      agenceId: user?.agenceId || "",
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
      if (editCompteForm) {
        editCompteForm.reset({
          id: "",
          clientId: clientId,
          gestionnaireId: user.id,
          agenceId: user.agenceId || "",
          typeCompte: "PARTICULIER",
          montantPremierVersement: 0,
        });
      }
    }
  }, [user?.id, compteForm, editCompteForm]);
  

  useEffect(() => {
    if (selectedCompte) {
      editCompteForm.reset(selectedCompte);
    }
  }, [selectedCompte, editCompteForm]);
  
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

  const handleEditCompte = async (data: CompteType) => {
    try {
      // Assurez-vous que le clientId est défini
      const compteData = {
        ...data,
        clientId: clientId,
        gestionnaireId: user?.id || data.gestionnaireId,
      };
      
      // Utiliser la mutation de mise à jour de compte
      await editCompteMutation.mutateAsync(compteData);
      
      // Fermer le dialogue et réinitialiser le formulaire
      setIsEditDialogOpen(false);
      setSelectedCompte(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du compte:", error);
    }
  };
  
  // Gérer la suppression d'un compte
  const handleDeleteCompte = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      try {
        await deleteCompteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
      }
    }
  };
  
  // Ouvrir le dialogue d'édition
  const handleOpenEditDialog = (compte: CompteType) => {
    setSelectedCompte(compte);
    setIsEditDialogOpen(true);
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
          <CardTitle>Comptes</CardTitle>
          <CardDescription>Liste des comptes du client</CardDescription>
        </div>
        <Dialog open={isCompteDialogOpen} onOpenChange={setIsCompteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nouveau compte
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                      <FormLabel>ID de l'agence</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Entrez l'ID de l'agence" {...field} />
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
        </Dialog>
        
        {/* Dialogue d'édition de compte */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le compte</DialogTitle>
              <DialogDescription>
                Modifiez les informations du compte.
              </DialogDescription>
            </DialogHeader>
            <Form {...editCompteForm}>
              <form onSubmit={editCompteForm.handleSubmit(handleEditCompte)} className="space-y-4">
                <FormField
                  control={editCompteForm.control}
                  name="agenceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de l'agence</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez l'ID de l'agence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCompteForm.control}
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
                  control={editCompteForm.control}
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
                  <Button type="submit" disabled={editCompteMutation.isPending}>
                    {editCompteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour en cours...
                      </>
                    ) : (
                      "Mettre à jour"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!comptesData || comptesData.length === 0 ? (
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
              {comptesData.map((compte) => (
                <TableRowCompte 
                  key={compte.id} 
                  compte={compte} 
                  onDelete={handleDeleteCompte}
                  onEdit={handleOpenEditDialog}
                  isDeleting={deleteCompteMutation.isPending}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CompteUserClientTab;
