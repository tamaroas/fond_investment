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
import { Input } from "../ui/input"
import { Form } from "../ui/form"
import { FormFieldCustom } from "../ui/FormFieldCustom"
import { useState } from "react"
import { userServiceLogin } from "@/utils/services/userServices"
import { LoginformSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useToast } from "../ui/use-toast"
import { Toaster } from "../ui/toaster"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
// import { ViaziCustomer } from "@/utils/type/globalType"

interface Props {
    dictionary: DictionaryType,
}

export default function LoginForm(props: Props) {
    const { dictionary } = props
    const { toast } = useToast()
    const { user, setUser
    } = useUserStore()
    const route = useRouter()
    const params = useParams();
    const [isLoader, setIsLoader] = useState(false)
    let url_redirect = params?.url_redirect as string
    url_redirect = url_redirect ? decodeURIComponent(url_redirect) : 'admin/'
    if (user) {
        // return route.push(url_redirect);
    }

    const form = useForm<z.infer<typeof LoginformSchema>>({
        resolver: zodResolver(LoginformSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: dictionary.success_connexion })
            setUser(resp?.datas)
            return route.push('/')
            // return route.push(url_redirect)
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: dictionary.failed_connexion })
    }

    function onSubmit(values: z.infer<typeof LoginformSchema>) {
        setIsLoader(true)
        processSubmit({
            success: true,
            datas: {
                id: 1,
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@example.com",
                tel: 33612345678,
                callingCode: 33,
                company: "Acme Corp",
                identityType: "passport",
                identity: "FR123456789",
                publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsamplePublicKey",
                privateKey: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKsamplePrivateKey",
                status: true,
                emailVerifiedAt: new Date(),
                rememberToken: "abc123xyz456",
                roles: {
                    id: 1,
                    name: "customer",
                    permissions: ["view_wallet", "update_profile"]
                },
                wallet: {
                    id: 1,
                    balance: 1500.75,
                    currency: "EUR",
                    updatedAt: new Date().toISOString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        })
        // userServiceLogin(values, processSubmit)
    }

    return (
        <Card className="max-w-sm min-w-80">
            <CardHeader>
                <CardTitle>{dictionary.tologin} </CardTitle>
                <CardDescription> {dictionary.welcomelogin}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={dictionary.email}
                            placeholder={dictionary.placeholder_email}
                            form={form}
                            type="email"
                            name="email"
                        />
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="password"
                            type="password"
                        />
                        <Link href={'#'} className="my-2">{dictionary.forgotpassword}</Link>
                        <div className="w-full">
                            <Button type="submit" isLoader={isLoader} className=" w-full" >{dictionary.connection}</Button>
                        </div>
                    </form>
                </CardContent>
            </Form>
            <Toaster />
        </Card >
    )
}
