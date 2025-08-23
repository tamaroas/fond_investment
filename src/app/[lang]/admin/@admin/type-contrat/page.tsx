"use client";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { typeContratSchema, TypeContrat } from "@/schemas/type-contrat.schema";
import { useTypeContrats } from "@/hooks/useTypeContrat";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";

interface TypeContratTableRowProps {
    contrat: TypeContrat;
    onEdit: (contrat: TypeContrat) => void;
    onDelete: (contrat: TypeContrat) => void;
}

const TypeContratTableRow: React.FC<TypeContratTableRowProps> = ({ contrat, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
            <TableRow className=" bg-white">
                <TableCell>{contrat.nom}</TableCell>
                <TableCell className=" max-w-40 ">{contrat.description}</TableCell>
                <TableCell>{contrat.duree} mois</TableCell>
                <TableCell>{contrat.tauxInteret} %</TableCell>
                <TableCell>{contrat.typeVersement}</TableCell>
                <TableCell>{contrat.type}</TableCell>
                <TableCell>
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setModalOpen(true); setOpen(false); }}>
                                Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { onEdit(contrat); setOpen(false); }}>
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setShowDeleteModal(true); setOpen(false); }} className="text-red-600 focus:text-red-600">
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="bg-white p-4 max-h-[calc(100vh-10rem)] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Détails du plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-1">
                        <div><b>Nom:</b> {contrat.nom}</div>
                        <div><b>Description:</b> {contrat.description}</div>
                        <div><b>Durée:</b> {contrat.duree} mois</div>
                        <div><b>Durée renouvellement:</b> {contrat.dureeRenouvellement} mois</div>
                        <div><b>Taux intérêt:</b> {contrat.tauxInteret} %</div>
                        <div><b>Frais ouverture:</b> {contrat.fraisOuverture}</div>
                        <div><b>Frais clôture:</b> {contrat.fraisCloture}</div>
                        <div><b>Frais renouvellement:</b> {contrat.fraisRenouvellement}</div>
                        <div><b>Frais retrait:</b> {contrat.fraisRetrait}</div>
                        <div><b>Frais fiscalité:</b> {contrat.fraisFiscalite}</div>
                        <div><b>Frais versement:</b> {contrat.fraisVersement}</div>
                        <div><b>Taux frais gestion:</b> {contrat.tauxFraisGestion}</div>
                        <div><b>Montant min versement:</b> {contrat.montantMinVersement}</div>
                        <div><b>Montant max versement:</b> {contrat.montantMaxVersement}</div>
                        <div><b>Montant retrait max:</b> {contrat.montantRetraitMax}</div>
                        <div><b>Penalité retrait avant échéance:</b> {contrat.penaliteRetraitAvantEcheance}</div>
                        <div><b>Type versement:</b> {contrat.typeVersement}</div>
                        <div><b>Type:</b> {contrat.type}</div>
                        <div><b>Renouvelable:</b> {contrat.renouvelable ? 'Oui' : 'Non'}</div>
                        <div><b>Bénéficiaires:</b> {contrat.hasBeneficiares ? 'Oui' : 'Non'}</div>
                        <div><b>Signataires:</b> {contrat.hasSignataires ? 'Oui' : 'Non'}</div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setModalOpen(false)} type="button">Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="bg-white p-4">
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">Voulez-vous vraiment supprimer ce plan ? Cette action est irréversible.</div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={() => { onDelete(contrat) }}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default function TypeContratPage() {
    const { data, isLoading, create, update, remove } = useTypeContrats();
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<TypeContrat | null>(null);

    const form = useForm<TypeContrat>({
        resolver: zodResolver(typeContratSchema),
        defaultValues: editData || {
            nom: "",
            description: "",
            duree: 0,
            dureeRenouvellement: 0,
            tauxInteret: 0,
            fraisOuverture: 0,
            fraisCloture: 0,
            fraisRenouvellement: 0,
            fraisRetrait: 0,
            fraisFiscalite: 0,
            fraisVersement: 0,
            tauxFraisGestion: 0,
            montantMinVersement: 0,
            montantMaxVersement: 0,
            montantRetraitMax: 0,
            hasBeneficiares: false,
            hasSignataires: false,
            penaliteRetraitAvantEcheance: 0,
            typeVersement: "MENSUEL",
            type: "EPARGNE",
            renouvelable: false,
        },
    });
    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            form.reset();
        }
    }, [open, form]);
    function handleEdit(row: TypeContrat) {
        setEditData(row);
        setOpen(true);
        form.reset(row);
    }

    function handleNew() {
        setEditData(null);
        setOpen(true);
        form.reset();
    }

    function onSubmit(values: TypeContrat) {
        if (editData) {
            update.mutateAsync({ id: editData.publicId!, payload: values })
                .then(() => setOpen(false));
        } else {
            create.mutateAsync(values as Omit<TypeContrat, 'publicId'>)
                .then(() => setOpen(false));
        }
    }

    function handleDelete(row: TypeContrat) {
        remove.mutateAsync(row.publicId!).then(() => {

        });
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gestion de plan </h2>
                <Button onClick={handleNew}>Nouveau plan</Button>
            </div>

            <Table className="bg-white " >
                <TableHeader>
                    <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Durée</TableCell>
                        <TableCell>Taux intérêt</TableCell>
                        <TableCell>Type versement</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex justify-center items-center py-6">
                                    <LoadingSpinner className="w-6 h-6" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data && data.length > 0 ? (
                        data.map((row: TypeContrat) => (
                            <TypeContratTableRow key={row.publicId} contrat={row} onEdit={handleEdit} onDelete={handleDelete} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>Aucun type de contrat trouvé.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white p-4 max-h-[calc(100vh-10rem)] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>{editData ? "Modifier" : "Créer"} un type de contrat</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                className="w-full min-h-[80px] border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="duree"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée (mois)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dureeRenouvellement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée renouvellement (mois)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tauxInteret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Taux d'intérêt (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisOuverture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais d'ouverture</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisCloture"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais de clôture</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisRenouvellement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais de renouvellement</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisRetrait"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais de retrait</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisFiscalite"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais de fiscalité</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fraisVersement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Frais de versement</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tauxFraisGestion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Taux frais de gestion (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="montantMinVersement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant minimum versement</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="montantMaxVersement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant maximum versement</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="montantRetraitMax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Montant retrait maximum</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hasBeneficiares"
                                render={({ field }) => (
                                    <FormItem className=" flex  gap-2">
                                        <FormLabel className=" mt-1.5">Bénéficiaires</FormLabel>
                                        <FormControl>
                                            <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hasSignataires"
                                render={({ field }) => (
                                    <FormItem className=" flex  gap-2">
                                        <FormLabel className=" mt-1.5">Signataires</FormLabel>
                                        <FormControl>
                                            <input type="checkbox" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="penaliteRetraitAvantEcheance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pénalité retrait avant échéance</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="typeVersement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type de versement</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MENSUEL">Mensuel</SelectItem>
                                                    <SelectItem value="TRIMESTRIEL">Trimestriel</SelectItem>
                                                    <SelectItem value="SEMESTRIEL">Semestriel</SelectItem>
                                                    <SelectItem value="ANNUEL">Annuel</SelectItem>
                                                    <SelectItem value="UNIQUE">Unique</SelectItem>
                                                    <SelectItem value="NON_SPECIFIE">Non spécifié</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="EPARGNE">Epargne</SelectItem>
                                                    <SelectItem value="INVESTISSEMENT">Investissement</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="renouvelable"
                                render={({ field }) => (
                                    <FormItem className=" flex  gap-2">
                                        <FormLabel className=" mt-1.5">Renouvelable</FormLabel>
                                        <FormControl>
                                            <input type="checkbox" className=" mb-2" checked={field.value} onChange={e => field.onChange(e.target.checked)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" isLoader={create.isPending || update.isPending}>
                                    {editData ? "Mettre à jour" : "Créer"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
