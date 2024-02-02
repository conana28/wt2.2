import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WineData, columns } from "./columns";

type Props = {
  wines: WineData[]; // Wines to display
};

export default function ShowTable1({ wines }: Props) {
  // Calculate the height based on the number of wine records
  const height = Math.min(wines.length * 60, 660) + 40;

  return (
    <>
      {wines.length > 6 ? (
        <ScrollArea
          style={{ height: `${height}px` }}
          className="rounded-md border max-h-[400px] 2xl:max-h-[700px]"
        >
          <DataTable columns={columns} data={wines} />
        </ScrollArea>
      ) : (
        <DataTable columns={columns} data={wines} />
      )}
    </>
  );
}
