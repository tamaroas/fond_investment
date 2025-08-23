"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, CheckCircle, XCircle, Clock, Loader2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface DemandeRetrait {
  id: string;
  clientNom: string;
  clientPrenom: string;
  numeroCompte: string;
  montant: number;
  dateCreation: string;
  statut: "EN_ATTENTE" | "APPROUVE" | "REJETE";
  motif?: string;
  agence: string;
  type: "mobile" | "bancaire";
  ribTelephone: string;
  banqueOperateur: string;
}

function RetraitsPage() {
  const [demandesRetraits, setDemandesRetraits] = useState<DemandeRetrait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Simuler le chargement des données (remplacer par un vrai appel API)
  useEffect(() => {
    const loadDemandesRetraits = async () => {
      setIsLoading(true);
      
      // Simulation de données - remplacer par un vrai appel API
      setTimeout(() => {
        const mockData: DemandeRetrait[] = [
          {
            id: "1",
            clientNom: "Dupont",
            clientPrenom: "Jean",
            numeroCompte: "CPT001234",
            montant: 50000,
            dateCreation: new Date().toISOString(),
            statut: "EN_ATTENTE",
            agence: "Agence Centrale",
            type: "mobile",
            ribTelephone: "+237 6XX XXX XXX",
            banqueOperateur: "Orange Money"
          },
          {
            id: "2",
            clientNom: "Martin",
            clientPrenom: "Marie",
            numeroCompte: "CPT001235",
            montant: 25000,
            dateCreation: new Date(Date.now() - 86400000).toISOString(),
            statut: "EN_ATTENTE",
            agence: "Agence Nord",
            type: "bancaire",
            ribTelephone: "FR76 1234 5678 9012 3456",
            banqueOperateur: "Banque Atlantique"
          },
          {
            id: "3",
            clientNom: "Lemaire",
            clientPrenom: "Paul",
            numeroCompte: "CPT001236",
            montant: 75000,
            dateCreation: new Date(Date.now() - 172800000).toISOString(),
            statut: "APPROUVE",
            agence: "Agence Sud",
            type: "mobile",
            ribTelephone: "+237 6XX XXX XXX",
            banqueOperateur: "MTN Mobile Money"
          }
        ];
        
        setDemandesRetraits(mockData);
        setIsLoading(false);
      }, 1000);
    };

    loadDemandesRetraits();
  }, []);

  const handleApprouver = async (demandeId: string) => {
    setIsProcessing(demandeId);
    
    // Simuler l'approbation (remplacer par un vrai appel API)
    setTimeout(() => {
      setDemandesRetraits(prev => 
        prev.map(demande => 
          demande.id === demandeId 
            ? { ...demande, statut: "APPROUVE" as const }
            : demande
        )
      );
      
      toast({
        title: "Demande Approuvée",
        description: "La demande de retrait a été approuvée avec succès",
      });
      
      setIsProcessing(null);
    }, 1500);
  };

  const handleRejeter = async (demandeId: string) => {
    setIsProcessing(demandeId);
    
    // Simuler le rejet (remplacer par un vrai appel API)
    setTimeout(() => {
      setDemandesRetraits(prev => 
        prev.map(demande => 
          demande.id === demandeId 
            ? { ...demande, statut: "REJETE" as const, motif: "Solde insuffisant" }
            : demande
        )
      );
      
      toast({
        title: "Demande Rejetée",
        description: "La demande de retrait a été rejetée",
        variant: "destructive"
      });
      
      setIsProcessing(null);
    }, 1500);
  };

  const getStatutBadge = (statut: DemandeRetrait["statut"]) => {
    switch (statut) {
      case "EN_ATTENTE":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case "APPROUVE":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case "REJETE":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const demandesEnAttente = demandesRetraits.filter(d => d.statut === "EN_ATTENTE");
  const demandesTraitees = demandesRetraits.filter(d => d.statut !== "EN_ATTENTE");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Retraits</h1>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-800">{demandesEnAttente.length}</p>
            <p className="text-sm text-yellow-600">Demandes à traiter</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Approuvées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">
              {demandesRetraits.filter(d => d.statut === "APPROUVE").length}
            </p>
            <p className="text-sm text-green-600">Demandes approuvées</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Rejetées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-800">
              {demandesRetraits.filter(d => d.statut === "REJETE").length}
            </p>
            <p className="text-sm text-red-600">Demandes rejetées</p>
          </CardContent>
        </Card>
      </div>

      {/* Demandes en attente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6" />
            Demandes de retrait en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {demandesEnAttente.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune demande en attente</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Numero des comptes errone</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type (mobile ou bancaire)</TableHead>
                  <TableHead>RIB/Telephone</TableHead>
                  <TableHead>Banque/Opérateur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandesEnAttente.map((demande) => (
                  <TableRow key={demande.id}>
                    <TableCell className="font-medium">
                      {demande.clientPrenom} {demande.clientNom}
                    </TableCell>
                    <TableCell>{demande.numeroCompte}</TableCell>
                    <TableCell className="font-semibold">
                      {demande.montant.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>
                      <Badge variant={demande.type === "mobile" ? "default" : "secondary"}>
                        {demande.type === "mobile" ? "Mobile" : "Bancaire"}
                      </Badge>
                    </TableCell>
                    <TableCell>{demande.ribTelephone}</TableCell>
                    <TableCell>{demande.banqueOperateur}</TableCell>
                    <TableCell>
                      {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprouver(demande.id)}
                          disabled={isProcessing === demande.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing === demande.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRejeter(demande.id)}
                          disabled={isProcessing === demande.id}
                        >
                          {isProcessing === demande.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Historique des demandes traitées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6" />
            Historique des Demandes ({demandesTraitees.length})
          </CardTitle>
          <CardDescription>
            Demandes déjà traitées (approuvées ou rejetées)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demandesTraitees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune demande traitée</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Numero des comptes errone</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Agence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Motif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandesTraitees.map((demande) => (
                  <TableRow key={demande.id}>
                    <TableCell className="font-medium">
                      {demande.clientPrenom} {demande.clientNom}
                    </TableCell>
                    <TableCell>{demande.numeroCompte}</TableCell>
                    <TableCell className="font-semibold">
                      {demande.montant.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell>{demande.agence}</TableCell>
                    <TableCell>
                      {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {getStatutBadge(demande.statut)}
                    </TableCell>
                    <TableCell>
                      {demande.motif || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RetraitsPage;