import React, { useContext, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bottle } from "@prisma/client";
import { WineData } from "./columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WineContext } from "@/app/contexts/WineContext";
import { Button } from "@/components/ui/button";
import { BottleMaintainForm } from "./bottle-maintain-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  // btls: Bottle[];
  // wine: WineData;
  // onUpdate: (b: any) => void; // callback function to update wines array
}

function ShowBottleTable({}: Props) {
  const [openDialog, setOpenDialog] = useState(false); // Btl mtce form Dialog open state
  const { setShowAction } = useContext(WineContext);
  const [btl, setBtl] = useState<Bottle | null>(null); // Bottle to be maintained
  const { wine } = useContext(WineContext); // Wine to be used for actions
  // Because I check for wine.bottle before calling I don't need to check for null here
  const [bottles, setBottles] = useState<Bottle[]>(wine.bottle as Bottle[]); // Bottles array to be displayed

  // Call back to update the bottles array when a bottle is updated
  function updateBottleArray(response: { success: boolean; data: Bottle }) {
    if (response.success) {
      const updatedBottle = response.data;
      setBottles((prevBottles) => {
        const index = prevBottles.findIndex(
          // Find the index of the bottle to update
          (bottle) => bottle.id === updatedBottle.id
        );
        const newBottles = [...prevBottles]; // Create a new array with the updated bottle
        newBottles[index] = updatedBottle;
        return newBottles;
      });
    }
  }

  // Callback to add a bottle to the bottles array
  function addBottleToBottlesArray(response: {
    success: boolean;
    data: Bottle;
  }) {
    if (response.success) {
      const newBottle = response.data;
      setBottles((prevBottles) => {
        // Create a new array with the updated bottle
        const newBottles = [...prevBottles, newBottle];
        return newBottles;
      });
    }
  }
  // Callback to delete a bottle from the bottles array
  function deleteBottleFromBottlesArray(response: { success: boolean }) {
    console.log("Delete Response:", response);

    if (response.success) {
      setBottles((prevBottles) => {
        // Create a new array with the deleteed bottle
        const newBottles = prevBottles.filter(
          (bottle) => bottle.id !== btl!.id
        );
        console.log("New bottles:", newBottles);
        return newBottles;
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bottles</CardTitle>
          <CardDescription>
            {wine.producer} {wine.wineName}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Vintage</TableHead>
                <TableHead>Rack</TableHead>
                <TableHead>Shelf</TableHead>
                <TableHead>Id</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bottles.map((bottle) => (
                <TableRow
                  key={bottle.id}
                  onClick={() => {
                    setBtl(bottle); // Set the bottle to be maintained
                    setOpenDialog(true); // Open the dialog
                  }}
                >
                  <TableCell className="font-medium">
                    {bottle.vintage}
                  </TableCell>
                  <TableCell>{bottle.rack}</TableCell>
                  <TableCell>{bottle.shelf}</TableCell>
                  <TableCell>{bottle.id}</TableCell>
                  <TableCell className="text-right">
                    {bottle.cost ? (bottle.cost / 100).toFixed(2) : "n/a"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter>
          <div className="flex items-center justify-end w-full">
            <Button
              size="xs"
              variant="secondary"
              onClick={() => setShowAction("")}
            >
              Return
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-11/12 sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Maintain bottle id: {btl?.id}{" "}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="text-sm">
              {wine.producer} {wine.wineName}{" "}
            </p>
          </DialogDescription>

          <div className="flex items-center space-x-2">
            <BottleMaintainForm
              bottle={btl}
              updateBottleArray={updateBottleArray}
              addBottleToBottlesArray={addBottleToBottlesArray}
              deleteBottleFromBottlesArray={deleteBottleFromBottlesArray}
              setOpenDialog={setOpenDialog}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShowBottleTable;
