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
import { EditformSetting, EditformUserSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"

interface Props {
    setting:Setting;
    dictionary: DictionaryType;
    setIsOpen: (a: boolean) => void
}

function EditFormSettings(props: Props) {
    const { setting, dictionary, setIsOpen } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const [isLoader, setIsLoader] = useState(false)

    const form = useForm<z.infer<typeof EditformSetting>>({
        resolver: zodResolver(EditformSetting),
        defaultValues: {
            name: setting.name,
            value: setting.value
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' })
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled !' })
    }

    function onSubmit(data: z.infer<typeof EditformSetting>) {
        setIsLoader(true)
    }

    return (
        <>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={'Nom'}
                            placeholder={''}
                            form={form}
                            name="name"
                            type="text"
                        />

                        <FormFieldCustom
                            label={'Value'}
                            placeholder={''}
                            form={form}
                            name="value"
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

export default EditFormSettings