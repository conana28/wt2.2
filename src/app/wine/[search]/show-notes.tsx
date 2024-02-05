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
import { Scroll } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        {wine.notes!.length > 150 ? (
          <ScrollArea className="h-52 w-full">{wine.notes}</ScrollArea>
        ) : (
          <div className="w-full">{wine.notes}</div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-end w-full">
          <Button
            size="sm"
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
