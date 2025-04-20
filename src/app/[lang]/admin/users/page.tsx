import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/layout/content-layout";
import { BreadcrumbCustom } from "@/components/ui/breadcrumb";
import { getDictionary } from "@/utils/getDictionary";
import { Langs } from "@/utils/langs-config";
import { notFound } from "next/navigation";
import { userCookies } from "@/utils/cookies";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Pencil, CreditCard, UserX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

// Données fictives des clients
const fakeClients = Array.from({ length: 20 }, (_, i) => ({
  id: `CL${String(i + 1).padStart(4, '0')}`,
  nom: `Client ${i + 1}`,
  prenom: `Prénom ${i + 1}`,
  numeroCompte: `MF${String(i + 1).padStart(6, '0')}`,
  typeCompte: ['Épargne', 'Crédit', 'Courant'][Math.floor(Math.random() * 3)],
  solde: Math.floor(Math.random() * 1000000),
  statut: ['Actif', 'Inactif', 'En attente'][Math.floor(Math.random() * 3)],
  dateInscription: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('fr-FR')
}));

export default async function UsersPage({ params }: { params: { lang: Langs } }) {
  const dictionary = await getDictionary(params.lang);

  const options_bread = [
    {
      label: dictionary.dashboard,
      path: `/${params.lang}/admin`
    },
    {
      path: undefined,
      label: dictionary.users
    },
  ];

  return (
    <ContentLayout title={dictionary.users} dictionary={dictionary}>
      <BreadcrumbCustom options={options_bread} />
      
      <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nouveau client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nom" className="text-right">
                  Nom
                </Label>
                <Input id="nom" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prenom" className="text-right">
                  Prénom
                </Label>
                <Input id="prenom" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="typeCompte" className="text-right">
                  Type de compte
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epargne">Épargne</SelectItem>
                    <SelectItem value="credit">Crédit</SelectItem>
                    <SelectItem value="courant">Courant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="solde" className="text-right">
                  Solde initial
                </Label>
                <Input id="solde" type="number" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Client</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Numéro de Compte</TableHead>
              <TableHead>Type de Compte</TableHead>
              <TableHead>Solde (FCFA)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.nom}</TableCell>
                <TableCell>{client.prenom}</TableCell>
                <TableCell>{client.numeroCompte}</TableCell>
                <TableCell>{client.typeCompte}</TableCell>
                <TableCell>{client.solde.toLocaleString('fr-FR')}</TableCell>
                <TableCell>
                  <Badge variant={client.statut === 'Actif' ? 'default' : client.statut === 'Inactif' ? 'destructive' : 'secondary'}>
                    {client.statut}
                  </Badge>
                </TableCell>
                <TableCell>{client.dateInscription}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Modifier le client</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="nom" className="text-right">
                                Nom
                              </Label>
                              <Input id="nom" defaultValue={client.nom} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="prenom" className="text-right">
                                Prénom
                              </Label>
                              <Input id="prenom" defaultValue={client.prenom} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="typeCompte" className="text-right">
                                Type de compte
                              </Label>
                              <Select defaultValue={client.typeCompte.toLowerCase()}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="epargne">Épargne</SelectItem>
                                  <SelectItem value="credit">Crédit</SelectItem>
                                  <SelectItem value="courant">Courant</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Annuler</Button>
                            <Button type="submit">Enregistrer</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Créditer le compte
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Créditer le compte</DialogTitle>
                          </DialogHeader>
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
                            <Button variant="outline">Annuler</Button>
                            <Button type="submit">Valider</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenuItem>
                        <UserX className="mr-2 h-4 w-4" />
                        Désactiver le compte
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
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
      </div>
    </ContentLayout>
  );
}
