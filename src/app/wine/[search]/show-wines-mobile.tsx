"use client";

import { useContext, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WineData, columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WineContext } from "@/app/contexts/WineContext";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type Props = {
  wines: WineData[]; // Wines to display
};

export default function ShowWinesMobile({ wines }: Props) {
  // Calculate the height based on the number of wine records
  const height = Math.min(wines.length * 5, 660) + 40;
  const { showAction, setShowAction, setWine } = useContext(WineContext);

  return (
    wines.length > 0 && (
      <Card className="mt-2 bg-stone-800">
        <CardContent className=" -ml-4">
          <ScrollArea className="h-72">
            {wines.map((wine) => (
              <div key={wine.id}>
                <div className="flex flex-row justify-between ">
                  <div className="text-lg">
                    {wine.producer} {wine.wineName}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={showAction !== ""}>
                      <Button
                        variant="ghost"
                        className="float-right mr-2 h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("N");
                          setWine(wine);
                        }}
                        disabled={wine.notes === "" || wine.notes === null}
                      >
                        Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("E");
                          setWine(wine);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("A");
                          setWine(wine);
                        }}
                      >
                        Add Like
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("D");
                          setWine(wine);
                        }}
                        disabled={wine.bottle.length > 0}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("S");
                          setWine(wine);
                        }}
                        disabled={wine.bottle.length === 0}
                      >
                        Show bottles
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setShowAction("B");
                          setWine(wine);
                        }}
                      >
                        Add bottle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </ScrollArea>
          {/* ) : (
          <DataTable columns={columns} data={wines} />
        )} */}
        </CardContent>
      </Card>
    )
  );
}
