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
import { useState, useEffect } from "react"
import { userServiceLogin } from "@/utils/services/userServices"
import Link from "next/link"
import { useToast } from "../ui/use-toast"
import { Toaster } from "../ui/toaster"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { useLogin } from "@/hooks/use-auth"
import { LoginformType, LoginformSchema } from "@/schemas/auth-schema"
// import { ViaziCustomer } from "@/utils/type/globalType"

interface Props {
    dictionary: DictionaryType,
}

export default function LoginForm(props: Props) {
    const { dictionary } = props
    const { mutate } = useLogin()
    const { user, setUser } = useUserStore()
    const router = useRouter()
    const [isLoader, setIsLoader] = useState(false)
  
    useEffect(() => {
        if (user) {
            router.push("/admin");
        }
    }, [user, router]);

    const form = useForm<z.infer<typeof LoginformSchema>>({
        resolver: zodResolver(LoginformSchema),
        defaultValues: {
            login: "",
            mot2passe: "",
        },
    })


    function onSubmit(values: LoginformType) {
        setIsLoader(true)
       mutate(values)
       setIsLoader(false)
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
                            label={"Username"}
                            placeholder={"Username or email"}
                            form={form}
                            type="text"
                            name="login"
                        />
                        <FormFieldCustom
                            label={dictionary.password}
                            placeholder={dictionary.password}
                            form={form}
                            name="mot2passe"
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
