"use client";

import * as React from "react";
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
import { CustomPagination } from "@/components/ui/CustomPagination";
import { userServiceTransactionPageable } from "@/utils/services/userServices";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  dictionary: DictionaryType,
  BootstrapUserInfo: BootstrapUserInfo,
}


export const columns: ColumnDef<Transaction>[] = [
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
    accessorFn: (row) => row.customer?.company || "N/A",
    id: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Companie
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("company")}</div>,
  },
  {
    accessorKey: "orderId",
    header: () => <div className="text-right">Order ID</div>,
    cell: ({ row }) => (
      <div className="capitalize text-right text-nowrap">{row.getValue("orderId")}</div>
    ),
  },
  {
    accessorKey: "initAmount",
    header: () => <div className="text-right">Montant Initial</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("initAmount"));

      // Format the amount as a currency
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "commission",
    header: () => <div className="text-right">Commissions</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("commission"));
  
      // Format the amount as a currency with fixed decimals
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 2, // Toujours afficher 2 chiffres après la virgule
        maximumFractionDigits: 2,
      }).format(amount);
  
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "amountCommission",
    header: () => <div className="text-right">Montant Des Commissions</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amountCommission"));
  
      // Format the amount as a currency with fixed decimals
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 2, // Toujours afficher 2 chiffres après la virgule
        maximumFractionDigits: 2,
      }).format(amount);
  
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Montant</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a currency
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: () => <div className="text-right">Payment Method</div>,
    cell: ({ row }) => {
      const transaction = row.original;

      let paymentMethod = "";
      if (transaction.om) {
        paymentMethod = "ORANGE_MONEY";
        return <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-orange-900 uppercase rounded-md select-none whitespace-nowrap bg-orange-500/20">{paymentMethod}</div>;
      } else if (transaction.momo) {
        paymentMethod = "MTN_MOMO";
        return <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-yellow-900 uppercase rounded-md select-none whitespace-nowrap bg-yellow-500/20">{paymentMethod}</div>;
      } else if (transaction.stripe) {
        paymentMethod = "BANK_CART";
        return <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">{paymentMethod}</div>;
      }
    },
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
      const transaction = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(transaction.id.toString())}
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View transaction details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


export function Content(props:Props) {
  const { toast } = useToast()
  const { dictionary, BootstrapUserInfo } = props
  const [isloading, setIsLoading] = React.useState(false)
  const [curent_transactions, setCurentTransactions] =React.useState(BootstrapUserInfo?.transactions)

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const processPagination:CallBackResponseUseFetch = (resp) => {
    setIsLoading(false);
    if(resp.success){
      return setCurentTransactions(resp.datas.transactions);
    }
    return toast({description:"Echec", variant:"destructive"})
  }
  
  const handleChangePagination=(page:number) =>{
    const realpage:number = page - 1;
    setIsLoading(true);
    userServiceTransactionPageable(realpage, processPagination)
  }
  
  const table = useReactTable({
    data: curent_transactions.content,
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
          placeholder="Filter Company..."
          value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company")?.setFilterValue(event.target.value)
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
          <CustomPagination totalPages={curent_transactions.totalPages} onPageChange={(page) => { handleChangePagination(page)}} isLoader={isloading} />
        </div>
      </div>
    </div>
  );
}
