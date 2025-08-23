"use client"
import React, { useState } from 'react';
import { useAgency } from '@/hooks/use-agency';
import { Agency, AgencyCreateDto, AgencyUpdateDto } from '@/utils/type/agency';
import { Button } from '@/components/ui/button';
import { AgencyTable } from '@/components/agencies/agency-table';
import AgencyCard from '@/components/agencies/agency-card';
import { AgencyDetails } from '@/components/agencies/agency-details';
import { AgencyForm } from '@/components/agencies/agency-form';
import { Plus, RefreshCw, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';

const AgenciesPage = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null);
  const {
    data,
    isLoading,
    error,
    refetch,
    createAgencyMutation,
    updateAgencyMutation,
    deleteAgencyMutation
  } = useAgency();

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Handlers for agency actions
  const handleViewAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowDetails(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowEditForm(true);
    setShowDetails(false);
  };

  const handleDeleteAgency = async (publicId: string) => {
    try {
      await deleteAgencyMutation.mutateAsync(publicId);
      toast({
        title: "Agence supprimée",
        description: "L'agence a été supprimée avec succès",
      });
      setShowDeleteDialog(false);
      setAgencyToDelete(null);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur lors de la suppression",
        description: error.data?.message || "Une erreur est survenue lors de la suppression de l'agence",
        variant: "destructive",
      });
    }
  }


  const handleCreateAgency = async (data: AgencyCreateDto) => {
    setIsSubmitting(true);
    try {
      await createAgencyMutation.mutateAsync(data);
      toast({
        title: "Agence créée",
        description: "L'agence a été créée avec succès",
      });
      setShowCreateForm(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.data?.message || "Une erreur est survenue lors de la création de l'agence",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAgency = async (data: AgencyUpdateDto) => {
    setIsSubmitting(true);
    try {
      await updateAgencyMutation.mutateAsync(data);
      toast({
        title: "Agence mise à jour",
        description: "L'agence a été mise à jour avec succès",
      });
      setShowEditForm(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.data?.message || "Une erreur est survenue lors de la mise à jour de l'agence",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des agences</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle agence
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Erreur: {error.message}
        </div>
      )}



      {/* Liste des agences en cards */}
      {(() => {
        // Hook pour la navigation
        const { useRouter } = require('next/navigation');
        const router = useRouter();
        // Hook pour récupérer les agences
        const { useAgency } = require('@/hooks/use-agency');
        const { data: agencyData } = useAgency(0, 100);
        const agencies: import('@/utils/type/agency').Agency[] = agencyData?.content || [];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
            {agencies.map((agency: import('@/utils/type/agency').Agency) => (
              <AgencyCard
                key={agency.publicId}
                agency={agency}
                onClick={() => router.push(`/admin/agencies/${agency.publicId}`)}
                onDelete={() => {
                  setAgencyToDelete(agency);
                  setShowDeleteDialog(true);
                }}
              />
            ))}
          </div>
        );
      })()}


      {/* Dialog for agency details */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <AgencyDetails
            agency={selectedAgency}
            onClose={() => setShowDetails(false)}
            onEdit={handleEditAgency}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a new agency */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl">
          <AgencyForm
            onClose={() => setShowCreateForm(false)}
            onSubmit={(data) => {
              // Type assertion since we know this is a create form
              handleCreateAgency(data as AgencyCreateDto);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for editing an agency */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-4xl">
          <AgencyForm
            agency={selectedAgency}
            onClose={() => setShowEditForm(false)}
            onSubmit={(data) => {
              // Type assertion since we know this is an update form
              handleUpdateAgency(data as AgencyUpdateDto);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog for confirming agency deletion */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white p-4">
          <DialogHeader className="text-start font-bold">Confirmer la suppression</DialogHeader>
          <div>Êtes-vous sûr de vouloir supprimer l'agence <span className="font-semibold">{agencyToDelete?.nom}</span> ?</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Annuler</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (agencyToDelete) {
                  handleDeleteAgency(agencyToDelete.publicId);

                }
              }}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgenciesPage;
