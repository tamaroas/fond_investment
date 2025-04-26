"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UserClientSchema, UserClientType } from "@/schemas/userClient-schema";
import { toast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/zustandStores";
import { useUserClient } from "@/hooks/use-userClient";

interface CreateUserClientModdalProps {
  open: boolean;    
  setOpen: (open: boolean) => void;
  userClient: UserClientType | null;
  children?:React.ReactNode

}

export default function CreateUserClientModdal({open, setOpen, userClient,children}: CreateUserClientModdalProps) {
  const {createUserClientMutation, editUserClientMutation} = useUserClient();
  const {user} = useUserStore();
  
  const form = useForm<UserClientType>({
    resolver: zodResolver(UserClientSchema),
    defaultValues: {
      gestionnaireId: user?.id || "",
      nom: userClient?.nom || "",
      prenom: userClient?.prenom || "",
      dateNaissance: userClient?.dateNaissance || "",
      lieuNaissance: userClient?.lieuNaissance || "",
      adresse: userClient?.adresse || "",
      email: userClient?.email || "",
      telephone: userClient?.telephone || "",
      numeroCni: userClient?.numeroCni || "",
      sexe: userClient?.sexe || "MASCULIN",
      nationalite: userClient?.nationalite || "",
    },
  });

  async function onSubmit(data: UserClientType) {
    try {
      if (userClient) {
        await editUserClientMutation.mutateAsync({
          ...data,
          id: userClient.id,
        });
      } else {
        await createUserClientMutation.mutateAsync(data);
      }
      
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating user client:", error);
     
    }
  }

  return (
    <div className="flex justify-end mb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {
                children
            }
        
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau client</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Informations personnelles */}
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lieuNaissance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu de naissance</FormLabel>
                      <FormControl>
                        <Input placeholder="Lieu de naissance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un sexe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MASCULIN">Masculin</SelectItem>
                          <SelectItem value="FEMININ">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nationalite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationalité</FormLabel>
                      <FormControl>
                        <Input placeholder="Nationalité" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Coordonnées et identité */}
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 6XX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numeroCni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro CNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro de CNI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gestionnaireId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Gestionnaire</FormLabel>
                      <FormControl>
                        <Input placeholder="ID du gestionnaire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{userClient ? "Modifier" : "Enregistrer"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
