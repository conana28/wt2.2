"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Bottle } from "@prisma/client";
import { useContext, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WineContext } from "@/app/contexts/WineContext";

export type WineData = {
  id: number;
  producer: string;
  wineName: string;
  country: string;
  region: string;
  subRegion: string | null;
  type: string | null;
  notes: string | null;
  bottle: Array<Bottle | []>;
};

export const columns: ColumnDef<WineData>[] = [
  {
    id: "name",
    header: "Matching wine",
    accessorFn: (row) => `${row.producer} ${row.wineName}`,
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "region",
    header: "Region",
  },

  {
    accessorKey: "bottle.length",
    header: () => <div className="text-center">Btls</div>,
    cell: function Cell({ row }) {
      return <div className="text-center">{row.original.bottle.length}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: function Cell({ row }) {
      // console.log("Id: ", row);
      // const wine = row.original;
      // const [openEditModal, setOpenEditModal] = useState(false);
      // const [openAddModal, setOpenAddModal] = useState(false);
      // const [openDeleteModal, setOpenDeleteModal] = useState(false);

      const [open, setOpen] = useState(false);
      const { showAction, setShowAction, setWine } = useContext(WineContext);

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={showAction !== ""}>
              <Button variant="ghost" className="float-right mr-2 h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("N");
                    setWine(row.original);
                  }}
                  disabled={
                    row.original.notes === "" || row.original.notes === null
                  }
                >
                  Notes
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("E");
                    setWine(row.original);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                {/* <DropdownMenuItem onClick={() => setOpenAddModal(true)}> */}
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("A");
                    setWine(row.original);
                  }}
                >
                  Add Like
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("D");
                    setWine(row.original);
                  }}
                  disabled={row.original.bottle.length > 0}
                >
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("S");
                    setWine(row.original);
                  }}
                  disabled={row.original.bottle.length === 0}
                >
                  Show bottles
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("B");
                    setWine(row.original);
                  }}
                >
                  Add bottle
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];

export const columnsMob: ColumnDef<WineData>[] = [
  {
    id: "name",
    header: "Matching wine",
    accessorFn: (row) => `${row.producer} ${row.wineName}`,
  },
  {
    accessorKey: "bottle.length",
    header: () => <div className="text-center">Btls</div>,
    cell: function Cell({ row }) {
      return <div className="text-center">{row.original.bottle.length}</div>;
    },
  },

  {
    id: "actions",
    header: () => <div className="text-right"></div>,
    cell: function Cell({ row }) {
      const [open, setOpen] = useState(false);
      const { setShowAction, setWine } = useContext(WineContext);

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className=" h-1 w-1 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("E");
                    setWine(row.original);
                  }}
                >
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                {/* <DropdownMenuItem onClick={() => setOpenAddModal(true)}> */}
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("A");
                    setWine(row.original);
                  }}
                >
                  Add Like
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("D");
                    setWine(row.original);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("S");
                    setWine(row.original);
                  }}
                >
                  Show bottlesM
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setShowAction("B");
                    setWine(row.original);
                  }}
                >
                  Add bottle
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
