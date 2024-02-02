"use client";

import { Button } from "@/components/ui/button";
import { TCBottle } from "@/types/bottle";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TCBottle>[] = [
  {
    id: "name",
    header: "Wine",
    accessorFn: (row) => `${row.wine.producer} ${row.wine.wineName}`,
  },
  {
    accessorKey: "vintage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vintage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rack",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rack
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shelf",
    header: "Shelf",
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right mr-4">Cost</div>,
    cell: function Cell({ row }) {
      return (
        <div className="text-right mr-4">
          {row.original.cost ? row.original.cost / 100 : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "consume",
    header: "Consumed",
    cell: function Cell({ row }) {
      return <div>{format(new Date(row.original.consume!), "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "occasion",
    header: "Occasion",
  },
  {
    accessorKey: "id",
    header: "Id",
  },
];
