"use client";

import React, { useContext, useEffect, useState } from "react";

import { WineContext } from "@/app/contexts/WineContext";
import { Button } from "@/components/ui/button";
import { deleteWine } from "@/actions/wine";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkBottleExists } from "@/actions/bottle";

interface DeleteFormProps {
  onUpdate: (id: number) => void;
}

const DeleteWineCard = ({ onUpdate }: DeleteFormProps) => {
  const { wine, setShowAction } = useContext(WineContext);
  // Check if there are any bottles with this wine id
  // If there are, don't allow the wine to be deleted
  const [exists, setExists] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);

  useEffect(() => {
    const checkExists = async () => {
      const result = await checkBottleExists(wine.id);
      setExists(result);
      setCheckCompleted(true);
    };

    checkExists();
  }, [wine.id]);

  const handleDelete = async () => {
    console.log("Delete: ", wine.id);
    const result = await deleteWine(wine.id);
    if (!result) {
      alert("Something went wrong with wine delete");
      return;
    }
    onUpdate(wine.id);
    if (result.error) {
      // set local error state
      alert(result.error);
      return;
    }
    setShowAction("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Wine</CardTitle>
        <CardDescription>
          {wine.producer} {wine.wineName} ({wine.id})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!checkCompleted && (
          <div className="text-base">Checking for bottles...</div>
        )}
        {checkCompleted && (
          <div className="text-red-500 text-xl">
            {exists
              ? "Delete not allowed Consumed bottles exist"
              : " Are you sure you want to delete this wine?"}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-end space-x-4 w-full">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => setShowAction("")}
          >
            Cancel
          </Button>
          {!exists && (
            <Button size="xs" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeleteWineCard;
