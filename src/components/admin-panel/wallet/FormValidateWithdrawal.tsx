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
import { ValidateWithdrawalformSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"
import { userServiceWidrawalValideSend } from "@/utils/services/userServices"

interface Props {
    id:number;
    dictionary: DictionaryType;
    setIsOpen: (a: boolean) => void;
    payment_methods:PaymentMethod[]
}

function FormValidateWithdrawal(props: Props) {
    const { id, dictionary, setIsOpen, payment_methods } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const [isLoader, setIsLoader] = useState(false)

    const withdrawalMethodAdmin = payment_methods.map((item) => ({
        value:item.id.toString(),
        label:item.name
    }))

    const form = useForm<z.infer<typeof ValidateWithdrawalformSchema>>({
        resolver: zodResolver(ValidateWithdrawalformSchema),
        defaultValues: {
            id_payment_method: withdrawalMethodAdmin[0].value,
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' });
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
        return toast({ variant: 'destructive', description: 'failled !' })
    }

    function onSubmit(data: z.infer<typeof ValidateWithdrawalformSchema>) {
        userServiceWidrawalValideSend(id, data, processSubmit);
        setIsLoader(true)
    }

    return (
        <>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={'Sélectioner un moyen de payement *'}
                            form={form}
                            name="id_payment_method"
                            type="select"
                            optionsSelect={withdrawalMethodAdmin}
                        />
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="password"
                            type="password"
                        />
                        <div className="w-full flex  gap-2">
                            <Button type="submit" isLoader={isLoader} className=" w-full" >{dictionary.validate}</Button>
                            <Button type="button" variant='destructive' className=" w-full" onClick={() => { !isLoader ? setIsOpen(false) : null }} >{dictionary.cancel}</Button>
                        </div>
                    </form>
                </CardContent>
            </Form>
        </>
    )
}

export default FormValidateWithdrawal 