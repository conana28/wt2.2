"use client";

import React, { createContext, useEffect, useState } from "react";

import { WineSearchForm } from "./wine-search-form"; //Col 1 - Search Wines Form
// Col 2
import ShowTable1 from "./show-table1"; // Show wines matching search criteria
import { WineData } from "./columns";
// Col 3 - From Action Menu
import WineAddEditForm from "./wine-add-edit-form"; //Add/Edit Wine Form
// import ShowBottles from "./show-bottles"; // Show bottles for a wine
import ShowNotes from "./show-notes"; // Show notes for a wine
import DeleteWine from "./delete-wine";
import { BottleAddForm } from "./bottle-add-form";
import { Bottle } from "@prisma/client";
import ShowBottleTable from "./show-bottle-table";

import { WineContext } from "../../contexts/WineContext";
import ShowWinesMobile from "./show-wines-mobile";
import { DialogContent } from "@radix-ui/react-dialog";
import { Dialog } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { Separator } from "@/components/ui/separator";

const wineEmpty: WineData = {
  id: 0,
  producer: "",
  wineName: "",
  country: "",
  region: "",
  subRegion: "",
  type: "",
  notes: "",
  bottle: [],
};

const WineSearch = ({ params }: { params: { search: string } }) => {
  console.log("Wine params.search = ", params.search);
  const [winesFound, setWinesFound] = React.useState<WineData[]>([]);
  const [showAction, setShowAction] = useState("");
  const [wine, setWine] = useState<WineData>(wineEmpty);
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenChange = (newOpenState: any) => {
    // Update the open state of the drawer
    setOpenDrawer(newOpenState);
    // Perform additional actions
    if (!openDrawer) setShowAction(""); // Reset showAction when drawer is closed
  };
  useEffect(() => {
    if (showAction !== "") {
      setOpenDrawer(true);
    } else {
      setOpenDrawer(false);
    }
  }, [showAction]);

  // Define a callback function which will be passed to WineAddEditForm
  // as a prop. This callback will be called when the form is submitted and will be
  // passed the updated wine object. The callback updates the winesFound
  // state with the updated wine and resorts the array.
  const updateWines = (updatedWine: WineData) => {
    const wineExists = winesFound.some((wine) => wine.id === updatedWine.id);

    if (wineExists) {
      // If the wine exists, update it
      console.log("editing wine", updatedWine);
      setWinesFound(
        winesFound
          .map((wine) => (wine.id === updatedWine.id ? updatedWine : wine))
          .sort((a, b) => {
            // Sort by producer
            const producerComparison = a.producer.localeCompare(b.producer);
            if (producerComparison !== 0) return producerComparison;

            // If producers are the same, sort by wineName
            return a.wineName.localeCompare(b.wineName);
          })
      );
    } else {
      // If the wine doesn't exist, add it
      console.log("adding wine", updatedWine);
      setWinesFound(
        [...winesFound, updatedWine].sort((a, b) => {
          // Sort by producer
          const producerComparison = a.producer.localeCompare(b.producer);
          if (producerComparison !== 0) return producerComparison;

          // If producers are the same, sort by wineName
          return a.wineName.localeCompare(b.wineName);
        })
      );
    }
  };

  const deleteWine = (id: number) => {
    console.log("Delete Wine", id);
    setWinesFound(winesFound.filter((wine) => wine.id !== id));
  };

  // Define a callback function which will be passed to BottleAddForm
  // as a prop. This callback will be called when the form is submitted and will be
  // passed the updated bottle objects. The callback updates the winesFound.bottle
  // state with the updated bottles
  const updateBottles = (updatedBottles: Bottle[]) => {
    console.log("Update Bottles", updatedBottles);
    // Create a copy of winesFound to avoid mutating state directly
    let updatedWinesFound = [...winesFound];

    updatedBottles.forEach((updatedBottle) => {
      // Find the matching wine in updatedWinesFound
      const wineFound = updatedWinesFound.find(
        (wine) => wine.id === updatedBottle.wineId
      );

      if (wineFound) {
        // Add this bottle to the wineFound.bottle array
        wineFound.bottle.push(updatedBottle);
      }
    });

    // Update winesFound
    setWinesFound(updatedWinesFound);
  };

  return (
    <WineContext.Provider
      value={{
        showAction,
        setShowAction,
        wine,
        setWine,
        winesFound,
        setWinesFound,
      }}
    >
      <div>
        {/* Desktop View */}
        <div className="hidden sm:flex flex-1 space-x-2">
          {/* Col 1 - Search Wines Form */}
          <div className={`w-2/12 ${showAction !== "" ? "opacity-50" : ""}`}>
            {/* <WineSearchForm setWinesFound={setWinesFound} searchTerm="" /> */}

            <WineSearchForm
              searchTerm={params.search === "*" ? "" : params.search}
            />

            {winesFound.length > 0 && (
              <p className="text-xs ml-4 mt-2">
                {winesFound.length} Matching wines
              </p>
            )}
          </div>
          {/* Col -2 Show Matching Wines */}
          <div className={`w-7/12 ${showAction !== "" ? "opacity-50" : ""}`}>
            <ShowTable1 wines={winesFound} />
          </div>
          {/* Col - 3 Actions */}
          {/* Add Like */}
          {showAction === "A" && (
            <div className="w-3/12">
              <WineAddEditForm
                wineForm={{ ...wine, id: 0, bottle: [] }}
                onUpdate={updateWines}
              />
            </div>
          )}
          {/* Edit Wine */}
          {showAction === "E" && (
            <div className="w-3/12">
              <WineAddEditForm wineForm={wine} onUpdate={updateWines} />
            </div>
          )}
          {/* Delete Wine */}
          {showAction === "D" && (
            <div className="w-3/12">
              <DeleteWine onUpdate={deleteWine} />
            </div>
          )}
          {/* Show Notes */}
          {showAction === "N" && (
            <div className="w-3/12">
              <ShowNotes />
            </div>
          )}
          {/* Show Bottles */}
          {showAction === "S" && (
            <div className="w-3/12">
              {/* <ShowBottleTable
                btls={wine.bottle || []}
                updateBottleArray={updateBottleArray}
              /> */}
              <ShowBottleTable
              // {/* btls={Array.isArray(wine.bottle) ? wine.bottle.flat() : []} */}
              // wine={wine}
              />
            </div>
          )}
          {/* Add Bottle(s) */}
          {showAction === "B" && (
            <div className="w-3/12">
              <BottleAddForm id={wine.id} onUpdate={updateBottles} />
            </div>
          )}
        </div>

        {/* Mobile View */}
        {/*  Search Wines Form */}
        <div className={`sm:hidden ${showAction !== "" ? "opacity-50" : ""}`}>
          <WineSearchForm
            searchTerm={params.search === "*" ? "" : params.search}
          />

          {winesFound.length > 0 && (
            <p className="text-xs ml-4 mt-2">
              {winesFound.length} Matching wines
            </p>
          )}
          {/* Show wines */}
          <div className={`${showAction !== "" ? "opacity-50" : ""}`}>
            <ShowWinesMobile wines={winesFound} />
          </div>
          {/* Show Dialog */}

          {/* Edit Wine */}
          <>
            {/* <Drawer open={openDrawer} onOpenChange={setOpenDrawer}> */}
            <Drawer open={openDrawer} onOpenChange={handleOpenChange}>
              {/* <DrawerTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DrawerTrigger> */}
              <DrawerContent className="w-11/12 mx-4 bd-stone-950">
                <DrawerHeader className="text-left">
                  <DrawerTitle>
                    Wine Maintenance
                    {showAction === "E" && ` - Edit`}
                    {showAction === "A" && ` - Add Like`}
                    {showAction === "N" && ` - Show wine notes`}
                    {showAction === "S" && ` - Show Bottle(s)`}
                    {showAction === "B" && ` - Add Bottle(s)`}
                    <Separator className="mt-2" />
                  </DrawerTitle>
                  {/* <DrawerDescription>.</DrawerDescription> */}
                </DrawerHeader>
                {showAction === "E" && (
                  <div className="px-4">
                    <WineAddEditForm wineForm={wine} onUpdate={updateWines} />
                  </div>
                )}
                {showAction === "A" && (
                  <div className="px-4">
                    <WineAddEditForm
                      wineForm={{ ...wine, id: 0, bottle: [] }}
                      onUpdate={updateWines}
                    />
                  </div>
                )}
                {/* Show Bottles */}
                {showAction === "S" && (
                  <div className="px-4">
                    <ShowBottleTable />
                  </div>
                )}
                {showAction === "N" && (
                  <div className="px-4">
                    <ShowNotes />
                  </div>
                )}
                {showAction === "D" && (
                  <div className="px-4">
                    <DeleteWine onUpdate={deleteWine} />
                  </div>
                )}{" "}
                {/* Add Bottle(s) */}
                {showAction === "B" && (
                  <div className="px-4 bg-stone-900 ">
                    <BottleAddForm id={wine.id} onUpdate={updateBottles} />
                  </div>
                )}
                {/* <ProfileForm className="px-4" /> */}
                <DrawerFooter className="pb-4">
                  {/* <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose> */}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        </div>
      </div>
    </WineContext.Provider>
  );
};

export default WineSearch;
