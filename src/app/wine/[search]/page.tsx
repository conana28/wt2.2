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

  // Define a callback function which will be passed to WineAddEditForm
  // as a prop. This callback will be called when the form is submitted and will be
  // passed the updated wine object. The callback updates the winesFound
  // state with the updated wine and resorts the array.
  const updateWines = (updatedWine: WineData) => {
    const wineExists = winesFound.some((wine) => wine.id === updatedWine.id);

    if (wineExists) {
      // If the wine exists, update it
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
              <DeleteWine />
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
        </div>
      </div>
    </WineContext.Provider>
  );
};

export default WineSearch;
