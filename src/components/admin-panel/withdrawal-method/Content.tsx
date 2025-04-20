"use client";

import * as React from "react";
import { Trash2, PlugZap, Copy } from "lucide-react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon
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
  useReactTable
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import CustomDate from "../CustomDate";
import { userServiceWithdrawalsAdmin } from "@/utils/services/userServices";
import { CustomPagination } from "@/components/ui/CustomPagination";
import { useToast } from "@/components/ui/use-toast";
import PopupDelete from "./PopupDelete";
import SwitchEtat from "./SwitchEtat";
import { Badge } from "@/components/ui/badge";
import ChangeStatus from "./ChangeStatus";

interface Props {
  dictionary: DictionaryType;
  BootstrapUserInfo: BootstrapUserInfo;
}

interface Columns2Props {
  dictionary: DictionaryType;
  modifyWithdrawalMethod: (id: number, action: string) => void;
}

export const Columns2 = ({
  dictionary,
  modifyWithdrawalMethod
}: Columns2Props): ColumnDef<Withdrawals_admin>[] => {
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
      enableHiding: false
    },
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>
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
      cell: ({ row }) => (
        <div className="upercase">{row.getValue("company")}</div>
      )
    },
    {
      accessorFn: (row) => row.customer?.company || "N/A",
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
        const customer = row.original.customer;
        return (
          <div className="lowercase">
            {customer.firstname + " " + customer.lastname}
          </div>
        );
      }
    },
    {
      accessorKey: "paymentMethod",
      header: () => <div className="text-right">Methode</div>,
      cell: ({ row }) => {
        const method = row.original.paymentMethod;

        if (method.slug === "ORANGE_MONEY") {
          return (
            <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-orange-900 uppercase rounded-md select-none whitespace-nowrap bg-orange-500/20">
              {method.name}
            </div>
          );
        } else if (method.slug === "MTN_MOMO") {
          return (
            <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-yellow-900 uppercase rounded-md select-none whitespace-nowrap bg-yellow-500/20">
              {method.name}
            </div>
          );
        } else if (method.slug === "BANK_TRANSFER") {
          return (
            <div className="text-right font-medium relative grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">
              {method.name}
            </div>
          );
        }
      }
    },
    {
      accessorKey: "informations",
      header: () => <div className="text-right">Informations</div>,
      cell: ({ row }) => {
        const method = row.original.paymentMethod;
        const customer = row.original;

        if (method.slug === "ORANGE_MONEY") {
          return (
            <div className="w-max font-bold rounded-md bg-orange-500/20 hover:bg-orange-200/20">
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-orange-900 uppercase  select-none whitespace-nowrap">
                NOM COMPLET: {customer.fullName}
              </div>
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-orange-900 uppercase,select-none whitespace-nowrap">
                NUMERO: {"(" + customer.countryCode + ")" + customer.tel}
              </div>
            </div>
          );
        } else if (method.slug === "MTN_MOMO") {
          return (
            <div className="w-max font-bold rounded-md bg-yellow-500/20 hover:bg-yellow-200/20">
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-yellow-900 uppercase select-none whitespace-nowrap">
                NOM COMPLET: {customer.fullName}
              </div>
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-yellow-900 uppercase select-none whitespace-nowrap">
                NUMERO: {"(" + customer.countryCode + ")" + customer.tel}
              </div>
            </div>
          );
        } else if (method.slug === "BANK_TRANSFER") {
          return (
            <div className="w-max font-bold rounded-md bg-blue-500/20  hover:bg-blue-200/20">
              <div className=" font-medium relative grid items-center px-2 py-1 font-sans text-xs text-blue-900 uppercase select-none whitespace-nowrap">
                NOM COMPLET: {customer.fullName}
              </div>
              <div className=" font-medium relative grid items-center px-2 py-1 font-sans text-xs text-blue-900 uppercase select-none whitespace-nowrap">
                Compte: {customer.bankNumber}
              </div>
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-blue-900 uppercase select-none whitespace-nowrap">
                Iban: {customer.bankIban}
              </div>
              <div className="font-medium relative grid items-center px-2 py-1 font-sans text-xs text-blue-900 uppercase select-none whitespace-nowrap">
                Swift: {customer.bankSwift}
              </div>
            </div>
          );
        }
      }
    },
    {
      accessorKey: "status",
      header: () => <div className="">Etat</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        if (status) {
          return (
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
              VALIDATE
            </div>
          );
        } else {
          return (
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">
              PENDING
            </div>
          );
        }
      }
    },
    {
      accessorFn: (row) => row.active,
      id: "active",
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
        const active = row.getValue("active");
        if (active) {
          return (
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
              ENABLE
            </div>
          );
        } else {
          return (
            <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">
              DISABLE
            </div>
          );
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
        const withdrawalMethod = row.original;

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
                onClick={() =>
                  navigator.clipboard.writeText(withdrawalMethod.id.toString())
                }
              >
                <span className="mr-1">
                  <Copy width={18} />
                </span>{" "}
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!withdrawalMethod.status ? (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <span className="mr-1">
                    <PlugZap width={18} />
                  </span>
                  <SwitchEtat
                    dictionary={dictionary}
                    id={withdrawalMethod.id}
                    modifyWithdrawalMethod={modifyWithdrawalMethod}
                  />
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <span className="mr-1">
                  <PlugZap width={18} />
                </span>{" "}
                <ChangeStatus
                  dictionary={dictionary}
                  id={withdrawalMethod.id}
                  modifyWithdrawalMethod={modifyWithdrawalMethod}
                />
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <span className="mr-1">
                  <Trash2 width={18} />
                </span>{" "}
                <PopupDelete dictionary={dictionary} id={withdrawalMethod.id} modifyWithdrawalMethod={modifyWithdrawalMethod} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
};

export default function Content(props: Props) {
  const { toast } = useToast();
  const { dictionary, BootstrapUserInfo } = props;
  const [curentwithdrawals, setCurentWithdrawals] = React.useState(
    BootstrapUserInfo?.withdrawals_admin
  );
  const [isloading, setIsLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  //function de modification de state
  const modifyWithdrawalMethod = (id: number, action: string) => {
    let updatewithdrawalsMethods:Withdrawals_admins  = curentwithdrawals;
    switch(action){
      case "delete":
        updatewithdrawalsMethods.content = curentwithdrawals.content.filter(
          (withdrawalMethod: Withdrawals_admin) => withdrawalMethod.id !== id
        );
      
        break;
      case "changestatut":
        updatewithdrawalsMethods.content = curentwithdrawals.content.map((withdrawalMethod) =>
          withdrawalMethod.id === id
            ? { ...withdrawalMethod, active: !withdrawalMethod.active }
            : withdrawalMethod
        );

        break;
      case "changeEtat":
        updatewithdrawalsMethods.content = curentwithdrawals.content.map((withdrawalMethod) =>
          withdrawalMethod.id === id
            ? { ...withdrawalMethod, status: !withdrawalMethod.status }
            : withdrawalMethod
        );
        break;
        default:
          return;
    }


   setCurentWithdrawals(updatewithdrawalsMethods);

  };

  const withdrawals_admins = curentwithdrawals?.content || [];

  const processPagination: CallBackResponseUseFetch = (resp) => {
    setIsLoading(false);
    if (resp.success) {
      return setCurentWithdrawals(resp.datas.withdrawals_admin?.content);
    }
    return toast({ description: "Echec", variant: "destructive" });
  };

  const handleChangePagination = (page: number) => {
    const realpage: number = page - 1;
    setIsLoading(true);
    userServiceWithdrawalsAdmin(realpage, processPagination);
  };

  const columns = Columns2({ dictionary, modifyWithdrawalMethod });
  const table = useReactTable({
    data: withdrawals_admins,
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
      rowSelection
    }
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
          <CustomPagination
            totalPages={curentwithdrawals.totalPages}
            onPageChange={(page) => {
              handleChangePagination(page);
            }}
            isLoader={isloading}
          />
        </div>
      </div>
    </div>
  );
}
