import React, { useContext, useState } from "react";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TBottle } from "@/types/bottle";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { NoteForm } from "./note-add-form";
import { BottleAddEditForm } from "./bottle-add-edit-form";
import { BottleConsumeForm } from "./bottle-consume-form";
import { BottleDeleteForm } from "./bottle-delete-form";

interface BottleProps {
  bottle: TBottle;
}

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

export default ActionCell;
