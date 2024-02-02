import { ResponsivePie } from "@nivo/pie";

type ChartProps = React.JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[]; // Replace any[] with the actual type of data
    setCountry: (c: string) => void;
  };

export default function PieChart({ data, setCountry, ...props }: ChartProps) {
  return (
    <div {...props}>
      <ResponsivePie
        data={data}
        sortByValue
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        cornerRadius={0}
        activeOuterRadiusOffset={2}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLabel="id"
        arcLabelsRadiusOffset={0.6}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        enableArcLinkLabels={false}
        colors={{ scheme: "paired" }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 50,
            itemHeight: 18,
            itemTextColor: "#FFF",
            itemDirection: "top-to-bottom",
            symbolSize: 14,
            symbolShape: "circle",
          },
        ]}
        theme={{
          tooltip: {
            container: {
              fontSize: "12px",
              color: "#000",
            },
          },
        }}
        onClick={(data) => {
          console.log(`id ${data["id"]} value ${data["value"]}`);
          setCountry(
            data["id"].toString() === "NZ"
              ? "New Zealand"
              : data["id"].toString()
          );
        }}
        role="application"
      />
    </div>
  );
}
