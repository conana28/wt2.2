"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format, set } from "date-fns";
import { ArrowUpDown, CopyIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useContext, useState } from "react";
import { getNotes } from "@/actions/note";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { NoteForm } from "./note-add-form";
import { toast } from "sonner";
import { BottleAddEditForm } from "./bottle-add-edit-form";
import { Badge } from "@/components/ui/badge";
import { BottleConsumeForm } from "./bottle-consume-form";
import { BottleDeleteForm } from "./bottle-delete-form";
import { TBottle } from "@/types/bottle";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";
import React from "react";

// type BottleProps = {
//   bottle: TBottle;
// };

interface BottleProps {
  bottle: TBottle;
}

const NoteCell: React.FC<BottleProps> = ({ bottle }) => {
  const [notes, setNotes] = useState<TNote[]>([]);
  // const [dialogType, setDialogType] = useState("");
  const fetchNotes = async () => {
    const response = await getNotes(bottle.wineId, bottle.vintage);
    console.log(response);
    setNotes(response);
    // setDialogType("show");
  };

  return (
    bottle.noteCount > 0 && (
      <>
        <Dialog>
          <DialogTrigger>
            <Badge onClick={fetchNotes} variant="outline">
              {bottle.noteCount}
            </Badge>
          </DialogTrigger>
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
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" size="xs" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

const ActionCell: React.FC<BottleProps> = ({ bottle }) => {
  const { setBottleToEdit } = useContext(BottlesSearchContext);
  // const [notes, setNotes] = useState<TNote[]>([]);
  const [dialogType, setDialogType] = useState("");
  const [bottleFormType, setBottleFormType] = useState(""); // A=Add or E=Edit
  const dialogClose = () => {
    setBottleFormType("");
    setDialogType("");
    document.getElementById("closeDialog")?.click();
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
          {/* Edit Bottle Maintenace */}
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setBottleFormType("E");
                setDialogType("btlAddEdit");
                setBottleToEdit(bottle);
              }}
            >
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          {/* Add Bottle Maintenace */}
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setBottleFormType("A");
                setDialogType("btlAddEdit");
                setBottleToEdit(bottle);
              }}
            >
              Add
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                // setBottleFormType("C");
                setDialogType("btlConsume");
                setBottleToEdit(bottle);
              }}
            >
              Consume
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setDialogType("btlDelete");
                setBottleToEdit(bottle); // Store the btl to edit in context
              }}
            >
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          {/* Add Note */}
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={() => {
                setDialogType("noteAdd");
                setBottleToEdit(bottle); // Store the btl to edit in context
              }}
            >
              Add note
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />

          {/* Show Notes Id */}
          <DropdownMenuItem
            onClick={() =>
              toast.info(`Bottle: ${bottle.id} , wine: ${bottle.wineId}`, {
                position: "top-center",
              })
            }
          >
            Show Ids
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialogType === "noteAdd" && (
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
            dialogClose={dialogClose}
          />
          {/* <DialogFooter className="sm:justify-start"> */}
          <DialogClose asChild>
            <Button type="button" id="closeDialog" className="hidden"></Button>
          </DialogClose>
          {/* </DialogFooter> */}
        </DialogContent>
      )}
      {dialogType === "btlAddEdit" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bottleFormType === "E" ? "Edit" : "Add"} Bottle
            </DialogTitle>
            <DialogDescription className="text-primary text-base">
              {bottle.vintage} {bottle.wine.producer} {bottle.wine.wineName}
            </DialogDescription>
          </DialogHeader>
          <BottleAddEditForm
            dialogClose={dialogClose}
            bottleFormType={bottleFormType}
          />
          <DialogClose asChild>
            <Button type="button" id="closeDialog" className="hidden"></Button>
          </DialogClose>
        </DialogContent>
      )}
      {dialogType === "btlConsume" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consume Bottle</DialogTitle>
            <DialogDescription className="text-primary text-base">
              {bottle.vintage} {bottle.wine.producer} {bottle.wine.wineName}
            </DialogDescription>
          </DialogHeader>
          <BottleConsumeForm
            // btl={{
            //   ...bottle,
            //   occasion: bottle.occasion || undefined,
            //   consume: bottle.consume || undefined,
            // }}
            dialogClose={dialogClose}
          />
          {/* <BottleConsumeForm btl={bottle} dialogClose={dialogClose} /> */}
          <DialogClose asChild>
            <Button type="button" id="closeDialog" className="hidden"></Button>
          </DialogClose>
        </DialogContent>
      )}
      {dialogType === "btlDelete" && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bottle - delete</DialogTitle>
            <DialogDescription className="text-primary text-base">
              {bottle.vintage} {bottle.wine.producer} {bottle.wine.wineName}
            </DialogDescription>
          </DialogHeader>
          {/* <BottleDeleteForm bid={bottle.id} dialogClose={dialogClose} /> */}
          <BottleDeleteForm dialogClose={dialogClose} />
          <DialogClose asChild>
            <Button type="button" id="closeDialog" className="hidden"></Button>
          </DialogClose>
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
    // show badge if noteCount > 0 and open dialog on click
    accessorKey: "noteCount",
    header: "Notes",
    cell: ({ row }) => <NoteCell bottle={row.original} />,
  },
  {
    accessorKey: "vintage",
    header: ({ column }) => {
      return (
        // <Button
        //   variant="ghost"
        //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        // >
        //   Vintage
        //   <ArrowUpDown className="ml-2 h-4 w-4" />
        // </Button>
        // );
        <div className="text-center">Vintage</div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("vintage")}</div>
    ),
  },
  {
    accessorKey: "rack",
    header: "Rack",
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
          {row.original.cost ? (row.original.cost / 100).toFixed(2) : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell bottle={row.original} />,
  },
];

export type TNote = {
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
