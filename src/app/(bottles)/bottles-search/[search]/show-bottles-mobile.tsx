import React, { useContext, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { BottleMaintainForm } from "./bottle-maintain-form";

export default function ShowBottlesMobile() {
  const [openDialog, setOpenDialog] = useState(false); // Btl mtce form Dialog open state
  const { bottlesFound, bottleToEdit, setBottleToEdit } =
    useContext(BottlesSearchContext);
  return (
    bottlesFound.length > 0 && (
      <Card className="mt-2 bg-stone-800">
        <ScrollArea className="h-72">
          <CardContent className="-ml-4">
            {bottlesFound.map((btl) => (
              <div key={btl.id}>
                <div className="flex flex-row justify-between ">
                  <div
                    className="text-lg"
                    onClick={() => {
                      setBottleToEdit(btl);
                      setOpenDialog(true);
                    }}
                  >
                    {btl.vintage} {btl.wine.producer} {btl.wine.wineName}
                    {" - "}
                    {btl.rack}
                    {btl.shelf ? `/${btl.shelf}` : ""}{" "}
                  </div>
                  {/* <div onClick={() => console.log("Clicked")}>...</div> */}
                  {/* <Button
                    variant="icon"
                    onClick={() => {
                      setBottleToEdit(btl);
                      setOpenDialog(true);
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button> */}
                </div>
                <Separator className="my-0.5" />
              </div>
            ))}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="w-11/12 sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle>Bottle maintenance</DialogTitle>
                  <DialogDescription>
                    {bottleToEdit
                      ? `${bottleToEdit.vintage} ${bottleToEdit.wine.producer} ${bottleToEdit.wine.wineName}`
                      : ""}
                  </DialogDescription>
                </DialogHeader>
                <BottleMaintainForm setOpenDialog={setOpenDialog} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </ScrollArea>
      </Card>
    )
  );
}
