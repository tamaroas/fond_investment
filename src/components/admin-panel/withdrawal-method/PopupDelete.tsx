import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useUserStore } from '@/store/zustandStores';
import { userServicedeletewidrawalmethod } from '@/utils/services/userServices';
import React, { useState } from 'react'


interface Props {
    dictionary:DictionaryType,
    id:number,
    modifyWithdrawalMethod: (id: number, action: string) => void
}

const PopupDelete = (props:Props) => {
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
            modifyWithdrawalMethod(id, "delete")
            closeDialog();
            setTimeout(()=>{
              toast({ description: "success !" });
            },500)
            return;
        }
        setIsLoader(false)
        return toast({ variant: 'destructive', description: 'failled' })
    }

    const deleteWithdrawalMethode= (id:number) => {
        userServicedeletewidrawalmethod(id, processSubmit)
        setIsLoader(true)
    }

  return (
    <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button className='capitalize' > {dictionary.delete}</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Alert</DialogTitle>
                    <DialogDescription>
                        {dictionary.delete_confirmation}
                    </DialogDescription>
                </DialogHeader>
                    <div className="w-full flex  gap-2">
                            <Button type="submit" isLoader={isLoader} className=" w-full" onClick={() => deleteWithdrawalMethode(id) } >{dictionary.confirm}</Button>
                            <Button type="button" variant='destructive' className=" w-full" onClick={() => { setIsOpen(false)}} >{dictionary.cancel}</Button>
                    </div>
                </DialogContent>
            </Dialog>
    </>
  )
}

export default PopupDelete