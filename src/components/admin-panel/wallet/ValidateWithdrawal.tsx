import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/zustandStores';
import { userServiceChangeStatutWithdrawal } from '@/utils/services/userServices';
import React, { useState } from 'react'
import FormValidateWithdrawal from './FormValidateWithdrawal';


interface Props {
    dictionary:DictionaryType,
    id:number,
    payment_methods:PaymentMethod[]
}

const ValidateWithdrawal = (props:Props) => {
    const {dictionary, id, payment_methods} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoader, setIsLoader] = useState(false)

    const closeDialog = () => setIsOpen(false);

    const { user } = useUserStore()

    const isCustomer = (user: ViaziCustomer | null) => {
        return user?.customer ?? false
      }

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            toast({ description: 'success !' })
            setIsOpen(false);
            return;
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    const changeStatusWithdrawalMethode= (id:number) => {
        userServiceChangeStatutWithdrawal(id, processSubmit)
        setIsLoader(true)
    }

  return (
    <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button className='capitalize' > {dictionary.validate}</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dictionary.validate}</DialogTitle>

                    <DialogDescription>
                    {dictionary.tilte_form_validate_withdrawalfrom}
                    </DialogDescription>
                </DialogHeader>
                    <FormValidateWithdrawal id={id} setIsOpen={setIsOpen} dictionary={dictionary} payment_methods={payment_methods} />
                </DialogContent>
            </Dialog>
    </>
  )
}

export default ValidateWithdrawal

  