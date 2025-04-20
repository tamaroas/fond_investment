import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/zustandStores';
import { userServiceCancelwidrawal, userServiceChangeStatutWithdrawal } from '@/utils/services/userServices';
import React, { useState } from 'react'


interface Props {
    dictionary:DictionaryType,
    id:number
}

const CancelWidrawal = (props:Props) => {
    const {dictionary, id} = props;
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
        userServiceCancelwidrawal(id, processSubmit)
        setIsLoader(true)
    }

  return (
    <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button className='capitalize' > {dictionary.cancel}</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Alert</DialogTitle>
                    <DialogDescription>
                        {dictionary.cancel_withdrawal_confirmationmessage}
                    </DialogDescription>
                </DialogHeader>
                    <div className="w-full flex  gap-2">
                            <Button type="submit" isLoader={isLoader} className=" w-full" onClick={() => changeStatusWithdrawalMethode(id) } >{dictionary.confirm}</Button>
                            <Button type="button" variant='destructive' className=" w-full" onClick={() => closeDialog()} >{dictionary.cancel}</Button>
                    </div>
                </DialogContent>
            </Dialog>
    </>
  )
}

export default CancelWidrawal

 