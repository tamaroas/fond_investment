"use client";
import React, { useState } from "react";
import useManagers from '@/hooks/useManagers';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { defaultValues, ManagerFormValues } from "@/schemas/userManager-schema";
import { useAgency } from '@/hooks/use-agency';
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { Manager } from "@/utils/type/gestionnaire";
import ManagerTableRow from './ManagerTableRow';
import { RoleSwitcherButton } from "@/components/admin/role-switcher-button";



interface GestionnaireContentProps {
  managers?: Manager[];
  agencyId?: string;
}

const GestionnaireContent: React.FC<GestionnaireContentProps> = ({ managers: managersProp, agencyId }) => {
  const { managers: managersHook, loading, error, addManager, editManager, removeManager } = useManagers({ agencyId });
  const managers = managersProp ?? managersHook;
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ManagerFormValues>({ defaultValues });
  console.log(errors);
  // Récupérer toutes les agences (on suppose peu d'agences, sinon adapter la pagination)
  const { data: agencyData, isLoading: loadingAgencies } = useAgency(0, 100);
  const agencies = agencyData?.content || [];

  // States pour les filtres
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Ouvre le formulaire pour ajout ou édition
  const openForm = (manager?: any) => {
    if (manager) {
      setEditId(manager.id);
      setValue("nom", manager.nom);
      setValue("prenom", manager.prenom);
      setValue("username", manager.username);
      setValue("telephone", manager.telephone);
      setValue("email", manager.email);
      setValue("agenceId", manager.agenceId || "");
    } else {
      setEditId(null);
      reset(defaultValues);
    }
    setOpen(true);
  };

  // Soumission du formulaire
  const onSubmit = async (data: ManagerFormValues) => {
    const payload = agencyId ? { ...data, agenceId: agencyId } : data;
    console.log(payload);

    if (editId) {
      await editManager(editId, payload);
    } else {
      await addManager(payload);
    }
    setOpen(false);
    reset(defaultValues);
  };

  // Suppression
  const handleRemove = async (id: string) => {
    await removeManager(id);
  };

  const router = useRouter();

  return (
    <div className="w-full px-4">
      <div className="mb-4">

      </div>
      <div className="flex items-center py-4 justify-between">
        <div>

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
            <h1 className="text-xl font-bold mb-4">Gestion des gestionnaires</h1>
          </div>

        </div>

        <div className="flex gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openForm()} className="bg-primary text-white">Nouveau gestionnaire</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[600px] bg-white p-6">
              <DialogHeader>{editId ? "Modifier" : "Ajouter"} un gestionnaire</DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" {...register("nom", { required: true })} />
                  {errors.nom && <span className="text-xs text-red-500">Champ requis</span>}
                </div>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" {...register("prenom", { required: true })} />
                  {errors.prenom && <span className="text-xs text-red-500">Champ requis</span>}
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username", { required: true })} />
                  {errors.username && <span className="text-xs text-red-500">Champ requis</span>}
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" {...register("telephone", { required: true })} />
                  {errors.telephone && <span className="text-xs text-red-500">Champ requis</span>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} />
                  {errors.email && <span className="text-xs text-red-500">Champ requis</span>}
                </div>
                {/* Select agence */}
                {!agencyId && <div>
                  <Label htmlFor="agenceId">Agence</Label>
                  <select
                    id="agenceId"
                    {...register("agenceId", { required: true })}
                    className="w-full border rounded px-3 py-2"
                    disabled={loadingAgencies}
                  >
                    <option value="">Sélectionnez une agence</option>
                    {agencies.map((agence: any) => (
                      <option key={agence.publicId} value={agence.publicId}>
                        {agence.nom}
                      </option>
                    ))}
                  </select>
                  {errors.agenceId && <span className="text-xs text-red-500">L'agence est requise</span>}
                </div>}
                {!editId && <div>
                  <Label htmlFor="mot2passe">Mot de passe</Label>
                  <Input id="mot2passe" type="password" {...register("mot2passe")} />
                  {errors.mot2passe && <span className="text-xs text-red-500">Champ requis</span>}
                </div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit" variant="default">{editId ? "Modifier" : "Ajouter"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <RoleSwitcherButton 
            targetRole="GESTIONNAIRE" 
            className="flex items-center gap-2"
          >
            Mode gestionnaire
          </RoleSwitcherButton>
        </div>
      </div>
      {/* <div onClick={() => backSpace()} className="mb-4 cursor-pointer  bg-slate-500 w-8 h-8 rounded-full flex justify-center items-center">
        <ChevronRight className="w-6 h-6 text-white rotate-180" />
      </div> */}
      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur: {error.message}</p>}

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="agence-filter" className="font-medium text-gray-700 whitespace-nowrap">Filtre :</label>
          <select
            id="agence-filter"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[200px]"
            value={selectedAgencyId}
            onChange={e => setSelectedAgencyId(e.target.value)}
          >
            <option value="">Toutes les agences</option>
            {agencies.map((agence: any) => (
              <option key={agence.publicId} value={agence.publicId}>{agence.nom}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <label htmlFor="search-manager" className="font-medium text-gray-700 whitespace-nowrap">Recherche :</label>
          <Input
            id="search-manager"
            placeholder="Nom ou téléphone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="rounded-md border px-4">
        <Table

        >
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Agence</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers
              ?.filter((m) =>
                (!selectedAgencyId || m.agenceId === selectedAgencyId) &&
                (m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.telephone.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((m) => (
                <ManagerTableRow
                  key={m.id}
                  manager={m}
                  onEdit={openForm}
                  onDelete={(manager) => {
                    setDeleteId(manager.id || null);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
          </TableBody>
        </Table>
      </div>
      {/* Confirmation dialog for delete */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className=" bg-white p-4">
          <DialogHeader className="text-start font-bold">Confirmer la suppression</DialogHeader>
          <div>Êtes-vous sûr de vouloir supprimer ce gestionnaire ?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) { handleRemove(deleteId); setShowDeleteDialog(false); setDeleteId(null); } }}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionnaireContent;
