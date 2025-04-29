'use client'

import { DialogHeader } from "@/components/ui/dialog";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { FirstStep } from "./FirstStep";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ThirdStep } from "./ThirdStep";
import { SecondStep } from "./SecondStep";



interface Props {
}

export function AddFormWithContract(props: Props) {
    const { } = props
    const [isloading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const route = useRouter()

    const form = useForm<TypeAddClientFormShema>({
        resolver: zodResolver(addClientFormShema),
        defaultValues: {
            adresse: '',
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
        // setIsLoading(true)
        // if (user) {
        //     return editUserService(values, proccesAddEdit)
        // }
        // addUserService(values, proccesAddEdit)
    }

    return (
        <div className=" p-2">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Step 1 </AccordionTrigger>
                    <AccordionContent>
                        < FirstStep />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Step 2</AccordionTrigger>
                    <AccordionContent>
                        <SecondStep />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Step 3</AccordionTrigger>
                    <AccordionContent>
                        <ThirdStep />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}