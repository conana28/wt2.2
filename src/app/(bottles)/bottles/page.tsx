"use client";

import { getBottlesInCellar, getConsumedBottles } from "@/actions/bottle";
import React, { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TBottle } from "@/types/bottle";

const BottleTable = () => {
  const [bottles, setBottles] = useState<TBottle[]>([]);
  const [loading, setLoading] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get bottles in the cellar
  useEffect(() => {
    async function fetchBottles() {
      setLoading(true);
      const response = await getBottlesInCellar();
      console.log(response);
      setBottles(response.bottlesWithNoteCount);
      setLoading(false);
    }

    fetchBottles();
  }, []);

  useEffect(() => {
    if (loading) {
      setSecondsElapsed(0);
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((seconds) => seconds + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [loading]);
  return (
    <div>
      {loading && (
        <div className="text-center text-primary text-xl">
          Loading...{secondsElapsed}
        </div>
      )}
      {bottles.length > 0 && <DataTable columns={columns} data={bottles} />}
    </div>
  );
};

export default BottleTable;
