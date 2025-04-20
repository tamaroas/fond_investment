"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/zustandStores";
import { userServiceChangeStatutWithdrawal } from "@/utils/services/userServices";
import React, { useState } from "react";

interface Props {
  dictionary: DictionaryType;
  id: number;
  modifyWithdrawalMethod: (id: number, action: string) => void;
}

const ChangeStatus = (props: Props) => {
  const { dictionary, id, modifyWithdrawalMethod } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const closeDialog = () => {
    setIsLoader(false);  
    setIsOpen(false);
  };

  const { user } = useUserStore();

  const isCustomer = (user: ViaziCustomer | null) => {
    return user?.customer ?? false;
  };

  const processSubmit: CallBackResponseUseFetch = (resp) => {
    if (resp?.success) {
      modifyWithdrawalMethod(id, "changestatut");
      closeDialog();
      setTimeout(()=>{
        toast({ description: "success !" });
      },500)
    } else {
      setIsLoader(false);
      return toast({ variant: "destructive", description: "failled" });
    }
  };

  const changeStatusWithdrawalMethode = (id: number) => {
    userServiceChangeStatutWithdrawal(id, processSubmit);
    setIsLoader(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="capitalize"> {dictionary.edit_status}</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alert</DialogTitle>
            <DialogDescription>
              {dictionary.change_etat_confirmation}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex  gap-2">
            <Button
              type="submit"
              isLoader={isLoader}
              className=" w-full"
              onClick={() => changeStatusWithdrawalMethode(id)}
            >
              {dictionary.confirm}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className=" w-full"
              onClick={() => closeDialog()}
            >
              {dictionary.cancel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeStatus;
