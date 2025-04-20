import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/zustandStores';
import { userServiceValidateWithdrawal } from '@/utils/services/userServices';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface Props {
    dictionary:DictionaryType,
    id:number,
    modifyWithdrawalMethod: (id: number, action: string) => void
}

const SwitchEtat = (props:Props) => {

    const {dictionary, id, modifyWithdrawalMethod} = props;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoader, setIsLoader] = useState(false)

    const closeDialog = () => {
        setIsLoader(false);  
        setIsOpen(false);
      };

    const { user } = useUserStore()

    const isCustomer = (user: ViaziCustomer | null) => {
        return user?.customer ?? false
      }

    const processSubmit: CallBackResponseUseFetch = (resp) => {
        if (resp?.success) {
            modifyWithdrawalMethod(id,"changeEtat")
            setIsOpen(false);
            closeDialog();
            setTimeout(()=>{
              toast({ description: "success !" });
            },500)
            return;
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    const switchSatat = (id:number) => {
        userServiceValidateWithdrawal(id, processSubmit)
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
                    <DialogTitle>Alert</DialogTitle>
                    <DialogDescription>
                        {dictionary.change_etat_confirmation}
                    </DialogDescription>
                </DialogHeader>
                    <div className="w-full flex  gap-2">
                            <Button type="button" isLoader={isLoader} className=" w-full" onClick={() => switchSatat(id)} >{dictionary.confirm}</Button>
                            <Button type="button" variant='destructive' className=" w-full" onClick={() => closeDialog()} >{dictionary.cancel}</Button>
                    </div>
                </DialogContent>
            </Dialog>
    </>
  )
}

export default SwitchEtat