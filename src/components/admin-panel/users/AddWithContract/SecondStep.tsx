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

export function SecondStep(props: Props) {
    const { user, close } = props
    const [isloading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const route = useRouter()

    const form = useForm<TypeAddClientFormShema>({
        resolver: zodResolver(addClientFormShema),
        defaultValues: {
        },
    });


    const onSubmit = (values: TypeAddClientFormShema) => {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                </div>
                <div className="flex justify-end gap-2">
                    <Button type="submit" isLoader={isloading} disabled={isloading} className=" ">{'suivant'}</Button>
                </div>
            </form>
        </Form>
    )
}