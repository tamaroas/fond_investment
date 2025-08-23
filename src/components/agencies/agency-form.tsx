'use client'

import React, { useState, useEffect } from 'react'
import { Agency, AgencyCreateDto, AgencyUpdateDto, TimeObject } from '@/utils/type/agency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgencyFormProps {
  agency?: Agency | null
  onClose: () => void
  onSubmit: (data: AgencyCreateDto | AgencyUpdateDto) => void
  isSubmitting: boolean
}

export function AgencyForm({ agency, onClose, onSubmit, isSubmitting }: AgencyFormProps) {
  const isEditMode = !!agency

  const [formData, setFormData] = useState<AgencyCreateDto | AgencyUpdateDto>({
    nom: '',
    numero: '',
    adresse: '',
    telephone: '',
    email: '',
    fax: '',
    heureOuverture: '08:00',
    heureFermeture: '18:00',
    jourOuverture: 'Lundi',
    jourFermeture: 'Vendredi',
    servicesProposes: '',

  })

  useEffect(() => {
    if (agency) {
      // Convertir les objets TimeObject en chaînes de caractères "hh:mm" si nécessaire
      const formatTimeObject = (time: any): string => {
        if (typeof time === 'string') return time;
        if (time && typeof time === 'object' && 'hour' in time && 'minute' in time) {
          const hour = time.hour.toString().padStart(2, '0');
          const minute = time.minute.toString().padStart(2, '0');
          return `${hour}:${minute}`;
        }
        return '00:00';
      };

      // Pour l'édition, nous n'incluons pas le gestionnaire car il est déjà créé
      setFormData({
        publicId: agency.publicId,
        nom: agency.nom,
        numero: agency.numero,
        adresse: agency.adresse,
        telephone: agency.telephone,
        email: agency.email,
        fax: agency.fax,
        heureOuverture: formatTimeObject(agency.heureOuverture),
        heureFermeture: formatTimeObject(agency.heureFermeture),
        jourOuverture: agency.jourOuverture,
        jourFermeture: agency.jourFermeture,
        servicesProposes: agency.servicesProposes,
      })
    }
  }, [agency])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (field: 'heureOuverture' | 'heureFermeture', type: 'hour' | 'minute', value: string) => {
    const numValue = parseInt(value, 10)
    if (isNaN(numValue)) return

    setFormData(prev => {
      // Extraire les heures et minutes actuelles de la chaîne de caractères
      const timeString = prev[field] as string || '00:00';
      const [currentHour, currentMinute] = timeString.split(':').map(part => parseInt(part, 10));

      // Mettre à jour soit l'heure soit la minute
      let hour = type === 'hour' ? numValue : currentHour;
      let minute = type === 'minute' ? numValue : currentMinute;

      // Formater la nouvelle heure au format "hh:mm"
      const newTimeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      return {
        ...prev,
        [field]: newTimeString
      }
    })
  }

  const handleDayChange = (field: 'jourOuverture' | 'jourFermeture', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const days = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ]

  return (
    <Card className="w-[600px] mx-auto overflow-x-scroll ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditMode ? 'Modifier l\'agence' : 'Créer une nouvelle agence'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'agence *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero">Numéro *</Label>
              <Input
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jours d'ouverture *</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="jourOuverture" className="text-xs">De</Label>
                  <Select
                    value={formData.jourOuverture}
                    onValueChange={(value) => handleDayChange('jourOuverture', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Jour d'ouverture" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jourFermeture" className="text-xs">À</Label>
                  <Select
                    value={formData.jourFermeture}
                    onValueChange={(value) => handleDayChange('jourFermeture', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Jour de fermeture" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heures d'ouverture *</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="heureOuverture" className="text-xs">De</Label>
                  <div className="flex">
                    <Input
                      id="heureOuverture-hour"
                      type="number"
                      min="0"
                      max="23"
                      value={parseInt((formData.heureOuverture as string || '00:00').split(':')[0], 10)}
                      onChange={(e) => handleTimeChange('heureOuverture', 'hour', e.target.value)}
                      className="w-16 mr-1"
                      required
                    />
                    <span className="flex items-center">:</span>
                    <Input
                      id="heureOuverture-minute"
                      type="number"
                      min="0"
                      max="59"
                      value={parseInt((formData.heureOuverture as string || '00:00').split(':')[1], 10)}
                      onChange={(e) => handleTimeChange('heureOuverture', 'minute', e.target.value)}
                      className="w-16 ml-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="heureFermeture" className="text-xs">À</Label>
                  <div className="flex">
                    <Input
                      id="heureFermeture-hour"
                      type="number"
                      min="0"
                      max="23"
                      value={parseInt((formData.heureFermeture as string || '00:00').split(':')[0], 10)}
                      onChange={(e) => handleTimeChange('heureFermeture', 'hour', e.target.value)}
                      className="w-16 mr-1"
                      required
                    />
                    <span className="flex items-center">:</span>
                    <Input
                      id="heureFermeture-minute"
                      type="number"
                      min="0"
                      max="59"
                      value={parseInt((formData.heureFermeture as string || '00:00').split(':')[1], 10)}
                      onChange={(e) => handleTimeChange('heureFermeture', 'minute', e.target.value)}
                      className="w-16 ml-1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servicesProposes">Services proposés</Label>
            <Textarea
              id="servicesProposes"
              name="servicesProposes"
              value={formData.servicesProposes}
              onChange={handleChange}
              rows={3}
            />
          </div>

        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" type="button" className="mr-2" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
