"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Plus, Loader2, Trash2, Printer } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AffiliationSchema, AffiliationType, SignataireType, BeneficiaireType } from "@/schemas/userClient-schema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import compteService from '@/services/compte-services';
import { useCompteClient } from '@/hooks/use-userClient';

const AffiliationUserClientTab = () => {
  const params = useParams();
  const clientId = params.id as string;
  const {CreateContratCompteMutation,listContrats,refetch} = useCompteClient(clientId);
  
  const [affiliations, setAffiliations] = useState<AffiliationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [isAffiliationDialogOpen, setIsAffiliationDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['comptes' + clientId],
    queryFn: async () => {
      const response = await compteService.getComptesByClientId(clientId);
      return response.content || [];
    },
    initialData: () => queryClient.getQueryData(['comptes' + clientId])
  });
  const { data:typePlans } = useQuery({
    queryKey: ['typePlans'],
    queryFn: async () => {
      const response = await compteService.getTypeContrats();
      return response.content || [];
    },
    initialData: () => queryClient.getQueryData(['typePlans'])
  });
  const [selectedTypePlan, setSelectedTypePlan] = useState<any>(null);
    // Formulaire pour la création d'affiliation
    const affiliationForm = useForm<AffiliationType>({
      resolver: zodResolver(AffiliationSchema),
      defaultValues: {
        compteId: data?.id || "",
        typePlanId: "",
        description: "",
        typeVersement: "MENSUEL",
        montantVersementInitial: 0,
        montantVersementPeriodique: 0,
        signataireDtoIn: [{ nom: "", prenom: "", telephone: "", lienClient: "" }],
        beneficiaireDtoIn: [{ 
          nom: "", 
          prenom: "", 
          telephone: "", 
          lienClient: "", 
          adresse: "", 
          dateNaissance: format(new Date(), 'yyyy-MM-dd'),
          lieuNaissance: "",
          quotePart: 0,
          montant: 0
        }],
      },
    });

    const { fields: signataireFields, append: appendSignataire, remove: removeSignataire } = useFieldArray({
      control: affiliationForm.control,
      name: "signataireDtoIn"
    });
    
    const { fields: beneficiaireFields, append: appendBeneficiaire, remove: removeBeneficiaire } = useFieldArray({
      control: affiliationForm.control,
      name: "beneficiaireDtoIn"
    });
   
  // Mise à jour du type de plan sélectionné
  const handleTypePlanChange = (value: string) => {
    const selected = typePlans?.find((tc: any) => tc.publicId === value);
    setSelectedTypePlan(selected);
    affiliationForm.setValue("typePlanId", value);
    if(selected) {
      if (selected.hasSignataires) {
        appendSignataire({ nom: "", prenom: "", telephone: "", lienClient: "" });
      }else{
        affiliationForm.setValue("signataireDtoIn",undefined);
      }
      if (selected.hasBeneficiare) {
        appendBeneficiaire({ 
          nom: "", 
          prenom: "", 
          telephone: "", 
          lienClient: "", 
          adresse: "", 
          dateNaissance: format(new Date(), 'yyyy-MM-dd'),
          lieuNaissance: "", 
          quotePart: 0, 
          montant: 0 
        });
      }else{
        affiliationForm.setValue("beneficiaireDtoIn",undefined);
    }
  };
  };


  

 useEffect(() => {
  if (data) {
    affiliationForm.reset(
      {
        compteId: data?.id || "",
        typePlanId: "",
        description: "",
        typeVersement: "MENSUEL",
        montantVersementInitial: 0,
        montantVersementPeriodique: 0,
        signataireDtoIn: [{ nom: "", prenom: "", telephone: "", lienClient: "" }],
        beneficiaireDtoIn: [{ 
          nom: "", 
          prenom: "", 
          telephone: "", 
          lienClient: "", 
          adresse: "", 
          dateNaissance: format(new Date(), 'yyyy-MM-dd'),
          lieuNaissance: "",
          quotePart: 0,
          montant: 0
        }],
      }

    );
  }
  }, [data]);
  // Gérer la création d'une affiliation
  const handleCreateAffiliation = (data: AffiliationType) => {
    setLoadingCreate(true);
    try {
      CreateContratCompteMutation.mutate(data);
      refetch();
    } catch (error) {
      console.error("Error creating affiliation:", error);
   
    } finally {
      setLoadingCreate(false);
      setIsAffiliationDialogOpen(false);
    }
  };

  // Fonction pour imprimer le reçu d'affiliation à un plan
  const handlePrintRecuAffiliation = (affiliation: any) => {
    // Créer le contenu HTML du reçu
    const printContent = `
      <html>
        <head>
          <title>Reçu d'Affiliation - Plan ${affiliation.typePlanId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .content { margin-bottom: 20px; }
            .content table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .content td { padding: 10px; border: 1px solid #ddd; }
            .content td:first-child { font-weight: bold; background-color: #f5f5f5; width: 30%; }
            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { width: 40%; text-align: center; border-top: 1px solid #333; padding-top: 10px; }
            h1 { color: #333; margin-bottom: 5px; }
            h2 { color: #666; margin-top: 30px; margin-bottom: 15px; }
            .date { font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>REÇU D'AFFILIATION À UN PLAN</h1>
            <p class="date">Date d'émission: ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div class="content">
            <h2>Informations de l'Affiliation</h2>
            <table>
              <tr>
                <td>ID de l'Affiliation</td>
                <td>${affiliation.id}</td>
              </tr>
              <tr>
                <td>Type de Plan</td>
                <td>${affiliation.typePlanId}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>${affiliation.description || "N/A"}</td>
              </tr>
              <tr>
                <td>Montant du Versement Initial</td>
                <td>${affiliation.montantVersementInitial.toLocaleString().replace(/\s/g, ' ')} FCFA</td>
              </tr>
              <tr>
                <td>Montant du Versement Périodique</td>
                <td>${affiliation.montantVersementPeriodique.toLocaleString().replace(/\s/g, ' ')} FCFA</td>
              </tr>
              <tr>
                <td>Type de Versement</td>
                <td>${affiliation.typeVersement}</td>
              </tr>
            </table>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <p>Signature du Client</p>
            </div>
            <div class="signature-box">
              <p>Signature du Gestionnaire</p>
            </div>
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
  
  if (loading) {
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
          <CardTitle>Plans</CardTitle>
          <CardDescription>Liste des plans du client</CardDescription>
        </div>
        <Dialog open={isAffiliationDialogOpen} onOpenChange={setIsAffiliationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nouveau plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-white px-5 py-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau plan</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau plan pour ce client.
              </DialogDescription>
            </DialogHeader>
            <Form {...affiliationForm}>
              <form onSubmit={affiliationForm.handleSubmit(handleCreateAffiliation)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={affiliationForm.control}
                    name="compteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Compte</FormLabel>
                        <FormControl>
                          <Input disabled placeholder="ID du compte " {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={affiliationForm.control}
                    name="typePlanId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de plan</FormLabel>
                        <Select 
                          onValueChange={(value) => handleTypePlanChange(value)} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type de plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typePlans?.map((typePlan: any) => (
                              <SelectItem key={typePlan.publicId} value={typePlan.publicId}>
                                {typePlan.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={affiliationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description du plan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={affiliationForm.control}
                    name="montantVersementInitial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant du versement initial</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={affiliationForm.control}
                    name="montantVersementPeriodique"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant du versement périodique</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={affiliationForm.control}
                  name="typeVersement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de versement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type de versement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MENSUEL">Mensuel</SelectItem>
                          <SelectItem value="JOURNALIER">Journalier</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                
                {selectedTypePlan && (
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <h3 className="font-medium mb-2">Détails du type de plan</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Taux d`&apos;`intérêt:</span> {selectedTypePlan.tauxInteret}%</p>
                        <p><span className="font-medium">Frais d`&apos;`ouverture:</span> {selectedTypePlan.fraisOuverture}%</p>
                        <p><span className="font-medium">Frais de versement:</span> {selectedTypePlan.fraisVersement}%</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Frais de gestion:</span> {selectedTypePlan.tauxFraisGestion}%</p>
                        <p><span className="font-medium">Frais de retrait:</span> {selectedTypePlan.fraisRetrait}%</p>
                        <p><span className="font-medium">Frais de retrait avant échéance:</span> {selectedTypePlan.fraisRetraitAvantEcheance}%</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{selectedTypePlan.description}</p>
                  </div>
                )}
                
                {(!selectedTypePlan || selectedTypePlan.hasSignataires || selectedTypePlan.hasBeneficiare) && (
                  <Tabs defaultValue="signataires" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      {(!selectedTypePlan || selectedTypePlan.hasSignataires) && (
                        <TabsTrigger value="signataires">Signataires</TabsTrigger>
                      )}
                      {(!selectedTypePlan || selectedTypePlan.hasBeneficiare) && (
                        <TabsTrigger value="beneficiaires">Bénéficiaires</TabsTrigger>
                      )}
                    </TabsList>
                    
                    {(!selectedTypePlan || selectedTypePlan.hasSignataires) && (
                      <TabsContent value="signataires" className="space-y-4">
                        <div className="flex justify-end">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => appendSignataire({ nom: "", prenom: "", telephone: "", lienClient: "" })}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Ajouter un signataire
                          </Button>
                        </div>
                        
                        {signataireFields.map((field, index) => (
                          <div key={field.id} className="border p-4 rounded-md relative">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2"
                              onClick={() => signataireFields.length > 1 && removeSignataire(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`signataireDtoIn.${index}.nom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`signataireDtoIn.${index}.prenom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Prénom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`signataireDtoIn.${index}.telephone`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Téléphone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`signataireDtoIn.${index}.lienClient`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lien avec le client</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Lien avec le client" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    )}
                    
                    {(!selectedTypePlan || selectedTypePlan.hasBeneficiare) && (
                      <TabsContent value="beneficiaires" className="space-y-4">
                        <div className="flex justify-end">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => appendBeneficiaire({ 
                              nom: "", 
                              prenom: "", 
                              telephone: "", 
                              lienClient: "", 
                              adresse: "", 
                              dateNaissance: format(new Date(), 'yyyy-MM-dd'),
                              lieuNaissance: "",
                              quotePart: 0,
                              montant: 0
                            })}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Ajouter un bénéficiaire
                          </Button>
                        </div>
                        
                        {beneficiaireFields.map((field, index) => (
                          <div key={field.id} className="border p-4 rounded-md relative">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2"
                              onClick={() => beneficiaireFields.length > 1 && removeBeneficiaire(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.nom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.prenom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Prénom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.telephone`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Téléphone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.lienClient`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lien avec le client</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Lien avec le client" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={affiliationForm.control}
                              name={`beneficiaireDtoIn.${index}.adresse`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Adresse</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Adresse" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.dateNaissance`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Date de naissance</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.lieuNaissance`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Lieu de naissance</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Lieu de naissance" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.quotePart`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quote-part (%)</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={affiliationForm.control}
                                name={`beneficiaireDtoIn.${index}.montant`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Montant</FormLabel>
                                    <FormControl>
                                      <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    )}
                  </Tabs>
                )}
                
                <DialogFooter>
                  <Button type="submit" disabled={loadingCreate}>
                    {loadingCreate ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer le plan"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {listContrats?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucun plan trouvé pour ce client.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type de plan</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Versement initial</TableHead>
                <TableHead>Versement périodique</TableHead>
                <TableHead>Type de versement</TableHead>
                <TableHead>Signataires</TableHead>
                <TableHead>Bénéficiaires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listContrats?.map((affiliation) => (
                <TableRow key={affiliation.id}>
                  <TableCell>{affiliation.id}</TableCell>
                  <TableCell>{affiliation.typePlanId}</TableCell>
                  <TableCell>{affiliation.description}</TableCell>
                  <TableCell>{affiliation.montantVersementInitial.toLocaleString()} FCFA</TableCell>
                  <TableCell>{affiliation.montantVersementPeriodique.toLocaleString()} FCFA</TableCell>
                  <TableCell>{affiliation.typeVersement}</TableCell>
                  {/* <TableCell>{affiliation.signataireDtoIn.length}</TableCell>
                  <TableCell>{affiliation.beneficiaireDtoIn.length}</TableCell> */}
                  <TableCell>{0}</TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handlePrintRecuAffiliation(affiliation)}
                      title="Imprimer le reçu d'affiliation"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliationUserClientTab;
