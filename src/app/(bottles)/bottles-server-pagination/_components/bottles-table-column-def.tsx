"use client";

// import { tasks, type Task } from "@/db/schema"
import { useState } from "react";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  TB,
  TNote,
} from "@/types";
import { Bottle } from "@prisma/client";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { catchError } from "@/lib/catch-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { getNotes } from "../_lib/n_actions";

const NoteCellComponent = ({ row }: { row: any }) => {
  const noteCount: number = row.getValue("noteCount") as number;
  const [notes, setNotes] = useState<TNote[]>([]);

  const fetchNotes = async () => {
    const response = await getNotes(row.original.wineId, row.original.vintage);
    setNotes(response);
  };

  return (
    noteCount > 0 && (
      <>
        <Dialog>
          <DialogTrigger>
            <Badge onClick={fetchNotes} variant="outline">
              {noteCount}
            </Badge>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notes</DialogTitle>
              <DialogDescription className="text-base text-primary">
                {row.original.vintage} {row.original.wname}
              </DialogDescription>
            </DialogHeader>
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
                <Button type="button" size="sm" variant="secondary">
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

export function fetchBottlesTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<TB, unknown>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value); // Selects/deselects all rows in the table.
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value); // Selects/deselects the row.
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // create a column with both producer and wineName
    {
      id: "wname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wine" />
      ),
      cell: ({ row }) => <div>{row.original.wname}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Country" />
      ),
      cell: ({ row }) => <div>{row.getValue("country")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vintage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vintage" />
      ),
      cell: ({ row }) => <div>{row.getValue("vintage")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "rack",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rack" />
      ),
      cell: ({ row }) => <div>{row.getValue("rack")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "shelf",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shelf" />
      ),
      cell: ({ row }) => <div>{row.getValue("shelf")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "noteCount",
      header: ({ column }) => (
        <div style={{ textAlign: "center" }}>
          <DataTableColumnHeader column={column} title="Notes" />
        </div>
      ),

      // cell: ({ row }) => {
      //   const noteCount: number = row.getValue("noteCount") as number;
      //   const [notes, setNotes] = useState<TNote[]>([]);

      //   const fetchNotes = async () => {
      //     const response = await getNotes(
      //       row.original.wineId,
      //       row.original.vintage
      //     );
      //     setNotes(response);
      //   };

      //   return (
      //     noteCount > 0 && (
      //       <>
      //         <Dialog>
      //           <DialogTrigger>
      //             <Badge onClick={fetchNotes} variant="outline">
      //               {noteCount}
      //             </Badge>
      //           </DialogTrigger>
      //           <DialogContent className="sm:max-w-md">
      //             <DialogHeader>
      //               <DialogTitle>Notes</DialogTitle>
      //               <DialogDescription className="text-base text-primary">
      //                 {row.original.vintage} {row.original.wname}
      //               </DialogDescription>
      //             </DialogHeader>
      //             {/* <div className="flex items-center space-x-2"> */}
      //             {notes.length > 0 && (
      //               <ScrollArea className="h-96">
      //                 {notes.map((note) => (
      //                   <Card key={note.id}>
      //                     <CardContent>
      //                       <p>
      //                         {note.author} {note.rating}
      //                       </p>
      //                       {note.noteText}
      //                       {note.drinkFrom ? ` From ${note.drinkFrom}` : ""}
      //                       {note.drinkTo ? ` To ${note.drinkTo}` : ""}
      //                     </CardContent>
      //                   </Card>
      //                 ))}
      //               </ScrollArea>
      //             )}
      //             <DialogFooter className="sm:justify-start">
      //               <DialogClose asChild>
      //                 <Button type="button" size="sm" variant="secondary">
      //                   Close
      //                 </Button>
      //               </DialogClose>
      //             </DialogFooter>
      //           </DialogContent>
      //         </Dialog>
      //       </>
      //     )
      //   );
      // },
      cell: NoteCellComponent,
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bottle Id" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              {/*<DropdownMenuSubContent>
                 <DropdownMenuRadioGroup
                  value={row.original.label}
                  onValueChange={(value) => {
                    startTransition(async () => {
                      await updateTaskLabel({
                        id: row.original.id,
                        label: value as Task["label"],
                      })
                    })
                  }}
                >
                  {tasks.label.enumValues.map((label) => (
                    <DropdownMenuRadioItem
                      key={label}
                      value={label}
                      className="capitalize"
                      disabled={isPending}
                    >
                      {label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent> */}
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // onClick={() => {
            //   startTransition(() => {
            //     row.toggleSelected(false)

            //     toast.promise(
            //       deleteTask({
            //         id: row.original.id,
            //       }),
            //       {
            //         loading: "Deleting...",
            //         success: () => "Task deleted successfully.",
            //         error: (err: unknown) => catchError(err),
            //       }
            //     )
            //   })
            // }}
            >
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

export const filterableColumns: DataTableFilterableColumn<TB>[] = [
  {
    id: "country",
    title: "Country",
    options: [
      { label: "New Zealand", value: "New Zealand" },
      { label: "France", value: "France" },
      { label: "Italy", value: "Italy" },
      { label: "Spain", value: "Spain" },
      { label: "Australia", value: "Australia" },
      { label: "Germany", value: "Germany" },
      { label: "Greece", value: "Greece" },
      { label: "Portugal", value: "Portugal" },
      { label: "Argentina", value: "Argentina" },
      { label: "USA", value: "USA" },
      { label: "Chile", value: "Chile" },
      { label: "South Africa", value: "South Africa" },
      { label: "Austria", value: "Austria" },
    ],
  },
];

export const searchableColumns: DataTableSearchableColumn<TB>[] = [
  {
    id: "wname",
    title: "wine",
  },
  {
    id: "vintage",
    title: "vintage",
  },
  {
    id: "rack",
    title: "rack",
  },
  {
    id: "shelf",
    title: "shelf",
  },
];
