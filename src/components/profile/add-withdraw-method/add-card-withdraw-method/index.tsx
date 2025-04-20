import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react"
import AddOmWithdrawForm from "./add-om-withdraw-form"
import AddBankWithdrawForm from "./add-bank-withdraw-form"
import AddMomoWithdrawForm from "./add-momo-withdraw-form"

interface Props {
    dictionary: DictionaryType;
    withdrawal_method: WithdrawalMethod;
}

function AddCardWithdrawMethod(props: Props) {
    const { dictionary, withdrawal_method } = props
    const [isOpen, setIsOpen] = useState(false);

    const closeDialog = () => setIsOpen(false);

    return (
        <>
            <Card className='max-w-[320px] min-w-[200px]'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium w-full">
                        {withdrawal_method.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">{'Ajouter'}</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{"Ajouter une méthode de retrait : " + withdrawal_method.name}</DialogTitle>
                                {/* <DialogDescription>
                                    {"Ajoutez les informations de votre méthode de retrait. Cliquez sur enregistrer pour valider."}
                                </DialogDescription> */}
                            </DialogHeader>
                            {
                                withdrawal_method?.slug === "ORANGE_MONEY" ?
                                    <AddOmWithdrawForm id={withdrawal_method.id} dictionary={dictionary} setIsOpen={closeDialog} />
                                    : withdrawal_method?.slug === "MTN_MOMO" ?
                                        <AddMomoWithdrawForm id={withdrawal_method.id} dictionary={dictionary} setIsOpen={closeDialog} />
                                        : withdrawal_method?.slug === "BANK_TRANSFER" ?
                                            <AddBankWithdrawForm id={withdrawal_method.id} dictionary={dictionary} setIsOpen={closeDialog} /> : null
                            }

                        </DialogContent>
                    </Dialog>

                </CardContent>
            </Card>
        </>
    )
}

export default AddCardWithdrawMethod