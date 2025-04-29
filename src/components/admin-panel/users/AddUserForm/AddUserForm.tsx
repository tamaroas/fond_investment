'use client'

import { DialogHeader } from "@/components/ui/dialog";
import { FormFieldCustom } from "@/components/ui/FormFieldCustom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addClientFormShema, TypeAddClientFormShema } from "@/lib/zodSchema";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { use, useState } from "react";
import { addUserService, editUserService } from "@/utils/services/userServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";



interface Props {
    user?: User,
    close?: () => void
}

export function AddUserForm(props: Props) {
    const { user, close } = props
    const [isloading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const route = useRouter()

    const form = useForm<TypeAddClientFormShema>({
        resolver: zodResolver(addClientFormShema),
        defaultValues: {
            adresse: user?.adresse,
            dateNaissance: user?.dateNaissance,
            email: user?.email,
            gestionnaireId: 'GEST-009665-LATRUST',
            lieuNaissance: user?.lieuNaissance,
            mot2passe: '',
            nationalite: user?.nationalite,
            nom: user?.nom,
            numeroCni: user?.numeroCni,
            prenom: user?.prenom,
            sexe: user?.sexe ?? 'MASCULIN',
            telephone: user?.telephone,
        },
    });

    const proccesAddEdit: CallBackResponseUseFetch = (resp) => {
        setIsLoading(false)
        if (resp.status === 201) {
            toast({ description: "successfull" })
            route.refresh()
            close ? close() : null
        } else {
            return toast({ variant: 'destructive', description: resp?.message ?? "faild" })
        }
    }


    const onSubmit = (values: TypeAddClientFormShema) => {
        setIsLoading(true)
        if (user) {
            return editUserService(values, proccesAddEdit)
        }
        addUserService(values, proccesAddEdit)
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Nouveau client</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 px-2 max-h-[80vh] overflow-y-auto">
                        {/** Adresse */}
                        <FormField
                            control={form.control}
                            name="adresse"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Date de naissance */}
                        <FormField
                            control={form.control}
                            name="dateNaissance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date de naissance</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Gestionnaire ID */}
                        <FormField
                            control={form.control}
                            name="gestionnaireId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gestionnaire ID</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Lieu de naissance */}
                        <FormField
                            control={form.control}
                            name="lieuNaissance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lieu de naissance</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Nationalité */}
                        <FormField
                            control={form.control}
                            name="nationalite"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nationalité</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Nom */}
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Numéro CNI */}
                        <FormField
                            control={form.control}
                            name="numeroCni"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numéro CNI</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Prénom */}
                        <FormField
                            control={form.control}
                            name="prenom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Sexe */}
                        <FormField
                            control={form.control}
                            name="sexe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sexe</FormLabel>
                                    <FormControl>
                                        <Select {...field} disabled={isloading} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sexe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="MASCULIN">Masculin</SelectItem>
                                                    <SelectItem value="FEMININ">Féminin</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Téléphone */}
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/** Mot de passe */}
                        <FormField
                            control={form.control}
                            name="mot2passe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} disabled={isloading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <div className="grid grid-cols-4 items-center gap-4">
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
                </div> */}
                    </div>
                    <div className="flex justify-end gap-2">
                        {/* <Button variant="outline" disabled={isloading}>Annuler</Button> */}
                        <Button type="submit" isLoader={isloading} disabled={isloading} className=" w-full">{user ? 'Modifier' : 'Cree '}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}