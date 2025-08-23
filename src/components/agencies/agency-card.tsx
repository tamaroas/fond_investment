import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Agency } from '@/utils/type/agency';
import { Button } from '@/components/ui/button';

interface AgencyCardProps {
  agency: Agency;
  onClick: (agency: Agency) => void;
  onDelete: (agency: Agency) => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({ agency, onClick, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer border border-gray-200 transition-all relative"
      onClick={() => onClick(agency)}
    >
      <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => { onDelete(agency); setOpen(false) }}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="text-lg font-semibold mb-2">{agency.nom}</h3>
      <div className="text-sm text-gray-600 mb-1">{agency.adresse}</div>
      <div className="text-sm text-gray-600">Tél: {agency.telephone}</div>
      <div className="text-xs text-gray-400 mt-2">ID: {agency.publicId}</div>
    </div>
  );
};

export default AgencyCard;
