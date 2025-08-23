'use client';

import React, { useState, useEffect } from 'react';
import { Input } from './input';

interface MontantInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export function MontantInput({
  value,
  onChange,
  placeholder = "Entrez le montant",
  required = false,
  id,
  className,
}: MontantInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Formater la valeur initiale
  useEffect(() => {
    if (value) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toLocaleString('fr-FR').replace(/\s/g, ' '));
      } else {
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Supprimer tous les caractères non numériques
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Mettre à jour la valeur brute via le callback
    onChange(rawValue);
    
    // Formater pour l'affichage
    if (rawValue) {
      const numValue = parseInt(rawValue, 10);
      setDisplayValue(numValue.toLocaleString('fr-FR'));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      required={required}
      className={className}
    />
  );
}
