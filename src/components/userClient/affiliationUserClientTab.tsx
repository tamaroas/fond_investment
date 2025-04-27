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
import { Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AffiliationSchema, AffiliationType } from "@/schemas/userClient-schema";

const AffiliationUserClientTab = () => {
  const params = useParams();
  const clientId = params.id as string;
  
  const [affiliations, setAffiliations] = useState<AffiliationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAffiliationDialogOpen, setIsAffiliationDialogOpen] = useState(false);
  
  // Formulaire pour la création d'affiliation
  const affiliationForm = useForm<AffiliationType>({
    resolver: zodResolver(AffiliationSchema),
    defaultValues: {
      nom: "",
      relation: "",
      contact: "",
    },
  });
  
  // Simuler le chargement des affiliations du client
  useEffect(() => {
    // Cette fonction serait remplacée par un appel API réel
    const fetchAffiliations = async () => {
      setLoading(true);
      try {
        // Simuler des données pour les affiliations
        // À remplacer par un appel API réel
        setTimeout(() => {
          setAffiliations([
            { id: "1", nom: "Jean Dupont", relation: "Conjoint", contact: "+33 6 12 34 56 78" },
            { id: "2", nom: "Marie Dupont", relation: "Enfant", contact: "+33 6 98 76 54 32" },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erreur lors du chargement des affiliations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les affiliations du client",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchAffiliations();
  }, [clientId]);
  
  // Gérer la création d'une affiliation
  const handleCreateAffiliation = (data: AffiliationType) => {
    // Simuler l'ajout d'une affiliation
    // À remplacer par un appel API réel
    const newAffiliation = {
      id: (affiliations.length + 1).toString(),
      ...data,
    };
    
    setAffiliations([...affiliations, newAffiliation]);
    setIsAffiliationDialogOpen(false);
    affiliationForm.reset();
    
    toast({
      title: "Affiliation créée",
      description: "L'affiliation a été créée avec succès",
    });
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
          <CardTitle>Affiliations</CardTitle>
          <CardDescription>Liste des affiliations du client</CardDescription>
        </div>
        <Dialog open={isAffiliationDialogOpen} onOpenChange={setIsAffiliationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nouvelle affiliation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle affiliation</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle affiliation pour ce client.
              </DialogDescription>
            </DialogHeader>
            <Form {...affiliationForm}>
              <form onSubmit={affiliationForm.handleSubmit(handleCreateAffiliation)} className="space-y-4">
                <FormField
                  control={affiliationForm.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={affiliationForm.control}
                  name="relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez la relation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={affiliationForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Entrez le contact" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Créer l'affiliation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {affiliations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucune affiliation trouvée pour ce client.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Relation</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliations.map((affiliation) => (
                <TableRow key={affiliation.id}>
                  <TableCell>{affiliation.id}</TableCell>
                  <TableCell>{affiliation.nom}</TableCell>
                  <TableCell>{affiliation.relation}</TableCell>
                  <TableCell>{affiliation.contact}</TableCell>
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
