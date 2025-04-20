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
import { FormFieldCustom } from "../ui/FormFieldCustom"
import { useState } from "react"
import { userServiceRegister } from "@/utils/services/userServices"
import { RegisterformSchema } from "@/lib/zodSchema"
import Link from "next/link"
import { useToast } from "../ui/use-toast"
import { Toaster } from "../ui/toaster"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useUserStore } from "@/store/zustandStores"
import { getPhoneData } from "../ui/phoneInputCustom/phone-input"
import { Form } from "../ui/form"

interface Props {
    dictionary: DictionaryType,
}

export default function RegisterForm(props: Props) {
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

    const form = useForm<z.infer<typeof RegisterformSchema>>({
        resolver: zodResolver(RegisterformSchema),
        defaultValues: {
            lastname: "",
            firstname: "",
            company: "",
            email: "",
            phone: "",
            password: "",
            confirm_password: "",
        },
    })

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: dictionary.success_register })
            return route.push(url_redirect)
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: dictionary.failed_register })
    }

    function onSubmit(data: z.infer<typeof RegisterformSchema>) {
        const phoneData = data?.phone ? getPhoneData(data?.phone) : null;

        if (!phoneData || !phoneData.isValid) {
            form.setError("phone", {
                type: "manual",
                message: "Invalid phone number",
            });
            return;
        }
        delete data?.phone;
        delete data?.confirm_password;
        data.code = phoneData.countryCallingCode
        data.tel = phoneData.nationalNumber
        console.log(data)
        setIsLoader(true)
        userServiceRegister(data, processSubmit)
    }

    const identityType = [
        {
            value: '0',
            label: 'choisisez...',
        },
        {
            value: 'CNI',
            label: 'Carte d\'identité',
        },
        {
            value: 'PASSPORT',
            label: 'Pasport',
        },
    ]

    const currency = [
        {
            value: '1',
            label: 'Franc CFA',
        },
        {
            value: '2',
            label: 'Dollar',
        },
        {
            value: '3',
            label: 'Euro',
        },
    ]

    return (
        <>
            <Card className="max-w-sm  sm:min-w-[600px] mt-3">
                <CardHeader>
                    <CardTitle>{dictionary.register} </CardTitle>
                    <CardDescription> {dictionary.welcomesignup}</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <CardContent>
                        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className=" w-full sm:grid sm:grid-cols-2 sm:gap-2 ">
                                <FormFieldCustom
                                    label={dictionary.name}
                                    placeholder={dictionary.placeholder_lastname}
                                    form={form}
                                    name="lastname"
                                    type="text"
                                />
                                <FormFieldCustom
                                    label={dictionary.fierstname}
                                    placeholder={dictionary.placeholder_fierstname}
                                    form={form}
                                    name="firstname"
                                    type="text"
                                />
                            </div>
                            <div className=" w-full sm:grid sm:grid-cols-2 sm:gap-2 ">
                                <FormFieldCustom
                                    label={dictionary.companyname}
                                    placeholder={dictionary.placeholder_company}
                                    form={form}
                                    name="company"
                                    type="text"
                                />

                                <FormFieldCustom
                                    label={dictionary.numberid}
                                    placeholder={dictionary.placeholder_numberid}
                                    form={form}
                                    name="identity"
                                    type="text"
                                />
                            </div>
                            <div className=" w-full sm:grid sm:grid-cols-2 sm:gap-2 ">
                                <FormFieldCustom
                                    label={dictionary.typeid}
                                    placeholder={dictionary.typeid}
                                    form={form}
                                    name="identityType"
                                    type="select"
                                    optionsSelect={identityType}
                                />
                                <FormFieldCustom
                                    label={dictionary.currency}
                                    placeholder={dictionary.currency}
                                    form={form}
                                    name="currency"
                                    type="select"
                                    optionsSelect={currency}
                                />
                            </div>
                            <div className=" w-full sm:grid sm:grid-cols-2 sm:gap-2 ">
                                <FormFieldCustom
                                    label={dictionary.phone}
                                    placeholder={dictionary.phone}
                                    form={form}
                                    name="phone"
                                    type="PhoneInput"
                                />
                                <FormFieldCustom
                                    label={dictionary.email}
                                    placeholder={dictionary.placeholder_email}
                                    form={form}
                                    name="email"
                                    type="email"
                                />
                            </div>
                            <div className=" w-full sm:grid sm:grid-cols-2 sm:gap-2 ">
                                <FormFieldCustom
                                    label={dictionary.password}
                                    placeholder={dictionary.password}
                                    form={form}
                                    name="password"
                                    type="password"
                                />
                                <FormFieldCustom
                                    label={dictionary.confirmpassword}
                                    placeholder={dictionary.placeholder_confirmpassword}
                                    form={form}
                                    name="confirm_password"
                                    type="password"
                                />
                            </div>
                            <p >
                                {dictionary.policy}
                                <Link href={'#'} className="underline">{'  ' + dictionary.policylink}</Link>
                            </p>
                            <div className="w-full">
                                <Button type="submit" isLoader={isLoader} className=" w-full" >{dictionary.connection}</Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-center gap-2">
                        <div className=" w-full">{dictionary.questionlogin}<Link href={'login'} > {dictionary.gobacktologin}</Link> </div>
                        <div><Link href={'/'} > {dictionary.gobacktohome}</Link></div>
                    </CardFooter>
                </Form>
                <Toaster />
            </Card >
            {/* <PhoneInputForm /> */}
        </>
    )
}
