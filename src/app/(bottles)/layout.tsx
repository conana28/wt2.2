"use client";

import { TBottle } from "@/types/bottle";
import React from "react";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";

type Action = "E" | "A" | "D";

const BottleLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="container mt-2">
      <BottlesSearchContext.Provider
        value={{
          bottlesFound,
          setBottlesFound,
          updateBottlesFoundArray,
          bottleToEdit,
          setBottleToEdit,
        }}
      >
        {children}
      </BottlesSearchContext.Provider>
    </div>
  );
};

export default BottleLayout;
