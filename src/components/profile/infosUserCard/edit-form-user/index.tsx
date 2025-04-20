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
import { userServiceRegister } from "@/utils/services/userServices"
import { EditformUserSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"

interface Props {
    dictionary: DictionaryType;
    setIsOpen: (a: boolean) => void,
    current_user: Administrator | Customer | null | undefined
}

function EditFormUser(props: Props) {
    const { dictionary, setIsOpen,current_user } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const [isLoader, setIsLoader] = useState(false)

    const form = useForm<z.infer<typeof EditformUserSchema>>({
        resolver: zodResolver(EditformUserSchema),
        defaultValues: {
            lastname: current_user?.lastname,
            firstname: current_user?.firstname || "",
            email: current_user?.email
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' })
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled !' })
    }

    function onSubmit(data: z.infer<typeof EditformUserSchema>) {

        setIsLoader(true)
    }

    return (
        <>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={'Nom *'}
                            placeholder={'Votre Nom '}
                            form={form}
                            name="lastname"
                            type="text"
                        />
                        <FormFieldCustom
                            label={'Prenom '}
                            placeholder={'Votre Nom Prenom'}
                            form={form}
                            name="firstname"
                            type="text"
                        />
                        <FormFieldCustom
                            label={'Adresse mail *'}
                            placeholder={'Votre Nom email'}
                            form={form}
                            name="email"
                            type="text"
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

export default EditFormUser