"use client";

import React, { use, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import {
  getBottleCountByVintage,
  getBottlesByCountry,
  getBottlesByVintage,
  getBottleCount,
  getUniqueBottleCount,
  getConsumeBottleCount,
} from "@/actions/bottle";
import PieChart from "./pieChart";
import GroupedbarChart from "./barChart";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWineCount } from "@/actions/wine";

type BottleCount = {
  vintage: number;
  _count: {
    vintage: number;
  };
};

interface countryCount {
  id: string;
  value: number;
}

type vintageCount = {
  vintage: string;
  bottleCount: number;
};

type bottlesByVintage = {
  id: number;
  vintage: number;
  rack: string;
  shelf: string | null;
  cost: number | null;
  wine: {
    producer: string;
    wineName: string;
    country: string;
  };
};

const Dashboard = () => {
  const [country, setCountry] = React.useState<string>("All");
  const [vintageData, setVintageData] = React.useState<vintageCount[]>([]);
  const [countryData, setCountryData] = React.useState<countryCount[]>([]);
  const [showBottlesByVintage, setShowBottlesByVintage] = React.useState(false);
  const [bottleCount, setBottleCount] = React.useState<number>(0); // store vintage selected in bar chart
  const [uniqueBottleCount, setUniqueBottleCount] = React.useState<number>(0); // store vintage selected in bar chart
  const [totalWines, setTotalWines] = React.useState<number>(0); // store vintage selected in bar chart
  const [consumeBottleCount, setConsumeBottleCount] = React.useState<number>(0); // store vintage selected in bar chart
  const [vintage, setVintage] = React.useState<number>(0); // store vintage selected in bar chart
  const [bottlesByVintage, setBottlesByVintage] = React.useState<
    bottlesByVintage[]
  >([]);

  // Get Data for pie chart
  useEffect(() => {
    async function fetchCountryData() {
      const response = await getBottlesByCountry();
      const newArray: countryCount[] = [];
      // Use reduce to create a new array, grouping by country and counting bottles
      newArray.push(
        ...response.reduce((acc: { id: string; value: number }[], item) => {
          const existingId = acc.find(({ id }) => id === item.wine.country);
          if (existingId) {
            existingId.value++;
          } else {
            acc.push({ id: item.wine.country, value: 1 });
          }
          return acc;
        }, [] as { id: string; value: number }[])
      );
      // Counries to keep in the graph
      const countries = [
        "Italy",
        "Spain",
        "France",
        "New Zealand",
        "Australia",
        "Germany",
      ];
      let count = 0;
      // Count all the bottles not in the countries array
      newArray.forEach((item) => {
        if (!countries.includes(item.id)) {
          count += item.value;
        }
      });
      // Remove small countries
      const filteredArray = newArray.filter((item) =>
        countries.includes(item.id)
      );
      // add all the values of the small countries to the Other category
      filteredArray.push({ id: "Other", value: count });
      // Change the id of the New Zealand category to NZ
      filteredArray.forEach((item) => {
        if (item.id === "New Zealand") {
          item.id = "NZ";
        }
      });
      // Sort the array by value
      filteredArray.sort((a, b) => b.value - a.value);
      console.log(filteredArray);
      setCountryData(filteredArray);
    }

    fetchCountryData();
  }, []);

  // Get Data for bar chart
  useEffect(() => {
    async function fetchVintageCountData() {
      const response = await getBottleCountByVintage(country, 0);
      const result: BottleCount[] = response.bottleCountByVintage;
      // Create array in format for graph
      let count = 0;
      const newArray: vintageCount[] = result
        .filter((item) => {
          if (item.vintage < 2000) {
            count++;
            return false;
          }
          return true;
        })
        .map((item) => ({
          vintage: item.vintage.toString(),
          bottleCount: item._count.vintage,
        }));
      newArray.unshift({ vintage: "Pre2k", bottleCount: count });
      // Check if vintage is 9999 and replace with n/v
      newArray.forEach((item) => {
        if (item.vintage === "9999") {
          item.vintage = "n/v";
        }
      });
      setVintageData(newArray);
    }

    fetchVintageCountData();
  }, [country]);

  // Get List bottles by vintage
  useEffect(() => {
    async function fetchBottlesByVintageData() {
      const response = await getBottlesByVintage(country, vintage);
      setBottlesByVintage(response);
      console.log(response);
    }

    if (vintage > 0) fetchBottlesByVintageData();
  }, [vintage, country]);

  // Get how many bottles in the cellar
  useEffect(() => {
    async function fetchBottleCount() {
      const response = await getBottleCount();
      setBottleCount(response);
    }
    async function fetchUniqueBottleCount() {
      const response = await getUniqueBottleCount();
      setUniqueBottleCount(response);
    }
    async function fetchConsumeBottleCount() {
      const response = await getConsumeBottleCount();
      setConsumeBottleCount(response);
    }
    async function fetchWineCount() {
      const response = await getWineCount();
      console.log(response);
      setTotalWines(response);
    }
    fetchBottleCount();
    fetchUniqueBottleCount();
    fetchWineCount();
    fetchConsumeBottleCount();
  }, []);

  return (
    <div className="container">
      {/* {bottles.length === 0 && <div>Loading...</div>} */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card className="bg-slate-400">
          <CardDescription className="text-center text-slate-50">
            Total bottles
          </CardDescription>
          <p className="text-center pb-1">{bottleCount}</p>
        </Card>
        <Card className="bg-slate-600">
          <CardDescription className="text-center text-slate-50">
            Wines with Bottles
          </CardDescription>
          <p className="text-center pb-1">{uniqueBottleCount}</p>
        </Card>
        <Card className="bg-slate-500">
          {" "}
          <CardDescription className="text-center text-slate-50">
            Consumed
          </CardDescription>
          <p className="text-center pb-1">{consumeBottleCount}</p>
        </Card>
        <Card className="bg-slate-700">
          {" "}
          <CardDescription className="text-center text-slate-50">
            Total Wines
          </CardDescription>
          <p className="text-center pb-1">{totalWines}</p>{" "}
        </Card>
      </div>
      <div className="flex flex-col  sm:flex-row gap-2 mt-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Bottles by country</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              className="w-full aspect-[4/3]"
              data={countryData}
              setCountry={setCountry}
            />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Bottles by Vintage - {country}</div>
                {country !== "All" && (
                  <Button size="xs" onClick={() => setCountry("All")}>
                    All
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vintageData.length > 0 && (
              <GroupedbarChart
                className="w-full aspect-[4/3]"
                data={vintageData}
                setShowBottlesByVintage={setShowBottlesByVintage}
                setVintage={setVintage}
              />
            )}
          </CardContent>
        </Card>
      </div>
      {/* Show bottles by vintage */}
      {bottlesByVintage.length > 0 && (
        <Dialog
          open={showBottlesByVintage}
          onOpenChange={setShowBottlesByVintage}
        >
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <span className="text-primary">
                  {bottlesByVintage.length} Bottles from{" "}
                  {country === "All" ? "All countries" : country}
                  {" for "}
                  {vintage}
                </span>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 rounded-md border mt-4">
              <div className="p-4 text-sm">
                <ul className="space-y-4 overflow-auto">
                  {bottlesByVintage.map((item) => (
                    <li key={item.id} className="flex items-center">
                      {item.wine.producer} {item.wine.wineName} [{item.rack}
                      {item.shelf && item.shelf.length > 0 ? "/" : ""}
                      {item.shelf} ]
                      {item.cost && item.cost > 0 ? (
                        <>
                          <span>&nbsp;</span>
                          <span className="text-primary">${item.cost}</span>
                        </>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
