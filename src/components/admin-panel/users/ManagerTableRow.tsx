import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Manager } from '@/utils/type/gestionnaire';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAgency } from '@/hooks/use-agency';

interface ManagerTableRowProps {
  manager: Manager;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
}

const ManagerTableRow: React.FC<ManagerTableRowProps> = ({ manager, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: agencyData } = useAgency(0, 100);
  const agencies = agencyData?.content || [];
  const agency = agencies.find((agency: any) => agency.publicId === manager.agenceId);
  return (
    <TableRow>
      <TableCell>{manager.nom}</TableCell>
      <TableCell>{manager.prenom}</TableCell>
      <TableCell>{agency?.nom
      }</TableCell>
      <TableCell>{manager.telephone}</TableCell>
      <TableCell>{manager.email}</TableCell>
      <TableCell>
        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { onEdit(manager); setShowDropdown(false); }}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { onDelete(manager); setShowDropdown(false); }} className="text-red-600 focus:text-red-600">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ManagerTableRow;
