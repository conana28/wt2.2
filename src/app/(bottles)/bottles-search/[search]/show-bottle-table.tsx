import React from "react";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TBottle } from "@/types/bottle";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";

// Define a type for the props
// export type ShowBottleTableProps = {
//   bottlesFound: TBottle[];
// };

// Use the props type in the component
export const ShowBottleTable = () => {
  const { bottlesFound } = React.useContext(BottlesSearchContext);
  return (
    <div className="-mt-4">
      {/* {bottlesFound.length > 0 && ( */}
      <DataTable columns={columns} data={bottlesFound} />

      {/* )} */}
    </div>
  );
};
