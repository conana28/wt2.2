// used to display bottles in the cellar
export type TBottle = {
  id: number;
  vintage: number;
  rack: string;
  shelf: string | null;
  cost: number | null;
  consume: Date | null;
  occasion: string | null;
  noteCount: number;
  wineId: number;
  wine: {
    producer: string;
    wineName: string;
    country: string;
  };
};

export type TCBottle = {
  id: number;
  vintage: number;
  rack: string;
  shelf: string | null;
  cost: number | null;
  consume: Date | null;
  occasion: string | null;
  wineId: number;
  wine: {
    producer: string;
    wineName: string;
    country: string;
  };
};
