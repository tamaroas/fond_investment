'use client'

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { InitializeWithdrawalformSchema } from "@/lib/zodSchema"
import { Form, FormField } from "@/components/ui/form"
import { FormFieldCustom } from "@/components/ui/FormFieldCustom"
import { useToast } from "@/components/ui/use-toast"
import { CardContent } from "@/components/ui/card"
import { useUserStore } from "@/store/zustandStores"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Value } from "@radix-ui/react-select"
import { userServiceIntialwithdrawal } from "@/utils/services/userServices"

interface Props {
    withdrawals:Withdrawal[];
    withdrawalBalance: number;
    dictionary: DictionaryType;
    setIsOpen: (a: boolean) => void
}


function WithdrawalForm(props: Props) {
    const {withdrawals, withdrawalBalance, dictionary, setIsOpen } = props
    const { toast } = useToast()
    const { user } = useUserStore()
    const route = useRouter()
    const params = useParams();
    const [isLoader, setIsLoader] = useState(false)

    useEffect(() => {
        if(!withdrawals || withdrawals.length === 0){
            toast({
                variant: 'destructive',
                description: 'Aucune méthode de retrait ajoutée !'
            });
        }
    },[withdrawals, toast]);
    

    const isEmptyWithdrawalsMethod = (withdrawalsMethod:Withdrawal[]) =>{
        if(!withdrawalsMethod){
           return toast({variant: 'destructive', description:'acune methode de Retrait ajoutée !'})
        }
    }

   

    const withdrawalMethodCustomer = withdrawals.map((item) => ({
        value:item.id.toString(),
        label:item.paymentMethod.name
    }))


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

        if( resp?.message.includes('ERROR')){
            toast({variant: 'destructive', description:`${dictionary.error} !`})
            setIsLoader(false)
            return;
        }
        
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    function onSubmit(data: z.infer<typeof InitializeWithdrawalformSchema>) {
        const amount = data?.amount
        if (amount > withdrawalBalance) {
            form.setError("amount", {
                type: "manual",
                message: `${dictionary.erro_feald_amount_initwithdrawal}`,
            });
            return;
        }
        
        userServiceIntialwithdrawal(data, processSubmit)
        setIsLoader(true)
    }

    const form = useForm<z.infer<typeof InitializeWithdrawalformSchema>>({
        resolver: zodResolver(InitializeWithdrawalformSchema),
        defaultValues: {
            id_withdrawal: withdrawalMethodCustomer[0].value,
            amount:0
        },
    })

    return (
        <>
            <Form {...form}>
                <CardContent>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormFieldCustom
                            label={'Sélectioner Le Moyen De Retrait *'}
                            form={form}
                            name="id_withdrawal"
                            type="select"
                            optionsSelect={withdrawalMethodCustomer}
                        />
                        <FormFieldCustom
                            label={`Entrer Le montant Max(${withdrawalBalance})*`}
                            placeholder={'amount'}
                            form={form}
                            name="amount"
                            type="number"
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

export default WithdrawalForm