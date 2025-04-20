"use client"

import {ArrowDownToLine} from "lucide-react";
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/zustandStores'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WithdrawalForm from "./withdrawalForm";

interface Props{
    dictionary:DictionaryType,
    BootstrapUserInfo:BootstrapUserInfo
}


const StartWihdrawal = ({dictionary, BootstrapUserInfo}:Props) => {
    const withdrawals:Withdrawal[] = BootstrapUserInfo?.withdrawals;

    const [isOpen, setIsOpen] = useState(false);

    const closeDialog = () => setIsOpen(false);

    const { user } = useUserStore()

    const isDesabled = true;

    const isCustomer = (user: ViaziCustomer | null) => {
        return user?.customer ?? false
      }

  return (
    <>
        {isCustomer(user) && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                {(!withdrawals || withdrawals.length === 0)?
                    <Button className='capitalize' variant="default" disabled={isDesabled}><ArrowDownToLine className="mr-2" /> {dictionary.initialize_withdrawal}</Button> :
                    <Button className='capitalize' variant="default"><ArrowDownToLine className="mr-2" /> {dictionary.initialize_withdrawal}</Button>
                }
                    
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>{dictionary.withdrawal_title}</DialogTitle>
                    <WithdrawalForm dictionary={dictionary} setIsOpen={closeDialog} withdrawals={withdrawals} withdrawalBalance={BootstrapUserInfo?.wallet?.amount} />
                </DialogContent>
            </Dialog>
            
        )}
    </>
    
    
  )
}

export default StartWihdrawal