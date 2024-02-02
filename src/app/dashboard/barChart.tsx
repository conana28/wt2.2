import { ResponsiveBar } from "@nivo/bar";
import { set } from "date-fns";

type ChartProps = React.JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[]; // Replace any[] with the actual type of data
    setShowBottlesByVintage: (c: boolean) => void;
    setVintage: (v: number) => void;
  };

export default function GroupedbarChart({
  data,
  setShowBottlesByVintage,
  setVintage,
  ...props
}: ChartProps) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={data}
        keys={["bottleCount"]}
        indexBy="vintage"
        margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        enableLabel={false}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "paired" }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45,
          legend: "Vintage",
          legendPosition: "middle",
          legendOffset: 45,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Bottles",
          legendPosition: "middle",
          legendOffset: -45,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#FFF",
                fontSize: "10px",
              },
            },
            legend: {
              text: {
                fill: "#FFF",
                fontSize: "12px",
              },
            },
          },
          tooltip: {
            container: {
              fontSize: "12px",
              backgroundColor: "#F0F",
            },
          },
        }}
        onClick={(data) => {
          //   alert(
          //     `id ${data["id"]} value ${data["value"]} axis ${data["data"]["vintage"]}`
          //   );
          setShowBottlesByVintage(true);
          setVintage(data["data"]["vintage"]);
        }}
        role="application"
        ariaLabel="A grouped bar chart"
      />
    </div>
  );
}
