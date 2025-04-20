'use client'

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LoginformSchema, ProfileformSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"
import { useState } from "react"
import { useUserStore } from "@/store/zustandStores"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"

interface Props {
    dictionary: DictionaryType
}

function ProfileForm(props: Props) {
    const { dictionary } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const params = useParams();
    const [isLoader, setIsLoader] = useState(false)
    let url_redirect = params?.url_redirect as string
    url_redirect = url_redirect ? decodeURIComponent(url_redirect) : 'login/'
    if (user) {
        // return route.push(url_redirect);
    }

    const form = useForm<z.infer<typeof ProfileformSchema>>({
        resolver: zodResolver(ProfileformSchema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: dictionary.success_register })
            return toast({ description: dictionary.failed_register })
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: dictionary.failed_register })
    }

    function onSubmit(data: z.infer<typeof ProfileformSchema>) {

        setIsLoader(true)
        // useEditeProfileServices(data, processSubmit)
    }

    return (
        <Card className="max-w-sm  sm:min-w-[300px] mt-3 ">
            <CardHeader>
                <CardTitle>{dictionary.profile_title2} </CardTitle>
                <CardDescription>  </CardDescription>
            </CardHeader>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="old_password"
                            type="password"
                        />
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="new_password"
                            type="password"
                        />
                        <FormFieldCustom
                            label={dictionary.confirmpassword}
                            placeholder={dictionary.placeholder_confirmpassword}
                            form={form}
                            name="confirm_password"
                            type="password"
                        />
                        <div className="w-full">
                            <Button type="submit" isLoader={isLoader} className=" w-full" >{dictionary.confirm}</Button>
                        </div>
                    </form>
                </CardContent>
                {/* <CardFooter className="flex flex-col justify-center gap-2">

                </CardFooter> */}
            </Form>
        </Card >
    )
}

export default ProfileForm
