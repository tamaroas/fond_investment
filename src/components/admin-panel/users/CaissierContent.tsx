"use client"
import React, { useState } from "react";
import useCaissiers from "@/hooks/useCaissiers";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import CashierTableRow from './CashierTableRow';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caissierFormSchema, CaissierFormValues, defaultValues } from "@/schemas/caissier-schema";
import { Caissier } from "@/utils/type/caissier";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAgency } from "@/hooks/use-agency";
import { toast } from "@/components/ui/use-toast";
import { RoleSwitcherButton } from "@/components/admin/role-switcher-button";

interface CaissierContentProps {
  caissiers?: Caissier[];
  agencyId?: string;
}

const CaissierContent: React.FC<CaissierContentProps> = ({ agencyId }) => {
  const { caissiers: caissiersHook, loading, error, addCaissier, editCaissier, removeCaissier } = useCaissiers({ agencyId });
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Plus besoin de filteredCaissiers ni de useEffect
  // Le filtrage se fait directement dans le rendu
  const caissiers = caissiersHook;
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: agencyData, isLoading: loadingAgencies } = useAgency(0, 100);
  const agencies = agencyData?.content || [];


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Caissier>({
    resolver: zodResolver(caissierFormSchema),
    defaultValues,
  });

  const handleOpenCreate = () => {
    reset(defaultValues);
    setIsEdit(false);
    setSelectedId(null);
    setOpen(true);
  };

  const handleOpenEdit = (caissier: any) => {
    reset({ ...caissier, password: "" }); // Pas de password en modification
    setIsEdit(true);
    setSelectedId(caissier.id);
    setOpen(true);
  };

  const onSubmit = (data: Caissier) => {
    try {
      const payload = { ...data, agenceId: selectedAgencyId };
      if (isEdit && selectedId) {
        const { mot2passe, ...editData } = payload;
        editCaissier(selectedId, editData);
      } else {
        addCaissier(payload);
      }
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);

    }
  };
  const router = useRouter();
  const backSpace = () => {
    router.back();
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center py-4 justify-between">
        <div className="flex flex-col gap-2 w-full">
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
            <h1 className="text-xl font-bold mb-4">Gestion des caissiers</h1>
          </div>
          {/* Filtres agence + recherche */}
          <div className="flex flex-col md:flex-row gap-4 mt-2 w-full items-center">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Label htmlFor="agency-select" className="font-medium text-gray-700 whitespace-nowrap">Filtre :</Label>
              <Select value={selectedAgencyId} onValueChange={setSelectedAgencyId}>
                <SelectTrigger id="agency-select" className="min-w-[200px]">
                  <SelectValue placeholder="Toutes les agences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les agences</SelectItem>
                  {agencies.map((agence: any) => (
                    <SelectItem key={agence.id} value={agence.id}>
                      {agence.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 w-full md:w-1/3">
              <Label htmlFor="search-cashier" className="font-medium text-gray-700 whitespace-nowrap">Recherche :</Label>
              <Input
                id="search-cashier"
                placeholder="Nom ou téléphone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleOpenCreate} className="bg-primary text-white">Nouveau caissier</Button>
          
          <RoleSwitcherButton 
            targetRole="CAISSIER" 
            className="flex items-center gap-2"
          >
            Mode caissier
          </RoleSwitcherButton>
        </div>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">Erreur: {error.message}</p>}
      <div className="rounded-md border">
        <Table>
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
            {caissiers
              ?.filter((c) =>
                (selectedAgencyId === 'all' || !selectedAgencyId || c.agenceId === selectedAgencyId) &&
                (c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.telephone.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((c) => (
                <CashierTableRow
                  key={c.id}
                  cashier={c}
                  onEdit={handleOpenEdit}
                  onDelete={(cashier) => {
                    setDeleteId(cashier.id || null);
                    setShowDeleteDialog(true);
                  }}
                />
              ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className=" bg-white p-4 ">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Modifier' : 'Ajouter'} un caissier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" {...register("nom")} />
              {errors.nom && <span className="text-red-500 text-xs">{errors.nom.message}</span>}
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" {...register("prenom")} />
              {errors.prenom && <span className="text-red-500 text-xs">{errors.prenom.message}</span>}
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" {...register("telephone")} />
              {errors.telephone && <span className="text-red-500 text-xs">{errors.telephone.message}</span>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
            {<div>
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
            {!isEdit && (
              <div>
                <Label htmlFor="mot2passe">Mot de passe</Label>
                <Input id="mot2passe" type="password" {...register("mot2passe")} />
                {errors.mot2passe && <span className="text-red-500 text-xs">{errors.mot2passe.message}</span>}
              </div>
            )}
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 text-white">
                {isEdit ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirmation dialog for delete */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>Confirmer la suppression</DialogHeader>
          <div>Êtes-vous sûr de vouloir supprimer ce caissier ?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) { removeCaissier(deleteId); setShowDeleteDialog(false); setDeleteId(null); } }}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaissierContent;
