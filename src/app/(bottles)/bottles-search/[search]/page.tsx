"use client";

import React, { createContext } from "react";

import { CellarSearchForm } from "./cellar-search-form";
import { ShowBottleTable } from "./show-bottle-table";
import { TBottle } from "@/types/bottle";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";

type Action = "E" | "A" | "D";

const BottlesSearch = ({ params }: { params: { search: string } }) => {
  console.log("Cellar params.search = ", params.search);
  const [bottlesFound, setBottlesFound] = React.useState<TBottle[]>([]);
  const [bottleToEdit, setBottleToEdit] = React.useState<TBottle | undefined>();

  const updateBottlesFoundArray = (updatedBottle: TBottle, action: Action) => {
    console.log(action, updatedBottle);
    const bottleExists = bottlesFound.some(
      (btl) => btl.id === updatedBottle.id
    );
    console.log(bottleExists);
    if (bottleExists) {
      if (action === "E") {
        setBottlesFound(
          bottlesFound.map((btl) =>
            btl.id === updatedBottle.id ? updatedBottle : btl
          )
        );
      }
      if (action === "D") {
        setBottlesFound(
          bottlesFound.filter((btl) => btl.id !== updatedBottle.id)
        );
      }
    }
    // Add a new bottle to Array
    if (action === "A") {
      const updatedBottles = [...bottlesFound, updatedBottle];
      updatedBottles.sort((a, b) => {
        // Sort by producer
        const producerComparison = a.wine.producer.localeCompare(
          b.wine.producer
        );
        if (producerComparison !== 0) return producerComparison;

        // If producers are the same, sort by wineName
        const wineNameComparison = a.wine.wineName.localeCompare(
          b.wine.wineName
        );
        if (wineNameComparison !== 0) return wineNameComparison;

        // If wineNames are the same, sort by vintage
        return a.vintage - b.vintage;
      });

      setBottlesFound(updatedBottles);
    }
  };

  return (
    <BottlesSearchContext.Provider
      value={{
        bottlesFound,
        setBottlesFound,
        updateBottlesFoundArray,
        bottleToEdit,
        setBottleToEdit,
      }}
    >
      <div>
        {/* Desktop View */}
        <div className="hidden sm:flex flex-1 space-x-4">
          <div className="w-1/5">
            <CellarSearchForm
              searchTerm={params.search === "*" ? "" : params.search}
            />
          </div>

          <div className="w-4/5">
            <ShowBottleTable />
          </div>
        </div>
        {/* Mobile View */}
        <div className="w-full md:hidden">
          <div></div>
          {bottlesFound.length > 0 && (
            <div>{/* <ShowBottleMobile bottlesFound={bottlesFound} /> */}</div>
          )}
        </div>
      </div>
    </BottlesSearchContext.Provider>
  );
};

export default BottlesSearch;
