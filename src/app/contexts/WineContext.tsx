import { Dispatch, SetStateAction, createContext } from "react";
import { WineData } from "@/app/wine/[search]/columns";

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

// type TFOContext = {
interface TFOContext {
  showAction: string;
  setShowAction: Dispatch<SetStateAction<string>>;
  wine: WineData;
  setWine: Dispatch<SetStateAction<WineData>>;
  winesFound: WineData[];
  setWinesFound: Dispatch<SetStateAction<WineData[]>>;
}

export const WineContext = createContext<TFOContext>({
  showAction: "",
  setShowAction: () => "",
  wine: wineEmpty,
  setWine: () => {},
  winesFound: [],
  setWinesFound: () => {},
});
