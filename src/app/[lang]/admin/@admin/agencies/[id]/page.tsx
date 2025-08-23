"use client";
import React from "react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useManagers from "@/hooks/useManagers";
import useCaissiers from "@/hooks/useCaissiers";
import GestionnaireContent from "@/components/admin-panel/users/GestionnaireContent";
import CaissierContent from "@/components/admin-panel/users/CaissierContent";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import agencyService from "@/services/agency-services";
import { useChefAgence } from '@/hooks/useChefAgence';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { AgencyForm } from "@/components/agencies/agency-form";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AgencyUsersPage = () => {
    const params = useParams();
    const router = useRouter();
    const agencyId = params?.id as string;

    // Gestion modals
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Fetch infos agence
    const { data: agency, refetch: refetchAgency } = useQuery({
        queryKey: ["agency", agencyId],
        queryFn: async () => {
            const response = await agencyService.getAgencyById(agencyId);
            return response?.content;
        },
        enabled: !!agencyId,
    });

    // Mutations
    const updateMutation = useMutation({
        mutationFn: (data: any) => agencyService.updateAgency(agencyId, data),
        onSuccess: () => {
            toast({ title: "Agence modifiée avec succès" });
            setShowEdit(false);
            refetchAgency();
        },
        onError: () => toast({ title: "Erreur lors de la modification", variant: "destructive" }),
    });
    const deleteMutation = useMutation({
        mutationFn: () => agencyService.deleteAgency(agencyId),
        onSuccess: () => {
            toast({ title: "Agence supprimée" });
            setShowDelete(false);
            router.push("/admin/@admin/agencies");
        },
        onError: (error: any) => toast({
            title: "Erreur lors de la suppression",
            description: error.data?.message || "Une erreur est survenue lors de la suppression de l'agence",
            variant: "destructive"
        }),
    });

    // Breadcrumb options
    const options_bread = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Agences', path: '/admin/agencies' },
        { label: agency?.nom || 'Agence' }
    ];

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-bold mb-6">Gestion de l'agence</h1>
            <div className="flex items-center justify-between mb-6">
                <BreadcrumbCustom options={options_bread} />

            </div>
            <Tabs defaultValue="infos" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="infos">Infos agence</TabsTrigger>

                </TabsList>
                <TabsContent value="infos">
                    {agency ? (
                        <Card className="w-full shadow-lg border-primary/30">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <span className="inline-block bg-primary/10 rounded-full p-2">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building"><rect width="18" height="14" x="3" y="7" rx="2" /><path d="M9 21V9a3 3 0 0 1 6 0v12" /></svg>
                                    </span>
                                    {agency.nom || "Nom non renseigné"}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">{agency.adresse || "Adresse non renseignée"}</div>
                            </CardHeader>
                            <CardContent className="space-y-2 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div><span className="font-semibold">Numéro:</span> {agency.numero || "Non renseigné"}</div>
                                    <div><span className="font-semibold">Téléphone:</span> {agency.telephone || "Non renseigné"}</div>
                                    <div><span className="font-semibold">Email:</span> {agency.email || "Non renseigné"}</div>
                                    <div><span className="font-semibold">Fax:</span> {agency.fax || "Non renseigné"}</div>
                                    <div>
                                        <span className="font-semibold">Heure d'ouverture:</span>{" "}
                                        {typeof agency.heureOuverture === "string"
                                            ? agency.heureOuverture || "Non renseignée"
                                            : agency.heureOuverture
                                                ? `${agency.heureOuverture.hour}:${agency.heureOuverture.minute}`
                                                : "Non renseignée"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Heure de fermeture:</span>{" "}
                                        {typeof agency.heureFermeture === "string"
                                            ? agency.heureFermeture || "Non renseignée"
                                            : agency.heureFermeture
                                                ? `${agency.heureFermeture.hour}:${agency.heureFermeture.minute}`
                                                : "Non renseignée"}
                                    </div>
                                    <div><span className="font-semibold">Jour d'ouverture:</span> {agency.jourOuverture || "Non renseigné"}</div>
                                    <div><span className="font-semibold">Jour de fermeture:</span> {agency.jourFermeture || "Non renseigné"}</div>

                                </div>
                                <div>
                                    <span className="font-semibold">Chef d'agence:</span> {agency.chefAgence ? (
                                        <span> {agency.chefAgence.prenom} {agency.chefAgence.nom} ({agency.chefAgence.email}, {agency.chefAgence.telephone})</span>
                                    ) : (
                                        <span> Non renseigné</span>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <span className="font-semibold">Gestionnaire(s):</span>
                                    {Array.isArray(agency.gestionnaire) && agency.gestionnaire.length > 0 ? (
                                        <ul className="ml-4 list-disc">
                                            {agency.gestionnaire.map((gest: any) => (
                                                <li key={gest.id}>
                                                    {gest.prenom} {gest.nom} ({gest.email}, {gest.telephone})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span> Aucun gestionnaire renseigné</span>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <span className="font-semibold">Caissier(s):</span>
                                    {Array.isArray(agency.caissiers) && agency.caissiers.length > 0 ? (
                                        <ul className="ml-4 list-disc">
                                            {agency.caissiers.map((caissier: any) => (
                                                <li key={caissier.id}>
                                                    {caissier.prenom} {caissier.nom} ({caissier.email}, {caissier.telephone})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span> Aucun caissier renseigné</span>
                                    )}
                                </div>

                            </CardContent>
                            <CardFooter className="flex gap-2 justify-end">
                                <button className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition" onClick={() => setShowEdit(true)}>
                                    Modifier
                                </button>
                                <button className="bg-destructive text-white px-4 py-2 rounded shadow hover:bg-destructive/90 transition" onClick={() => setShowDelete(true)}>
                                    Supprimer
                                </button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div>Chargement des infos de l'agence...</div>
                    )}
                    {/* Modal édition agence */}
                    <Dialog open={showEdit} onOpenChange={setShowEdit}>
                        <DialogContent>
                            <AgencyForm
                                agency={agency}
                                onClose={() => setShowEdit(false)}
                                onSubmit={updateMutation.mutate}
                                isSubmitting={updateMutation.status === 'pending'}
                            />
                        </DialogContent>
                    </Dialog>
                    {/* Modal suppression agence */}
                    <Dialog open={showDelete} onOpenChange={setShowDelete}>
                        <DialogContent className=" bg-white p-4">
                            <div className="text-lg font-semibold mb-4">Confirmer la suppression de l'agence ?</div>
                            <div className="text-sm text-muted-foreground">Cette action est irréversible et supprimera définitivement l'agence.</div>
                            <div className="flex gap-2 justify-end">
                                <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowDelete(false)}>Annuler</button>
                                <button className="px-4 py-2 rounded bg-destructive text-white" onClick={() => deleteMutation.mutate()}>Supprimer</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

            </Tabs>
        </div>

    );
};

export default AgencyUsersPage;
