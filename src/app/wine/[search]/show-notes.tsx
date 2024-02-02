import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { WineContext } from "@/app/contexts/WineContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NotesCard = () => {
  const { wine, setShowAction } = useContext(WineContext);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wine Notes</CardTitle>
        <CardDescription>
          {wine.producer} {wine.wineName}{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {wine.notes === null ? (
          <div className="text-primary text-xl">
            There are no notes for this wine
          </div>
        ) : (
          <div>{wine.notes}</div>
        )}
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
  );
};

export default NotesCard;
