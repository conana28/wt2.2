"use client";

import React, { useEffect, useRef, useState } from "react";

import { getConsumedBottles } from "@/actions/bottle";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { TCBottle } from "@/types/bottle";

const ConsumeTable = () => {
  const [consumedBottles, setConsumedBottles] = useState<TCBottle[]>([]);
  const [loading, setLoading] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get consumed bottles in the cellar
  useEffect(() => {
    async function fetchConsumedBottles() {
      const response = await getConsumedBottles();
      setConsumedBottles(response);
    }

    fetchConsumedBottles();
  }, []);

  useEffect(() => {
    if (loading) {
      setSecondsElapsed(0);
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((seconds) => seconds + 1);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [loading]);
  return (
    <div>
      <div>
        {loading && (
          <div className="text-center text-primary text-xl">
            Loading...{secondsElapsed}
          </div>
        )}
        {consumedBottles.length > 0 && (
          <DataTable columns={columns} data={consumedBottles} />
        )}
      </div>
    </div>
  );
};

export default ConsumeTable;
