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
import { Plus, Loader2, Trash2 } from "lucide-react";
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
  const {CreateContratCompteMutation,listContrats} = useCompteClient(clientId);
  
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
  const { data:typeContrats } = useQuery({
    queryKey: ['typeContrats'],
    queryFn: async () => {
      const response = await compteService.getTypeContrats();
      return response.content || [];
    },
    initialData: () => queryClient.getQueryData(['typeContrats'])
  });
  const [selectedTypeContrat, setSelectedTypeContrat] = useState<any>(null);
    // Formulaire pour la création d'affiliation
    const affiliationForm = useForm<AffiliationType>({
      resolver: zodResolver(AffiliationSchema),
      defaultValues: {
        compteId: data?.[0]?.id || "",
        typeContratId: "",
        description: "",
        montantVersementEncompte: true,
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
        origineFond: "",
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
   
  // Mise à jour du type de contrat sélectionné
  const handleTypeContratChange = (value: string) => {
    const selected = typeContrats?.find((tc: any) => tc.publicId === value);
    setSelectedTypeContrat(selected);
    affiliationForm.setValue("typeContratId", value);
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
        compteId: data?.[0]?.id || "",
        typeContratId: "",
        description: "",
        montantVersementEncompte: true,
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
        origineFond: "",
      }

    );
  }
  }, [data]);
  // Gérer la création d'une affiliation
  const handleCreateAffiliation = (data: AffiliationType) => {
    setLoadingCreate(true);
    try {
      CreateContratCompteMutation.mutate(data);
    } catch (error) {
      console.error("Error creating affiliation:", error);
   
    } finally {
      setLoadingCreate(false);
      setIsAffiliationDialogOpen(false);
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
          <CardTitle>Contrats</CardTitle>
          <CardDescription>Liste des contrats du client</CardDescription>
        </div>
        <Dialog open={isAffiliationDialogOpen} onOpenChange={setIsAffiliationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nouveau contrat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau contrat</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau contrat pour ce client.
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
                    name="typeContratId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de contrat</FormLabel>
                        <Select 
                          onValueChange={(value) => handleTypeContratChange(value)} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type de contrat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typeContrats?.map((typeContrat: any) => (
                              <SelectItem key={typeContrat.publicId} value={typeContrat.publicId}>
                                {typeContrat.nom}
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
                        <Textarea placeholder="Description du contrat" {...field} />
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
                
                <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="TRIMESTRIEL">Trimestriel</SelectItem>
                            <SelectItem value="SEMESTRIEL">Semestriel</SelectItem>
                            <SelectItem value="ANNUEL">Annuel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={affiliationForm.control}
                    name="montantVersementEncompte"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Versement en compte</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={affiliationForm.control}
                  name="origineFond"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origine des fonds</FormLabel>
                      <FormControl>
                        <Input placeholder="Origine des fonds" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedTypeContrat && (
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <h3 className="font-medium mb-2">Détails du type de contrat</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="font-medium">Taux d'intérêt:</span> {selectedTypeContrat.tauxInteret}%</p>
                        <p><span className="font-medium">Frais d'ouverture:</span> {selectedTypeContrat.fraisOuverture}%</p>
                        <p><span className="font-medium">Frais de versement:</span> {selectedTypeContrat.fraisVersement}%</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Frais de gestion:</span> {selectedTypeContrat.tauxFraisGestion}%</p>
                        <p><span className="font-medium">Frais de retrait:</span> {selectedTypeContrat.fraisRetrait}%</p>
                        <p><span className="font-medium">Frais de retrait avant échéance:</span> {selectedTypeContrat.fraisRetraitAvantEcheance}%</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{selectedTypeContrat.description}</p>
                  </div>
                )}
                
                {(!selectedTypeContrat || selectedTypeContrat.hasSignataires || selectedTypeContrat.hasBeneficiare) && (
                  <Tabs defaultValue="signataires" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      {(!selectedTypeContrat || selectedTypeContrat.hasSignataires) && (
                        <TabsTrigger value="signataires">Signataires</TabsTrigger>
                      )}
                      {(!selectedTypeContrat || selectedTypeContrat.hasBeneficiare) && (
                        <TabsTrigger value="beneficiaires">Bénéficiaires</TabsTrigger>
                      )}
                    </TabsList>
                    
                    {(!selectedTypeContrat || selectedTypeContrat.hasSignataires) && (
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
                    
                    {(!selectedTypeContrat || selectedTypeContrat.hasBeneficiare) && (
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
                    {loadingCreate ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer le contrat"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {listContrats?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucun contrat trouvé pour ce client.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type de contrat</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Versement initial</TableHead>
                <TableHead>Versement périodique</TableHead>
                <TableHead>Type de versement</TableHead>
                <TableHead>Signataires</TableHead>
                <TableHead>Bénéficiaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listContrats?.map((affiliation) => (
                <TableRow key={affiliation.id}>
                  <TableCell>{affiliation.id}</TableCell>
                  <TableCell>{affiliation.typeContratId}</TableCell>
                  <TableCell>{affiliation.description}</TableCell>
                  <TableCell>{affiliation.montantVersementInitial.toLocaleString()} FCFA</TableCell>
                  <TableCell>{affiliation.montantVersementPeriodique.toLocaleString()} FCFA</TableCell>
                  <TableCell>{affiliation.typeVersement}</TableCell>
                  {/* <TableCell>{affiliation.signataireDtoIn.length}</TableCell>
                  <TableCell>{affiliation.beneficiaireDtoIn.length}</TableCell> */}
                  <TableCell>{0}</TableCell>
                  <TableCell>{0}</TableCell>
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
