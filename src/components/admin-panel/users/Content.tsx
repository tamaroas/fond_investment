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
import { userServiceUsersPageable } from "@/utils/services/userServices";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  dictionary: DictionaryType,
  BootstrapUserInfo: BootstrapUserInfo,
}


export const columns: ColumnDef<UserCustomer>[] = [
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
    accessorFn: (row) => row.firstname || "N/A",
    id: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Nom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const customer = row.original
        return <div className=" text-nowrap">{customer.firstname + " " + customer.lastname}</div>
    },
  },
  {
    accessorFn: (row) => row.company || "N/A",
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
    cell: ({ row }) => <div className="upercase">{row.getValue("company")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "countryCode",
    header: "Pays",
    cell: ({ row }) => (
      <div className="upercase">{row.getValue("countryCode")}</div>
    ),
  },
  {
    accessorFn: (row) => row.tel || "N/A",
    id: "tel",
    header: "Téléphone",
    cell: ({ row }) => {
        const customer = row.original
        return <div className="lowercase">{`(${customer.callingCode})${customer.tel}`}</div>
    },
  },
  {
    accessorFn: (row) => row.tel || "N/A",
    id: "identity",
    header: "Identité",
    cell: ({ row }) => {
        const customer = row.original
        return <div className="capitalize">{`(${customer.identityType})${customer.identity}`}</div>
    },
  },
  {
    accessorFn: (row) => row,
    id: "wallet",
    header: () => <div className="text-right">Wallet</div>,
    cell: ({ row }) => {
      const wallet = row.original.wallet;
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2,
      }).format(wallet.amount);
  
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorFn: (row) => row,
    id: "wallet",
    header: () => <div className="text-right">Wallet Temporaire</div>,
    cell: ({ row }) => {
      const wallet = row.original.wallet;
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2,
      }).format(wallet.tmpAmount);
  
      return <div className="text-right font-medium">{formatted}</div>;
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
      const wallet = row.original.wallet;
      if(wallet.status){
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">ENABLE</div>
      }else{
        return <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">DESABLE</div>
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
  const [curent_customers, setCurentCustomers] =React.useState(BootstrapUserInfo?.customers)

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
      return setCurentCustomers(resp.datas.customers);
    }
    return toast({description:"Echec", variant:"destructive"})
  }
  
  const handleChangePagination=(page:number) =>{
    const realpage:number = page - 1;
    setIsLoading(true);
    userServiceUsersPageable(realpage, processPagination)
  }
  
  const table = useReactTable({
    data: curent_customers.content,
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
          <CustomPagination totalPages={curent_customers.totalPages} onPageChange={(page) => { handleChangePagination(page)}} isLoader={isloading} />
        </div>
      </div>
    </div>
  );
}
