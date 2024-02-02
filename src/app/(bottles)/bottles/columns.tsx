"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { getNotes } from "@/actions/note";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { NoteForm } from "./note-form";
import { TBottle } from "@/types/bottle";

type TNote = {
  id: number;
  vintage: number;
  author: string;
  noteText: string | null;
  rating: string;
  drinkFrom: string | null;
  drinkTo: string | null;
  createdAt: Date;
  updatedAt: Date;
  wineId: number;
};
type BottleProps = {
  bottle: TBottle;
};

const BottleCell: React.FC<BottleProps> = ({ bottle }) => {
  const [notes, setNotes] = useState<TNote[]>([]);
  const [dialogType, setDialogType] = useState("");
  const fetchNotes = async () => {
    const response = await getNotes(bottle.wineId, bottle.vintage);
    console.log(response);
    setNotes(response);
    setDialogType("show");
  };
  const addNote = async () => {
    setDialogType("add");
  };
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={fetchNotes}
              disabled={bottle.noteCount === 0}
            >
              <span>Show Notes</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={addNote}>Add note</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => console.log(bottle.wineId, bottle.vintage)}
          >
            Show Notes Id
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogType === "show" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notes</DialogTitle>
            <DialogDescription className="text-primary text-base">
              {bottle.vintage} {bottle.wine.producer} {bottle.wine.wineName}
            </DialogDescription>
          </DialogHeader>
          {/* <div className="flex items-center space-x-2"> */}
          {notes.length > 0 && (
            <ScrollArea className="h-96">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent>
                    <p>
                      {note.author} {note.rating}
                    </p>
                    {note.noteText}
                    {note.drinkFrom ? ` From ${note.drinkFrom}` : ""}
                    {note.drinkTo ? ` To ${note.drinkTo}` : ""}
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          )}
          {notes.length === 0 && (
            <Card>
              <CardContent className="text-center ">
                <p className="mt-6">No notes found for this wine</p>
              </CardContent>
            </Card>
          )}
          {/* </div> */}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" size="xs" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogType === "add" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription className="text-primary text-base">
              {bottle.vintage} {bottle.wine.producer} {bottle.wine.wineName}
            </DialogDescription>
          </DialogHeader>
          <NoteForm
            formType={"A"}
            vintage={bottle.vintage}
            wid={bottle.wineId}
          />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" size="xs" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export const columns: ColumnDef<TBottle>[] = [
  {
    id: "name",
    header: "Wine",
    accessorFn: (row) => `${row.wine.producer} ${row.wine.wineName}`,
  },
  {
    accessorKey: "wine.country",
    header: "Country",
  },
  {
    accessorKey: "noteCount",
    header: "Notes",
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
    id: "actions",
    cell: ({ row }) => <BottleCell bottle={row.original} />,
  },
];
