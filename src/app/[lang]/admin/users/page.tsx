"use client";

import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { notFound } from "next/navigation";
import { userCookies } from "@/utils/cookies";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Plus,
  MoreVertical,
  Pencil,
  CreditCard,
  UserX,
  Loader2,
  Search,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import CreateUserClientModdal from "@/components/userClient/createUserClientModdal";
import { useUserClient } from "@/hooks/use-userClient";
import { UserClientSchema, UserClientType } from "@/schemas/userClient-schema";
import { toast } from "@/components/ui/use-toast";
import userClientService from "@/services/userClient-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema for edit form - partial version of UserClientSchema for editing
const EditUserClientSchema = UserClientSchema.partial().required({
  nom: true,
  prenom: true,
  email: true,
  telephone: true
});

type EditUserClientType = z.infer<typeof EditUserClientSchema>;

export default function UsersPage({ params }: { params: { lang: Langs } }) {
  const [dictionary, setDictionary] = useState<any>({});
  const [options_bread, setOptionsBread] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<UserClientType | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const {
    data,
    isLoading,
    error,
    editUserClientMutation,
    deleteUserClientMutation
  } = useUserClient();
  const queryClient = useQueryClient();

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(params.lang);
      setDictionary(dict);

      setOptionsBread([
        {
          label: dict.dashboard,
          path: `/${params.lang}/admin`
        },
        {
          path: undefined,
          label: dict.users
        }
      ]);
    };

    loadDictionary();
  }, [params.lang]);

  // Setup form for editing
  const editForm = useForm<UserClientType>({
    resolver: zodResolver(UserClientSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: ""
    }
  });

  // Update form values when selected client changes
  useEffect(() => {
    if (selectedClient) {
      editForm.reset({
        nom: selectedClient.nom,
        prenom: selectedClient.prenom,
        email: selectedClient.email,
        telephone: selectedClient.telephone
      });
    }
  }, [selectedClient, editForm]);

  // Handle edit submit
  const handleEditSubmit = (formData: UserClientType) => {
    if (selectedClient) {
      editUserClientMutation.mutate(
        {
          ...formData,
          id: selectedClient?.id
        },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
          }
        }
      );
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedClient) {
      deleteUserClientMutation.mutate(selectedClient.gestionnaireId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
        }
      });
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["userClients"] });
    setIsRefreshing(false);
  };

  // Filter clients based on search term
  const filteredClients =
    data?.content?.filter((client: UserClientType) => {
      if (!searchTerm) return true;

      const searchTermLower = searchTerm.toLowerCase();
      return (
        client.nom.toLowerCase().includes(searchTermLower) ||
        client.prenom.toLowerCase().includes(searchTermLower) ||
        client.email.toLowerCase().includes(searchTermLower) ||
        client.numeroCni.toLowerCase().includes(searchTermLower)
      );
    }) || [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!dictionary.dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ContentLayout
      title={dictionary.users || "Utilisateurs"}
      dictionary={dictionary}
    >
      <BreadcrumbCustom options={options_bread} />

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <CreateUserClientModdal
            open={isCreateDialogOpen}
            setOpen={setIsCreateDialogOpen}
            userClient={null}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </CreateUserClientModdal>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-destructive">
          Une erreur est survenue lors du chargement des clients.
        </div>
      ) : (
        <>
          <div className="rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Client</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Nationalité</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((client: UserClientType) => (
                    <TableRowUserClient
                      key={client.id}
                      client={client}
                      setSelectedClient={setSelectedClient}
                      setIsEditDialogOpen={setIsEditDialogOpen}
                      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Affichage de {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredClients.length)} sur{" "}
              {filteredClients.length} clients
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Suivant
              </Button>
            </div>
          </div>
        </>
      )}

      <CreateUserClientModdal
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        userClient={selectedClient}
      />
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
              irréversible.
            </p>
            {selectedClient && (
              <p className="font-medium mt-2">
                {selectedClient.prenom} {selectedClient.nom}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteUserClientMutation.isPending}
            >
              {deleteUserClientMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}

interface TableRowUserClientProps {
  client: UserClientType;
  setSelectedClient: (client: UserClientType) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

export function TableRowUserClient({
  client,
  setSelectedClient,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen
}: TableRowUserClientProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <TableRow key={client.id}>
      <TableCell>{client.id}</TableCell>
      <TableCell>{client.nom}</TableCell>
      <TableCell>{client.prenom}</TableCell>
      <TableCell>{client.email}</TableCell>
      <TableCell>{client.telephone}</TableCell>
      <TableCell>{client.nationalite}</TableCell>
      <TableCell>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedClient(client);
                setIsEditDialogOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedClient(client);
                setIsDeleteDialogOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              <UserX className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
