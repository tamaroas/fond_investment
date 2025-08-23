
"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useChefAgence } from "@/hooks/useChefAgence";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChefAgenceFormSchema, ChefAgenceFormType } from "@/lib/zodSchema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAgency } from "@/hooks/use-agency"; // Ajout pour la liste des agences
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

// Formulaire Chef d'Agence avec react-hook-form + zod
function ChefAgenceForm({
    defaultValues,
    onSubmit,
    loading,
    onCancel,
    isEdit
}: {
    defaultValues: ChefAgenceFormType,
    onSubmit: (values: ChefAgenceFormType) => void,
    loading?: boolean,
    onCancel?: () => void,
    isEdit?: boolean
}) {
    const form = useForm<ChefAgenceFormType>({
        resolver: zodResolver(ChefAgenceFormSchema),
        defaultValues
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="agenceId"
                    render={({ field }) => {
                        const { data: agenciesData, isLoading: agenciesLoading } = useAgency(0, 100);
                        return (
                            <FormItem>
                                <FormLabel>Agence</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={agenciesLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une agence" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agenciesData?.content?.map((agence: any) => (
                                                <SelectItem key={agence.publicId} value={agence.publicId}>
                                                    {agence.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                                <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mot2passe"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="gap-2">
                    <Button type="submit" variant="default" disabled={loading}>
                        {isEdit ? "Mettre à jour" : "Créer"}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            Annuler
                        </Button>
                    )}
                </DialogFooter>
            </form>
        </Form>
    );
}

import { useMutation } from "@tanstack/react-query";
import agencyService from "@/services/agency-services";
import { toast } from "@/components/ui/use-toast";
import { RoleSwitcherButton } from "@/components/admin/role-switcher-button";

export default function ChefAgencePage() {
    const params = useParams();
  
    const agencyId = params?.agencyId as string;
    const {
        chefForm,
        setChefForm,
        showChefCreate,
        setShowChefCreate,
        showChefEdit,
        setShowChefEdit,
        handleChefSubmit,
        updateChefMutation,
        isLoading,
        chefAgences,
        deleteChefMutation,
        showChefDelete,
        setShowChefDelete
    } = useChefAgence();

    // Mutation pour supprimer un chef d'agence
    console.log(chefAgences);
    const { data: agenciesData, isLoading: agenciesLoading } = useAgency(0, 100)

    const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {/* Flèche de retour */}
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="mr-3 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                        aria-label="Retour"
                    >
                        {/* Icône flèche gauche (SVG Heroicons) */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold mb-4">Gestion du Chef d'Agence</h1>
                </div>

                <div className="flex gap-3">
                    <Dialog open={showChefCreate} onOpenChange={setShowChefCreate}>
                        <DialogTrigger asChild>
                            <Button variant="default" onClick={() => setShowChefCreate(true)}>
                                Ajouter un chef d'agence
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white p-6">
                            <DialogHeader>
                                <DialogTitle>Ajouter un chef d'agence</DialogTitle>
                            </DialogHeader>
                            <ChefAgenceForm
                                defaultValues={chefForm}
                                onSubmit={handleChefSubmit}
                                loading={isLoading}
                                onCancel={() => setShowChefCreate(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    
                    <RoleSwitcherButton 
                        targetRole="CHEF_AGENCE" 
                        className="flex items-center gap-2"
                    >
                        Mode chef d'agence
                    </RoleSwitcherButton>
                </div>

            </div>

            {/* Filtre moderne par agence */}
            <div className="mb-6 flex items-center gap-4">
                <label htmlFor="agence-filter" className="font-medium text-gray-700">Filtrer par agence :</label>
                <select
                    id="agence-filter"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px]"
                    value={selectedAgencyId}
                    onChange={e => setSelectedAgencyId(e.target.value)}
                >
                    <option value="">Toutes les agences</option>
                    {agenciesData?.content?.map((agence: any) => (
                        <option key={agence.publicId} value={agence.publicId}>{agence.nom}</option>
                    ))}
                </select>
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {chefAgences && (chefAgences.length > 0 ? chefAgences
                    .filter((chefAgence: any) =>
                        !selectedAgencyId || chefAgence.agenceId === selectedAgencyId
                    )
                    .map((chefAgence: any) => (
                        <ChefAgenceCard
                            key={chefAgence.publicId}
                            chefAgence={chefAgence}
                            agenciesData={agenciesData}
                            setShowChefEdit={setShowChefEdit}
                            showChefEdit={showChefEdit}
                            setChefForm={setChefForm}
                            chefForm={chefForm}
                            handleChefSubmit={handleChefSubmit}
                            updateChefMutation={updateChefMutation}
                            setShowChefDelete={setShowChefDelete}
                            showChefDelete={showChefDelete}
                            deleteChefMutation={deleteChefMutation}
                        />
                    )) : (
                    <div className="col-span-1 md:col-span-3 p-8 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun chef d'agence trouvé</h3>
                        <p className="text-gray-500 text-center">
                            {selectedAgencyId ? "Aucun chef d'agence n'est associé à cette agence." : "Aucun chef d'agence n'est disponible."}
                        </p>
                    </div>
                ))}

            </div>
        </div>
    );
}

// --- Définition du composant ChefAgenceCard ---

function ChefAgenceCard({
    chefAgence,
    agenciesData,
    setShowChefEdit,
    showChefEdit,
    setChefForm,
    chefForm,
    handleChefSubmit,
    updateChefMutation,
    setShowChefDelete,
    showChefDelete,
    deleteChefMutation,
}: {
    chefAgence: any;
    agenciesData: any;
    setShowChefEdit: (b: boolean) => void;
    showChefEdit: boolean;
    setChefForm: (f: any) => void;
    chefForm: any;
    handleChefSubmit: (v: any) => void;
    updateChefMutation: any;
    setShowChefDelete: (b: boolean) => void;
    showChefDelete: boolean;
    deleteChefMutation: any;
}) {
    const [openDelete, setOpenDelete] = React.useState(false);
    return (
        <Card className="mb-6 max-w-md font-light">
            <CardHeader>
                <CardTitle>Chef d'agence actuel </CardTitle>
                <CardDescription>
                    {agenciesData?.content.find((agency: any) => agency.publicId === chefAgence.agenceId)?.nom}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-1 mb-4">
                    <div><span className="font-semibold">Nom :</span> {chefAgence.nom}</div>
                    <div><span className="font-semibold">Prénom :</span> {chefAgence.prenom}</div>
                    <div><span className="font-semibold">Email :</span> {chefAgence.email}</div>
                    <div><span className="font-semibold">Téléphone :</span> {chefAgence.telephone}</div>
                    <div><span className="font-semibold">Username :</span> {chefAgence.username}</div>
                </div>
                <div className="flex gap-2">
                    <Dialog open={showChefEdit} onOpenChange={setShowChefEdit}>
                        <DialogTrigger asChild>
                            <Button variant="default" onClick={() => {
                                setShowChefEdit(true);
                                setChefForm({
                                    agenceId: chefAgence.agenceId,
                                    nom: chefAgence.nom,
                                    prenom: chefAgence.prenom,
                                    username: chefAgence.username,
                                    telephone: chefAgence.telephone,
                                    email: chefAgence.email,
                                    mot2passe: '',
                                });
                            }}>Modifier</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white p-6">
                            <DialogHeader>
                                <DialogTitle>Modifier le chef d'agence</DialogTitle>
                            </DialogHeader>
                            <ChefAgenceForm
                                defaultValues={chefForm}
                                onSubmit={handleChefSubmit}
                                loading={updateChefMutation.isPending}
                                onCancel={() => setShowChefEdit(false)}
                                isEdit
                            />
                        </DialogContent>
                    </Dialog>
                    {/* Suppression */}
                    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" onClick={() => setOpenDelete(true)}>
                                Supprimer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-white p-6">
                            <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                            </DialogHeader>
                            <div>Voulez-vous vraiment supprimer ce chef d'agence ? Cette action est irréversible.</div>
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        deleteChefMutation.mutate(chefAgence.id);
                                        setOpenDelete(false);
                                    }}
                                    disabled={deleteChefMutation.isPending}
                                >
                                    Confirmer
                                </Button>
                                <Button variant="secondary" onClick={() => setOpenDelete(false)}>
                                    Annuler
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
