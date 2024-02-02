import { TBottle } from "@/types/bottle";
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface BottlesSearchContextType {
  bottlesFound: TBottle[];
  setBottlesFound: Dispatch<SetStateAction<TBottle[]>>;
  updateBottlesFoundArray: (updatedBottle: TBottle, action: Action) => void;
  bottleToEdit: TBottle | undefined;
  setBottleToEdit: Dispatch<SetStateAction<TBottle | undefined>>;
}

type Action = "E" | "A" | "D";

export const BottlesSearchContext = createContext<BottlesSearchContextType>({
  bottlesFound: [],
  setBottlesFound: () => {},
  updateBottlesFoundArray: () => {},
  bottleToEdit: undefined,
  setBottleToEdit: () => {},
});
