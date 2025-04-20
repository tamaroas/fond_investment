"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { userServicedeletewidrawalmethod } from "@/utils/services/userServices";
import { useRouter } from "next/navigation";
import { useState } from "react"

interface Props {
    dictionary: DictionaryType;
    withdrawal: Withdrawal;
}

function AddCardWithdrawal(props: Props) {
    const { dictionary, withdrawal } = props
    const [isOpen, setIsOpen] = useState(false);
    const [isLoader, setIsLoader] = useState(false)
    const route = useRouter()

    const closeDialog = () => setIsOpen(false);

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' })
            setIsOpen(false);
            route.refresh();
            return;
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    const deleteWithdrawal = (id:number) => {
        userServicedeletewidrawalmethod(id, processSubmit)
        setIsLoader(true)
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm flex justify-between  font-medium w-full ">
                        <div>{withdrawal.paymentMethod.name}</div>
                        <div>
                            {withdrawal.status ? (
                                <div className="relative grid select-none items-center whitespace-nowrap rounded-lg bg-green-500 py-1.5 px-3 font-sans text-xs font-bold uppercase text-white">Validé</div>
                            ):(
                                <div className="relative grid select-none items-center whitespace-nowrap rounded-lg bg-amber-500 py-1.5 px-3 font-sans text-xs font-bold uppercase text-black">En Attente</div>
                            )} 
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <div className="max-w-72 my-3">
                        {withdrawal.fullName} - {withdrawal?.bankNumber && 
                        (withdrawal?.bankNumber + " - " + withdrawal?.bankIban + " - " + withdrawal?.bankSwift)
                        } {withdrawal?.tel && ("("+withdrawal?.countryCode+")" + withdrawal?.tel)}
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" > {dictionary.delete}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Alert</DialogTitle>
                            <DialogDescription>
                                {dictionary.delete_confirmation}
                            </DialogDescription>
                        </DialogHeader>
                            <div className="w-full flex  gap-2">
                                    <Button type="button" isLoader={isLoader} className=" w-full" onClick={() => deleteWithdrawal(withdrawal.id)}>{dictionary.confirm}</Button>
                                    <Button type="button" variant='destructive' className=" w-full" onClick={() => closeDialog()} >{dictionary.cancel}</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                </CardContent>
            </Card>
        </>
    )
}

export default AddCardWithdrawal
