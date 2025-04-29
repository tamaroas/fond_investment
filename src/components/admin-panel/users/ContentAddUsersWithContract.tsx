"use client";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Pencil, CreditCard, UserX, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddUserForm } from "./AddUserForm/AddUserForm";
import { StatutClient } from "@/utils/type/otherType";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeStatusService } from "@/utils/services/userServices";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AddFormWithContract } from "./AddWithContract/AddFormWithContract";

interface Props {
  dictionary?: DictionaryType,
}

export function ContentAddUsersWithContract(props: Props) {
  const { dictionary } = props
  const { toast } = useToast()
  const [open, setOpen] = useState(false);
  const [isloading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState<"edit" | "credit" | null>(null);
  const route = useRouter()

  const proccesChangeStatus: CallBackResponseUseFetch = (resp) => {
    setIsLoading(false)
    if (resp.status === 201) {
      toast({ description: "successfull change status" })
      return route.refresh()
    } else {
      return toast({ variant: 'destructive', description: resp?.message ?? "faild" })
    }
  }


  const changeStatus = (id: number, active: boolean) => {
    setIsLoading(true)
    changeStatusService(id, active, proccesChangeStatus)
  }

  return (
    <div className="w-full">
      <div className="rounded-md border mt-6">
        <AddFormWithContract />
      </div>

    </div >
  );
}

