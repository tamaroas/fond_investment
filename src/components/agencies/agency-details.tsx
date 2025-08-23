'use client'

import React from 'react'
import { Agency } from '@/utils/type/agency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { X, Edit } from 'lucide-react'

interface AgencyDetailsProps {
  agency: Agency | null
  onClose: () => void
  onEdit: (agency: Agency) => void
}

export function AgencyDetails({ agency, onClose, onEdit }: AgencyDetailsProps) {
  if (!agency) return null

  const formatTime = (time?: any) => {
    // Si c'est déjà une chaîne de caractères au format "hh:mm"
    if (typeof time === 'string' && /^\d{1,2}:\d{1,2}$/.test(time)) {
      // Assurer le format avec des zéros au début si nécessaire
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }
    
    // Si c'est un objet TimeObject
    if (time && typeof time === 'object' && 'hour' in time && 'minute' in time) {
      const hour = time.hour !== undefined ? time.hour : 0;
      const minute = time.minute !== undefined ? time.minute : 0;
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    // Valeur par défaut
    return '00:00';
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Détails de l'agence: {agency.nom}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Informations générales</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Nom:</div>
              <div className="text-sm">{agency.nom}</div>
              
              <div className="text-sm font-medium">Numéro:</div>
              <div className="text-sm">{agency.numero}</div>
              
              <div className="text-sm font-medium">Adresse:</div>
              <div className="text-sm">{agency.adresse}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Téléphone:</div>
              <div className="text-sm">{agency.telephone}</div>
              
              <div className="text-sm font-medium">Email:</div>
              <div className="text-sm">{agency.email}</div>
              
              <div className="text-sm font-medium">Fax:</div>
              <div className="text-sm">{agency.fax || "N/A"}</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Horaires</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Jours d'ouverture:</div>
              <div className="text-sm">{agency.jourOuverture} - {agency.jourFermeture}</div>
              
              <div className="text-sm font-medium">Heures d'ouverture:</div>
              <div className="text-sm">{formatTime(agency.heureOuverture)} - {formatTime(agency.heureFermeture)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Services</h3>
            <div className="text-sm">{agency.servicesProposes || "Aucun service spécifié"}</div>
          </div>
        </div>
        
        {agency.chefAgence && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Chef d'agence</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="text-sm font-medium">Nom:</div>
              <div className="text-sm">{agency.chefAgence.nom} {agency.chefAgence.prenom}</div>
              
              <div className="text-sm font-medium">Email:</div>
              <div className="text-sm">{agency.chefAgence.email}</div>
              
              <div className="text-sm font-medium">Téléphone:</div>
              <div className="text-sm">{agency.chefAgence.telephone}</div>
              
              <div className="text-sm font-medium">Rôle:</div>
              <div className="text-sm">{agency.chefAgence.role}</div>
            </div>
          </div>
        )}
        
        {agency.gestionnaire && agency.gestionnaire.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Gestionnaires ({agency.gestionnaire.length})</h3>
            <div className="grid grid-cols-1 gap-2">
              {agency.gestionnaire.map((manager) => (
                <div key={manager.id} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 border rounded-md">
                  <div className="text-sm font-medium">Nom:</div>
                  <div className="text-sm">{manager.nom} {manager.prenom}</div>
                  
                  <div className="text-sm font-medium">Email:</div>
                  <div className="text-sm">{manager.email}</div>
                  
                  <div className="text-sm font-medium">Téléphone:</div>
                  <div className="text-sm">{manager.telephone}</div>
                  
                  <div className="text-sm font-medium">Rôle:</div>
                  <div className="text-sm">{manager.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" className="mr-2" onClick={onClose}>
          Fermer
        </Button>
        <Button onClick={() => onEdit(agency)}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </CardFooter>
    </Card>
  )
}
