"use client";

import * as React from "react";
import {Copy, TicketCheck, TicketX } from "lucide-react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CustomDate from "../CustomDate";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { userServiceTransactionPageable, userServiceUsersPageable, userServiceWalletTransactionsPageable } from "@/utils/services/userServices";
import { description } from '../../charts/bar-graph';
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/zustandStores";
import ValidateWithdrawal from "./ValidateWithdrawal";
import CancelWidrawal from "./CancelWidrawal";

interface Props {
  dictionary: DictionaryType,
  BootstrapUserInfo: BootstrapUserInfo
}


export const Columns2 = (
  dictionary: DictionaryType, payment_methods: PaymentMethod[]
):ColumnDef<WalletTransaction>[] => {

  const { user } = useUserStore()

  const isAdmin = (user: ViaziCustomer | null) => {
    return user?.administrator ? true : false
  }

  return [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorFn: (row) => row,
    id: "sender",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Émétteur
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const infoSender = row.original.sender;
        const lastname= row.original.sender?.lastname || "-"
        const firstname= row.original.sender?.firstname || "-"
        return <div className=" font-medium">{firstname} {lastname}</div>;
      },
  },
  {
    accessorFn: (row) => row,
    id: "receiver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Destinataire
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const infoReceiver = row.original.receiver;
      return <div className=" font-medium">{infoReceiver.firstname} {infoReceiver.lastname}</div>;
      },
  },
  {
    accessorFn: (row) => row,
    id: "amount",
    header: () => <div className="">Montant Initial</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      if(transaction.type === "DEPOSIT"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencyReceiver.isoCode,
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
          }).format(transaction.amount);

        return <div className=" font-medium">{formatted}</div>;
      }else if(transaction.type === "WITHOUTDRAW"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencySender.isoCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(transaction.amount);

        return <div className=" font-medium">{formatted}</div>;
      }
      
    },
  },
  {
    accessorFn: (row) => row,
    id: "amount Before",
    header: () => <div className="">Montant Avant</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      if(transaction.type === "DEPOSIT"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencyReceiver.isoCode,
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
          }).format(transaction.amountReceiverAfter);

        return <div className=" font-medium">{formatted}</div>;
      }else if(transaction.type === "WITHOUTDRAW"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencySender.isoCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(transaction.amountSenderAfter);

        return <div className=" font-medium">{formatted}</div>;
      }
      
    },
  },
  {
    accessorFn: (row) => row,
    id: "amountWithRate",
    header: () => <div className="">Montant</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      if(transaction.type === "DEPOSIT"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencyReceiver.isoCode,
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
          }).format(transaction.amountWithRate);

        return <div className=" font-medium">{formatted}</div>;
      }else if(transaction.type === "WITHOUTDRAW"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencySender.isoCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(transaction.amount);

        return <div className=" font-medium">{formatted}</div>;
      }
      
    },
  },
  {
    accessorFn: (row) => row,
    id: "Amount After",
    header: () => <div className="">Montant Après</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      if(transaction.type === "DEPOSIT"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencyReceiver.isoCode,
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
          }).format(transaction.amountReceiverBefore);

        return <div className=" font-medium">{formatted}</div>;
      }else if(transaction.type === "WITHOUTDRAW"){
        const formatted = new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: transaction.currencySender.isoCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(transaction.amountSenderBefore);

        return <div className=" font-medium">{formatted}</div>;
      }
      
    },
  },
  {
    accessorKey: "method",
    header: "Méthode",
    cell: ({ row }) => (
        <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">{row.getValue("method")}</div>
      ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
        <div className="relative items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">{row.getValue("type")}</div>
      ),
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Statut"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status');
      if(status === "SUCCESS"){
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">{status}</div>
      }else if (status === "CANCELED"){
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">{status}</div>
      }else if (status === "PENDING"){
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-yellow-900 uppercase rounded-md select-none whitespace-nowrap bg-yellow-500/20">{status}</div>
      }else if(status === "PENDING_SUCCESS"){
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-yellow-500/20">{status}</div>
      }
    }
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Date D'Ajout"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="upercase">{row.getValue("createdAt")}</div>
    )
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Date De Modification"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="upercase">{row.getValue("updatedAt")}</div>
    )
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const wallet = row.original;

      return (
        <>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(wallet.id.toString())}
            >
              <Copy /> {dictionary?.copy || 'copy'} ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {(isAdmin(user)) &&(
              <>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><span className="mr-1"><TicketCheck/></span> <ValidateWithdrawal dictionary={dictionary} id={wallet.id} payment_methods={payment_methods} /></DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><span className="mr-1"><TicketX/></span> <CancelWidrawal dictionary={dictionary} id={wallet.id} /></DropdownMenuItem>
              </>
              
            )}
            
          </DropdownMenuContent>
        </DropdownMenu>
        </>
        
      );
    },
  },
];
}


export function Content(props:Props) {
    const { toast } = useToast()
    const { dictionary, BootstrapUserInfo } = props
    const [isloading, setIsLoading] = React.useState(false)
    const [curent_walletTransaction, setCurentwalletTransaction] =React.useState(BootstrapUserInfo?.wallet_transactions)

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const walletTransaction = curent_walletTransaction?.content || []

  const processPagination:CallBackResponseUseFetch = (resp) => {
    setIsLoading(false);
    if(resp.success){
      return setCurentwalletTransaction(resp.datas.wallet_transactions);
    }
    return toast({description:"Echec", variant:"destructive"})
  }
  
  const handleChangePagination=(page:number) =>{
    const realpage:number = page - 1;
    setIsLoading(true);
    userServiceWalletTransactionsPageable(realpage, processPagination)
  }

  const columns = Columns2(dictionary, BootstrapUserInfo?.payment_methods)
  
  const table = useReactTable({
    data: walletTransaction,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Name"
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <CustomPagination totalPages={curent_walletTransaction.totalPages} onPageChange={(page) => { handleChangePagination(page)}} isLoader={isloading} />
        </div>
      </div>
    </div>
  );
}
