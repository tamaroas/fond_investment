"use client";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Pencil, CreditCard, UserX, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddUserForm } from "./AddUserForm/AddUserForm";
import { StatutClient } from "@/utils/type/otherType";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeStatusService } from "@/utils/services/userServices";
import Link from "next/link";




interface Props {
  dictionary?: DictionaryType,
  users: User[],
}

export function ContentUsers(props: Props) {
  const { dictionary, users } = props
  const { toast } = useToast()
  const [open, setOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState<"edit" | "credit" | null>(null);
  const route = useRouter()

  const proccesChangeStatus: CallBackResponseUseFetch = (resp) => {
    setIsLoading(false)
    if (resp.status === 201) {
      toast({ description: "successfull change status" })
      return route.refresh()
    } else {
      return toast({ variant: 'destructive', description: resp?.message ?? "faild" })
    }
  }


  const changeStatus = (id: number, active: boolean) => {
    setIsLoading(true)
    changeStatusService(id, active, proccesChangeStatus)
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]"  >
            <AddUserForm close={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
        <Link href={`/admin/users/add-with-contract`}>
          <Button variant={'outline'}>
            <Plus className="mr-2 h-4 w-4" />
            cree avec un contrat
          </Button>
        </Link>
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Client</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Numéro de CNI</TableHead>
              <TableHead>Telephone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sexe</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>nombre de Compte</TableHead>
              <TableHead>Date de Naissance</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((client) => (
              <TableRow key={'user_' + client.id} >
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.role}</TableCell>
                <TableCell>{client.nom}</TableCell>
                <TableCell>{client.prenom}</TableCell>
                <TableCell>{client.numeroCni}</TableCell>
                <TableCell>{client.telephone}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.sexe}</TableCell>
                <TableCell>{client.adresse}</TableCell>
                <TableCell>{client.nbreCompte}</TableCell>
                <TableCell>{new Date(client.dateNaissance).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(client.dateInscription).toLocaleDateString('fr-FR')}</TableCell>
                {/* <TableCell>{client.typeCompte}</TableCell> */}
                <TableCell>
                  <Badge variant={client.statutClient === StatutClient.actif ? 'default' : client.statutClient === StatutClient.inactif ? 'destructive' : 'secondary'}>
                    {client.statutClient}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" isLoader={isloading} disabled={isloading}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                      {/* Modifier */}
                      <DropdownMenuItem onClick={() => setOpenDialog("edit")}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>

                      {/* Créditer */}
                      <DropdownMenuItem onClick={() => setOpenDialog("credit")}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Créditer le compte
                      </DropdownMenuItem>

                      {/* Désactiver */}
                      {
                        client?.statutClient === StatutClient.actif ?
                          < DropdownMenuItem onClick={() => { changeStatus(client.id, true) }}>
                            <UserX className="mr-2 h-4 w-4" />
                            Désactiver le compte
                          </DropdownMenuItem> :
                          < DropdownMenuItem onClick={() => { changeStatus(client.id, false) }}>
                            <User className="mr-2 h-4 w-4" />
                            Activer le compte
                          </DropdownMenuItem>
                      }

                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Dialog open={openDialog === "edit"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                      <AddUserForm user={client} />
                    </DialogContent>
                  </Dialog>

                  <Dialog open={openDialog === "credit"} onOpenChange={(open) => !open && setOpenDialog(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Créditer le compte</DialogTitle>
                      </DialogHeader >
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="montant" className="text-right">
                            Montant
                          </Label>
                          <Input id="montant" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="motif" className="text-right">
                            Motif
                          </Label>
                          <Input id="motif" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(null)}>Annuler</Button>
                        <Button type="submit" >Valider</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Affichage de 15 clients sur 20
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Précédent
          </Button>
          <Button variant="outline" size="sm">
            Suivant
          </Button>
        </div>
      </div> */}


    </div >
  );
}

