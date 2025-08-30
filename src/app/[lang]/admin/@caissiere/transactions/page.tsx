'use client';
import React, { useState, useEffect } from 'react';
import type { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MontantInput } from "@/components/ui/montant-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransaction } from '@/hooks/use-transaction';
import { ChevronRight, Loader2, Search, CheckCircle, Printer } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from '@/store/zustandStores';
import { ContratType } from '@/utils/type/transactions';
import { toast } from '@/components/ui/use-toast';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Définition des schémas de validation Zod
const searchSchema = z.object({
  searchTerm: z.string().min(1, "Le terme de recherche est requis")
});

const transactionSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  description: z.string().optional()
});

const compteRecepteurSchema = z.object({
  numeroCompteRecepteur: z.string().min(1, "Le numéro de compte est requis"),
  codeAgenceRecepteur: z.string().min(1, "Le code agence est requis"),
  cleRecepteur: z.string().min(1, "La clé est requise")
});

const transfertSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  motif: z.string().min(1, "Le motif est requis")
});

const cotisationSchema = z.object({
  montant: z.string().min(1, "Le montant est requis"),
  origineFond: z.string().optional().optional()
});

function TransactionsPage() {
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('depot');
  const [showCotisationForm, setShowCotisationForm] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();
  
  // Formulaires React Hook Form
  const searchForm = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: ''
    }
  });
  
  const transactionForm = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      montant: '',
      description: ''
    }
  });
  
  const compteRecepteurForm = useForm({
    resolver: zodResolver(compteRecepteurSchema),
    defaultValues: {
      numeroCompteRecepteur: '',
      codeAgenceRecepteur: '',
      cleRecepteur: ''
    }
  });
  
  const transfertForm = useForm({
    resolver: zodResolver(transfertSchema),
    defaultValues: {
      montant: '',
      motif: ''
    }
  });
  
  const cotisationForm = useForm({
    resolver: zodResolver(cotisationSchema),
    defaultValues: {
      montant: '',
    }
  });

  const {
    compteInfo,
    compteRecepteurInfo,
    isVerifying,
    isVerifyingRecepteur,
    verifierCompteMutation,
    verifierCompteRecepteurMutation,
    effectuerDepotMutation,
    effectuerRetraitMutation,
    effectuerDepotAgenceMutation,
    effectuerCotisationMutation,
    effectuerTransfertMutation,
    transactions,
    isLoadingTransactions,
    refetchTransactions,
    resetCompteInfo,
    resetCompteRecepteurInfo,
    // Nouvelles fonctionnalités pour la recherche multi-critères
    searchComptesMutation,
    searchResults,
    isSearching,
    selectCompte,
    clearSearchResults
  } = useTransaction();

  // Fonction pour gérer la recherche avec React Hook Form
  const handleSearchComptes: SubmitHandler<{ searchTerm: string }> = async (data) => {
    const { searchTerm } = data;
    
    // Vérifier si c'est un numéro de compte à 11 chiffres
    const isAccountNumber = /^\d{11}$/.test(searchTerm.trim());
    
    if (isAccountNumber) {
      // Si c'est un numéro de compte, utiliser la vérification de compte
      await verifierCompteMutation.mutateAsync(searchTerm.trim());
      // Réinitialiser le champ de recherche après la vérification
      searchForm.reset();
    } else {
      // Sinon, effectuer une recherche normale
      await searchComptesMutation.mutateAsync({
        value: searchTerm,
      });
    }
  };

  // Fonction pour réinitialiser le champ de recherche
  const resetSearchFields = () => {
    searchForm.reset();
    clearSearchResults();
  };

  // Fonction pour gérer les transactions (dépôt et retrait)
  const handleTransaction: SubmitHandler<{ montant: string, description: string }> = async (data) => {
  
    try {
      if (!compteInfo || isSubmitting) return;
    
      const { montant, description } = data;
  
      // Ensure agenceId is a string (not undefined)
      if (!user?.agenceId) {
        toast({
          title: "Erreur de transaction",
          description: "L'identifiant de l'agence est manquant",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
  
      let transactionData:any = {
        montant: parseFloat(montant),
        agenceId: user.agenceId,
        compteId: compteInfo.id,
     
      };
  
      setIsSubmitting(true);
      if (activeTab === 'depot') {
        transactionData={...transactionData,origineFond:description};
        await effectuerDepotAgenceMutation.mutateAsync(transactionData);
        
        // Imprimer le reçu de dépôt
        handlePrintRecuDepot({
          montant: parseFloat(montant),
          origineFond: description
        });
        
        setIsSubmitting(false);
      } else {
        await effectuerRetraitMutation.mutateAsync(transactionData);
        
        // Imprimer le reçu de retrait
        handlePrintRecuRetrait({
          montant: parseFloat(montant)
        });
        
        setIsSubmitting(false);
      }
      
      refetchTransactions();
      transactionForm.reset();
      
    } catch (error) {
      setIsSubmitting(false);
    }
   
  };

  // Fonction pour vérifier le compte récepteur
  const handleVerifierCompteRecepteur: SubmitHandler<{
    numeroCompteRecepteur: string,
    codeAgenceRecepteur: string,
    cleRecepteur: string
  }> = async (data) => {
    try {
      await verifierCompteRecepteurMutation.mutateAsync({
        numeroCompte: data.numeroCompteRecepteur,
        codeAgence: data.codeAgenceRecepteur,
        cle: data.cleRecepteur
      });
    } catch (error) {
      // L'erreur est déjà gérée dans la mutation
    }
  };

  // Fonction pour gérer le transfert
  const handleTransfert: SubmitHandler<{ montant: string, motif: string }> = async (data) => {
    if (!compteInfo || !compteRecepteurInfo) {
      toast({
        title: "Vérification requise",
        description: "Veuillez vérifier le compte destinataire avant d'effectuer le transfert",
        variant: "destructive",
      });
      return;
    }
    
    const { numeroCompteRecepteur, codeAgenceRecepteur, cleRecepteur } = compteRecepteurForm.getValues();

    const transfertData = {
      compteId: compteInfo.id,
      montant: parseFloat(data.montant),
      motif: data.motif,
      agenceId: user!.agenceId ?? '',
      numeroCompteRecepteur,
      codeAgenceRecepteur,
      cleRecepteur
    };

    await effectuerTransfertMutation.mutateAsync(transfertData);
    refetchTransactions();

    // Réinitialiser les champs après le transfert
    transfertForm.reset();
    resetCompteRecepteurInfo();
  };

  // Fonction pour gérer la cotisation
  const handleCotisation: SubmitHandler<{ montant: string, origineFond?: string }> = async (data) => {
    if (!compteInfo || !selectedContrat) return;

    const cotisationData = {
      montant: parseFloat(data.montant),
      origineFond: "COMPTE_CLIENT",
      contratId: selectedContrat,
    };

    await effectuerCotisationMutation.mutateAsync(cotisationData);
    
    // Trouver le contrat sélectionné pour l'impression
    const selectedContratInfo = compteInfo.contrats?.find((c: ContratType) => c.id === selectedContrat);
    
    // Imprimer le reçu selon le type de contrat
    if (selectedContratInfo?.typeContrat?.type === "EPARGNE") {
      handlePrintRecuEpargne({
        montant: parseFloat(data.montant)
      }, selectedContratInfo);
    } else if (selectedContratInfo?.typeContrat?.type === "INVESTISSEMENT") {
      handlePrintRecuInvestissement({
        montant: parseFloat(data.montant)
      }, selectedContratInfo);
    }
    
    refetchTransactions();

    // Réinitialiser les champs après la cotisation
    cotisationForm.reset();
    setSelectedContrat('');
    setShowCotisationForm(false);
  };

  // Fonction pour réinitialiser tous les formulaires
  const handleReset = () => {
    resetCompteInfo();
    searchForm.reset();
    transactionForm.reset();
    compteRecepteurForm.reset();
    transfertForm.reset();
    cotisationForm.reset();
  };
  
  // Fonction pour réinitialiser lors du changement d'onglet
  const handleNavigateReset = () => {
    setSelectedContrat('');
    setShowCotisationForm(false);
    transfertForm.reset();
    compteRecepteurForm.reset();
    resetCompteRecepteurInfo();
  };
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Fonctions d'impression des reçus
  const handlePrintRecuDepot = (transactionData: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Dépôt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REÇU DE DÉPÔT</h2>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div class="info">
            <p><strong>N° Compte:</strong> ${compteInfo?.numeroCompte}</p>
            <p><strong>Titulaire:</strong> ${compteInfo?.client?.prenom} ${compteInfo?.client?.nom}</p>
            <p><strong>Agence:</strong> ${user?.agenceId || 'Agence'}</p>
            <p><strong>Caissier:</strong> ${user?.prenom} ${user?.nom}</p>
          </div>
          <div class="amount">
            <p>MONTANT DÉPOSÉ: ${transactionData.montant.toLocaleString()} FCFA</p>
          </div>
          <div class="info">
            <p><strong>Origine des fonds:</strong> ${transactionData.origineFond || 'Non spécifiée'}</p>
            <p><strong>Nouveau solde:</strong> ${(compteInfo?.solde + transactionData.montant).toLocaleString()} FCFA</p>
          </div>
          <div class="footer">
            <p>Merci pour votre confiance</p>
            <p>Ce reçu fait foi de votre transaction</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintRecuRetrait = (transactionData: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Retrait</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; color: #d32f2f; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REÇU DE RETRAIT</h2>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div class="info">
            <p><strong>N° Compte:</strong> ${compteInfo?.numeroCompte}</p>
            <p><strong>Titulaire:</strong> ${compteInfo?.client?.prenom} ${compteInfo?.client?.nom}</p>
            <p><strong>Agence:</strong> ${user?.agenceId || 'Agence'}</p>
            <p><strong>Caissier:</strong> ${user?.prenom} ${user?.nom}</p>
          </div>
          <div class="amount">
            <p>MONTANT RETIRÉ: ${transactionData.montant.toLocaleString()} FCFA</p>
          </div>
          <div class="info">
            <p><strong>Solde avant retrait:</strong> ${compteInfo?.solde.toLocaleString()} FCFA</p>
            <p><strong>Nouveau solde:</strong> ${(compteInfo?.solde - transactionData.montant).toLocaleString()} FCFA</p>
          </div>
          <div class="footer">
            <p>Merci pour votre confiance</p>
            <p>Ce reçu fait foi de votre transaction</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintRecuEpargne = (transactionData: any, contratInfo: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu d'Épargne</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; color: #2e7d32; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REÇU D'ÉPARGNE</h2>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div class="info">
            <p><strong>N° Compte:</strong> ${compteInfo?.numeroCompte}</p>
            <p><strong>Titulaire:</strong> ${compteInfo?.client?.prenom} ${compteInfo?.client?.nom}</p>
            <p><strong>Plan d'épargne:</strong> ${contratInfo?.typeContrat?.nom}</p>
            <p><strong>Agence:</strong> ${user?.agenceId || 'Agence'}</p>
            <p><strong>Caissier:</strong> ${user?.prenom} ${user?.nom}</p>
          </div>
          <div class="amount">
            <p>COTISATION: ${transactionData.montant.toLocaleString()} FCFA</p>
          </div>
          <div class="info">
            <p><strong>Solde épargne:</strong> ${contratInfo?.soldeContrat?.solde?.toLocaleString() || 0} FCFA</p>
          </div>
          <div class="footer">
            <p>Merci pour votre épargne</p>
            <p>Ce reçu fait foi de votre cotisation</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintRecuInvestissement = (transactionData: any, contratInfo: any) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu d'Investissement</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .info { margin: 10px 0; }
            .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; color: #1976d2; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>REÇU D'INVESTISSEMENT</h2>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div class="info">
            <p><strong>N° Compte:</strong> ${compteInfo?.numeroCompte}</p>
            <p><strong>Titulaire:</strong> ${compteInfo?.client?.prenom} ${compteInfo?.client?.nom}</p>
            <p><strong>Plan d'investissement:</strong> ${contratInfo?.typeContrat?.nom}</p>
            <p><strong>Agence:</strong> ${user?.agenceId || 'Agence'}</p>
            <p><strong>Caissier:</strong> ${user?.prenom} ${user?.nom}</p>
          </div>
          <div class="amount">
            <p>INVESTISSEMENT: ${transactionData.montant.toLocaleString()} FCFA</p>
          </div>
          <div class="info">
            <p><strong>Solde investissement:</strong> ${contratInfo?.soldeContrat?.solde?.toLocaleString() || 0} FCFA</p>
          </div>
          <div class="footer">
            <p>Merci pour votre investissement</p>
            <p>Ce reçu fait foi de votre transaction</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };


  return (
    <div className="container mx-auto py-8 h-full overflow-y-scroll no-scrollbar">
      <h1 className="text-3xl font-bold mb-6">Gestion des Transactions</h1>
      {compteInfo && <div onClick={() => resetCompteInfo()} className="mb-4 cursor-pointer  bg-slate-500 w-8 h-8 rounded-full flex justify-center items-center">
        <ChevronRight className="w-6 h-6 text-white rotate-180" />
      </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Première phase: Vérification du compte */}


        {!compteInfo ? (
          <Card className="col-span-1 md:col-span-2">

            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Recherche de comptes</h3>
                <form onSubmit={searchForm.handleSubmit(handleSearchComptes)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchTerm">Entrez le nom ou le numéro de compte client</Label>
                    <Controller
                      name="searchTerm"
                      control={searchForm.control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Input
                            id="searchTerm"
                            placeholder="Entrez le nom ou le numéro de compte client"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setSearchTerm(e.target.value);
                            }}
                          />
                          {error && <p className="text-sm text-red-500">{error.message}</p>}
                        </>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSearching || searchForm.formState.isSubmitting}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Recherche en cours...
                        </>
                      ) : (
                        "Rechercher"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetSearchFields}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </form>

                {/* Résultats de recherche */}
                {searchResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Résultats de la recherche</h3>
                    <ScrollArea className="h-[300px] rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>N° Compte</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Solde</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResults.map((compte) => (
                            <TableRow 
                              key={compte.id}
                              className={`${compte.hasCompte && compte.compteDto ? 'cursor-pointer hover:bg-blue-50' : 'cursor-not-allowed opacity-50'}`}
                              onClick={() => compte.hasCompte && compte.compteDto && selectCompte(compte)}
                            >
                              <TableCell>{compte.hasCompte && compte.compteDto ? compte.compteDto.numeroCompte : 'N/A'}</TableCell>
                              <TableCell>{compte.nom}</TableCell>
                              <TableCell>{compte.prenom}</TableCell>
                              <TableCell>{compte.hasCompte && compte.compteDto ? compte.compteDto.solde.toLocaleString() : 0} FCFA</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectCompte(compte);
                                  }}
                                  disabled={!compte.hasCompte || !compte.compteDto}
                                >
                                  Sélectionner
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </div>
              {/*               
              <form onSubmit={handleVerifierCompte} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroCompte">Nom ou Numéro de Compte</Label>
                  <Input
                    id="numeroCompte"
                    placeholder="Entrez le nom ou le numéro de compte client "
                    value={numeroCompte}
                    onChange={(e) => setNumeroCompte(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isVerifying || !numeroCompte}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    "Afficher le Compte"
                  )}
                </Button>
              </form> */}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Deuxième phase: Informations du compte et transaction */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du Compte</CardTitle>
                <CardDescription>
                  Détails du compte vérifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Numéro de Compte</Label>
                    <p className="font-medium">{compteInfo.numeroCompte}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Titulaire</Label>
                    <p className="font-medium">{compteInfo.client.prenom} {compteInfo.client.nom}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm text-muted-foreground">Solde Actuel</Label>
                    <p className="text-xl font-bold">{compteInfo.solde.toLocaleString().replace(/\s/g, ' ')} FCFA</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleReset}>
                  Vérifier un autre compte
                </Button>
              </CardFooter>
            </Card>

            {/* Formulaire de transaction */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle>Effectuer une Transaction</CardTitle>
                <CardDescription>
                  Choisissez le type de transaction à effectuer
                </CardDescription>
              </CardHeader>
              <CardContent className='p-3'>
                <Tabs defaultValue="depot" value={activeTab} onValueChange={setActiveTab} className="w-full p-0">
                  <TabsList className=" grid grid-cols-5 mb-4 bg-transparent p-0">
                    <TabsTrigger onClick={handleNavigateReset} className="rounded-full px-4 py-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none" value="depot">Dépôt</TabsTrigger>
                    <TabsTrigger onClick={handleNavigateReset} className="rounded-full px-4 py-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none" value="retrait">Retrait</TabsTrigger>
                    <TabsTrigger onClick={handleNavigateReset} className="rounded-full px-4 py-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none" value="Transfert">Transfert</TabsTrigger>
                    <TabsTrigger onClick={handleNavigateReset} className="rounded-full px-4 py-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none" value="Epargne">Epargne</TabsTrigger>
                    <TabsTrigger onClick={handleNavigateReset} className="rounded-full px-4 py-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none" value="Investissement">Investir</TabsTrigger>
                  </TabsList>

                  <TabsContent value="depot">
                    <form onSubmit={transactionForm.handleSubmit(handleTransaction)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="montant">Montant du Dépôt</Label>
                        <Controller
                          name="montant"
                          control={transactionForm.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <MontantInput
                                id="montant"
                                placeholder="Entrez le montant"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                required
                              />
                              {error && <p className="text-sm text-red-500">{error.message}</p>}
                            </>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Origine des fonds</Label>
                        <Controller
                          name="description"
                          control={transactionForm.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <Textarea
                                id="description"
                                placeholder="Description de la transaction"
                                {...field}
                                required
                              />
                              {error && <p className="text-sm text-red-500">{error.message}</p>}
                            </>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          !transactionForm.watch("montant") ||
                          transactionForm.formState.isSubmitting ||
                          effectuerDepotMutation.isPending
                        }
                      >
                        {effectuerDepotMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement en cours...
                          </>
                        ) : (
                          "Effectuer le Dépôt"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="retrait">
                    <form onSubmit={transactionForm.handleSubmit(handleTransaction)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="montant">Montant du Retrait</Label>
                        <Controller
                          name="montant"
                          control={transactionForm.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <MontantInput
                                id="montant"
                                placeholder="Entrez le montant"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                required
                              />
                              {error && <p className="text-sm text-red-500">{error.message}</p>}
                            </>
                          )}
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label htmlFor="description">Origine des fonds </Label>
                        <Controller
                          name="description"
                          control={transactionForm.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <Textarea
                                id="description"
                                placeholder="Description de la transaction"
                                {...field}
                              />
                              {error && <p className="text-sm text-red-500">{error.message}</p>}
                            </>
                          )}
                        />
                      </div> */}
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          !transactionForm.watch("montant") ||
                          (transactionForm.watch("montant") && parseFloat(transactionForm.watch("montant")) <= 0) ||
                          (transactionForm.watch("montant") && compteInfo && parseFloat(transactionForm.watch("montant")) > compteInfo.solde) ||
                          isSubmitting ||
                          effectuerRetraitMutation.isPending
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Traitement en cours...
                          </>
                        ) : (
                          "Effectuer le Retrait"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="Transfert">
                    <div className="space-y-6">
                      {/* Formulaire de vérification du compte destinataire */}
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-2">Vérification du compte destinataire</h3>
                        <form onSubmit={compteRecepteurForm.handleSubmit(handleVerifierCompteRecepteur)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="numeroCompteRecepteur">Numéro de compte destinataire</Label>
                            <Controller
                              name="numeroCompteRecepteur"
                              control={compteRecepteurForm.control}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <Input
                                    id="numeroCompteRecepteur"
                                    placeholder="Numéro de compte du destinataire"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      resetCompteRecepteurInfo();
                                    }}
                                    required
                                    disabled={!!compteRecepteurInfo}
                                  />
                                  {error && <p className="text-sm text-red-500">{error.message}</p>}
                                </>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="codeAgenceRecepteur">Code agence destinataire</Label>
                            <Controller
                              name="codeAgenceRecepteur"
                              control={compteRecepteurForm.control}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <Input
                                    id="codeAgenceRecepteur"
                                    placeholder="Code de l'agence du destinataire"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      resetCompteRecepteurInfo();
                                    }}
                                    required
                                    disabled={!!compteRecepteurInfo}
                                  />
                                  {error && <p className="text-sm text-red-500">{error.message}</p>}
                                </>
                              )}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cleRecepteur">Clé du compte destinataire</Label>
                            <Controller
                              name="cleRecepteur"
                              control={compteRecepteurForm.control}
                              render={({ field, fieldState: { error } }) => (
                                <>
                                  <Input
                                    id="cleRecepteur"
                                    placeholder="Clé du compte destinataire"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      resetCompteRecepteurInfo();
                                    }}
                                    required
                                    disabled={!!compteRecepteurInfo}
                                  />
                                  {error && <p className="text-sm text-red-500">{error.message}</p>}
                                </>
                              )}
                            />
                          </div>
                          
                          {compteRecepteurInfo ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <p className="text-green-700 font-medium">Compte vérifié</p>
                              </div>
                              <p className="text-sm text-green-600 mt-1">
                                Compte de {compteRecepteurInfo.client.prenom} {compteRecepteurInfo.client.nom}
                              </p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2" 
                                onClick={() => resetCompteRecepteurInfo()}
                                type="button"
                              >
                                Modifier
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={
                                !compteRecepteurForm.watch("numeroCompteRecepteur") ||
                                !compteRecepteurForm.watch("codeAgenceRecepteur") ||
                                !compteRecepteurForm.watch("cleRecepteur") ||
                                compteRecepteurForm.formState.isSubmitting ||
                                isVerifyingRecepteur
                              }
                            >
                              {isVerifyingRecepteur ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Vérification...
                                </>
                              ) : (
                                "Vérifier le compte destinataire"
                              )}
                            </Button>
                          )}
                        </form>
                      </div>
                      
                      {/* Formulaire de transfert */}
                      <form onSubmit={transfertForm.handleSubmit(handleTransfert)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="montant">Montant du Transfert</Label>
                          <Controller
                            name="montant"
                            control={transfertForm.control}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <MontantInput
                                  id="montant"
                                  placeholder="Entrez le montant"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  required
                                />
                                {error && <p className="text-sm text-red-500">{error.message}</p>}
                              </>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motif">Motif du transfert</Label>
                          <Controller
                            name="motif"
                            control={transfertForm.control}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Textarea
                                  id="motif"
                                  placeholder="Motif du transfert"
                                  {...field}
                                  required
                                />
                                {error && <p className="text-sm text-red-500">{error.message}</p>}
                              </>
                            )}
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={
                            !transfertForm.watch("montant") ||
                            (transfertForm.watch("montant") && parseFloat(transfertForm.watch("montant")) <= 0) ||
                            !transfertForm.watch("motif") ||
                            !compteRecepteurInfo ||
                            transfertForm.formState.isSubmitting ||
                            effectuerTransfertMutation.isPending
                          }
                        >
                          {effectuerTransfertMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            "Effectuer le Transfert"
                          )}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="Epargne">
                    {compteInfo && compteInfo.contrats && compteInfo.contrats.filter((contrat: ContratType) => contrat.typeContrat.type === "EPARGNE").length > 0 ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="select-contrat">Contrats d'épargne disponibles</Label>
                          <Select
                            value={selectedContrat}
                            onValueChange={(value) => {
                              setSelectedContrat(value);
                              setShowCotisationForm(!!value);
                            }}
                            required
                          >
                            <SelectTrigger id="select-contrat">
                              <SelectValue placeholder="Sélectionner un contrat d'épargne" />
                            </SelectTrigger>
                            <SelectContent>
                              {compteInfo.contrats
                                .filter((contrat: ContratType) => contrat.typeContrat.type === "EPARGNE")
                                .map((contrat: ContratType) => (
                                  <SelectItem key={contrat.id} value={contrat.id}>
                                    {contrat.typeContrat.nom} — Solde: {contrat.soldeContrat.solde?.toLocaleString() || 0} FCFA
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {showCotisationForm && selectedContrat && (
                          <form onSubmit={cotisationForm.handleSubmit(handleCotisation)} className="space-y-4 border-t pt-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="montant">Montant de la cotisation</Label>
                              <Controller
                                name="montant"
                                control={cotisationForm.control}
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <MontantInput
                                      id="montant"
                                      placeholder="Entrez le montant"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      required
                                    />
                                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                                  </>
                                )}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setShowCotisationForm(false);
                                  setSelectedContrat("");
                                  cotisationForm.reset();
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                type="submit"
                                className="flex-1"
                                disabled={
                                  !cotisationForm.watch("montant") ||
                                  (cotisationForm.watch("montant") && parseFloat(cotisationForm.watch("montant")) <= 0) ||
                                  cotisationForm.formState.isSubmitting ||
                                  effectuerCotisationMutation.isPending
                                }
                              >
                                {effectuerCotisationMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                  </>
                                ) : (
                                  "Effectuer la cotisation"
                                )}
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun contrat d'épargne trouvé pour ce compte
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="Investissement">
                    {compteInfo && compteInfo.contrats && compteInfo.contrats.length > 0 ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Contrats d'investissement disponibles</Label>
                          <div className="grid gap-2">
                            {compteInfo.contrats
                              .filter((contrat: ContratType) => contrat.typeContrat.type === "INVESTISSEMENT")
                              .map((contrat: ContratType) => (
                                <div key={contrat.id} className="border rounded-md p-3 flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{contrat.id}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Solde: {contrat.soldeContrat.solde?.toLocaleString() || 0} FCFA
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedContrat(contrat.id);
                                      setShowCotisationForm(true);
                                    }}
                                  >
                                    Investir
                                  </Button>
                                </div>
                              ))
                            }
                          </div>
                        </div>

                        {showCotisationForm && selectedContrat && (
                          <form onSubmit={cotisationForm.handleSubmit(handleCotisation)} className="space-y-4 border-t pt-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="montant">Montant de la cotisation</Label>
                              <Controller
                                name="montant"
                                control={cotisationForm.control}
                                render={({ field, fieldState: { error } }) => (
                                  <>
                                    <MontantInput
                                      id="montant"
                                      placeholder="Entrez le montant"
                                      value={field.value}
                                      onChange={(value) => field.onChange(value)}
                                      required
                                    />
                                    {error && <p className="text-sm text-red-500">{error.message}</p>}
                                  </>
                                )}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setShowCotisationForm(false);
                                  setSelectedContrat("");
                                  cotisationForm.reset();
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                type="submit"
                                className="flex-1"
                                disabled={
                                  !cotisationForm.watch("montant") ||
                                  (cotisationForm.watch("montant") && parseFloat(cotisationForm.watch("montant")) <= 0) ||
                                 
                                 
                                  effectuerCotisationMutation.isPending
                                }
                              >
                                {effectuerCotisationMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Traitement en cours...
                                  </>
                                ) : (
                                  "Effectuer la cotisation"
                                )}
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun contrat d'investissement trouvé pour ce compte
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Historique des transactions */}
            <Card className="col-span-1 md:col-span-2 mt-4">
              <CardHeader>
                <CardTitle>Historique des Transactions</CardTitle>
                <CardDescription>
                  Liste des transactions effectuées sur ce compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune transaction trouvée pour ce compte
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction: any) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {transaction.dateHeureTransaction ? formatDate(transaction.dateHeureTransaction) : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium lowercase ${transaction.type === 'DEPOT' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'DEPOT' ? 'Dépôt' : transaction.type}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">
                              {transaction.montant.toLocaleString().replace(/\s/g, ' ')} FCFA
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {transaction.origineFond || 'Aucune description'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (transaction.type === 'DEPOT') {
                                    handlePrintRecuDepot({
                                      montant: transaction.montant,
                                      origineFond: transaction.origineFond
                                    });
                                  } else if (transaction.type === 'RETRAIT') {
                                    handlePrintRecuRetrait({
                                      montant: transaction.montant
                                    });
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <Printer className="h-4 w-4" />
                                Imprimer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionsPage;
