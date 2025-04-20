'use client'

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { WithdrawalMethodOmformSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"
import { userServiceWidrawalMethodAddom } from "@/utils/services/userServices"

interface Props {
    id:number;
    dictionary: DictionaryType;
    setIsOpen: (a: boolean) => void
}

function AddOmWithdrawForm(props: Props) {
    const {id, dictionary, setIsOpen } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const params = useParams();
    const [isLoader, setIsLoader] = useState(false)

    const form = useForm<z.infer<typeof WithdrawalMethodOmformSchema>>({
        resolver: zodResolver(WithdrawalMethodOmformSchema),
        defaultValues: {
            id_withdrawal_method:id,
            full_name: "",
            country_code: "237",
            tel:"",
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' })
            setIsOpen(false);
            route.refresh();
            return;
        }

        if(!resp?.success && resp?.status === 400 && resp?.message.includes('MOT DE PASSE INCORRECT')){
            toast({variant: 'destructive', description:`${dictionary.message_incorrrectPassWord} !`})
            setIsLoader(false)
            return;
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    function onSubmit(data: z.infer<typeof WithdrawalMethodOmformSchema>) {
        userServiceWidrawalMethodAddom(data, processSubmit);
        setIsLoader(true)

    }

    return (
        <>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={''}
                            placeholder={''}
                            form={form}
                            name="country_code"
                            type="hidden"
                        />
                        <FormFieldCustom
                            label={''}
                            placeholder={''}
                            form={form}
                            name="id_withdrawal_method"
                            type="hidden"
                        />
                        <FormFieldCustom
                            label={'Entrer Votre Nom Complet *'}
                            placeholder={'Votre Nom Complet'}
                            form={form}
                            name="full_name"
                            type="text"
                        />
                        <FormFieldCustom
                            label={'Entrer Votre Numéro De Téléphone *'}
                            placeholder={'Numéro De Téléphone'}
                            form={form}
                            name="tel"
                            type="text"
                        />
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="password"
                            type="password"
                        />
                        <div className="w-full flex  gap-2">
                            <Button type="submit" isLoader={isLoader} className=" w-full" >{dictionary.confirm}</Button>
                            <Button type="button" variant='destructive' className=" w-full" onClick={() => { !isLoader ? setIsOpen(false) : null }} >{dictionary.cancel}</Button>
                        </div>
                    </form>
                </CardContent>
            </Form>
        </>
    )
}

export default AddOmWithdrawForm