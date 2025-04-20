"use client";

import * as React from "react";
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

import { CustomPagination } from "@/components/ui/CustomPagination";
import { userServiceTransactionPageable } from "@/utils/services/userServices";
import { useToast } from "@/components/ui/use-toast";
import CustomDate from "../../CustomDate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import EditFormSettings from "./edit-form-settings";
import Test from "./Edit";
import Edit from "./Edit";

interface Props {
  dictionary: DictionaryType;
  bootstrapDatas: BootstrapUserInfo;
}

interface Columns2Props {
    dictionary: DictionaryType;
  }

  export const Columns2 = ({
    dictionary
  }: Columns2Props): ColumnDef<Setting>[] => {
    const [isOpen, setIsOpen] = React.useState(false);
    const closeDialog = ()=>setIsOpen(false)


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
    accessorFn: (row) => row.name,
    id: "name",
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>
  },
  {
    accessorFn: (row) => row.value,
    id: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("value")}</div>
  },
  {
    accessorKey: "createdAt",
    header: "Date D'Ajout",
    cell: ({ row }) => <CustomDate date={row.getValue("createdAt")} />
  },
  {
    accessorKey: "updatedAt",
    header: "Date De Modification",
    cell: ({ row }) => <CustomDate date={row.getValue("updatedAt")} />
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const setting = row.original;

      return (
        <Edit setting={setting} dictionary={dictionary}/>
      );
    }
  }
];
  }

  export default function OtherSettings(props: Props) {
    const { dictionary, bootstrapDatas } = props;
    const [curent_settings, setCurentSettings] = React.useState(
      bootstrapDatas?.settings
    );
  
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    );
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
      pageIndex: 0,
      pageSize: 10,
    });
  
    const columns = Columns2({ dictionary });
  
    const table = useReactTable({
      data: curent_settings,
      columns,
      pageCount: Math.ceil(curent_settings.length / pagination.pageSize),
      onPaginationChange: setPagination,  // <-- Ajout de cette ligne pour gérer les changements de pagination
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
        pagination,
      },
    });
  
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
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
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
            </Button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} sur{" "}
              {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
