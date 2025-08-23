'use client'

import React, { useState } from 'react'
import { Agency } from '@/utils/type/agency'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react'

interface AgencyTableRowProps {
  agency: Agency
  onView: (agency: Agency) => void
  onEdit: (agency: Agency) => void
  onDelete: (publicId: string) => void
}

export function AgencyTableRow({ agency, onView, onEdit, onDelete }: AgencyTableRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TableRow key={agency.publicId}>
      <TableCell className="font-medium">{agency.nom}</TableCell>
      <TableCell>{agency.numero}</TableCell>
      <TableCell>{agency.adresse}</TableCell>
      <TableCell>{agency.telephone}</TableCell>
      <TableCell>{agency.email}</TableCell>
      <TableCell>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {onView(agency); setIsOpen(false)}}>
              <Eye className="mr-2 h-4 w-4" />
              <span>Détails</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {onEdit(agency); setIsOpen(false)}}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(agency.publicId)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

interface AgencyTableProps {
  agencies: Agency[]
  onView: (agency: Agency) => void
  onEdit: (agency: Agency) => void
  onDelete: (publicId: string) => void
  isLoading: boolean
}

export function AgencyTable({ agencies, onView, onEdit, onDelete, isLoading }: AgencyTableProps) {


  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement des agences...</div>
  }

  if (!agencies || agencies.length === 0) {
    return <div className="flex justify-center p-4">Aucune agence trouvée</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency) => (
            <AgencyTableRow
              key={agency.publicId}
              agency={agency}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
