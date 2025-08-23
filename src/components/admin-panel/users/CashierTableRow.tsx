import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Caissier } from '@/utils/type/caissier';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAgency } from '@/hooks/use-agency';

interface CashierTableRowProps {
  cashier: Caissier;
  onEdit: (cashier: Caissier) => void;
  onDelete: (cashier: Caissier) => void;
}

const CashierTableRow: React.FC<CashierTableRowProps> = ({ cashier, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: agencyData } = useAgency(0, 100);
  const agencies = agencyData?.content || [];
  const agency = agencies.find((agency: any) => agency.publicId === cashier.agenceId);
  return (
    <TableRow>
      <TableCell className="px-6 py-4 whitespace-nowrap">{cashier.nom}</TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">{cashier.prenom}</TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">{agency?.nom}</TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">{cashier.telephone}</TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">{cashier.email}</TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { onEdit(cashier); setShowDropdown(false); }}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { onDelete(cashier); setShowDropdown(false); }} className="text-red-600 focus:text-red-600">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default CashierTableRow;
