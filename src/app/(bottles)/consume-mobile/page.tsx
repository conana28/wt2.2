"use client";

import { getConsumedBottles } from "@/actions/bottle";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TCBottle } from "@/types/bottle";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

function ConsumeMobile() {
  const [consumedBottles, setConsumedBottles] = useState<TCBottle[]>([]);
  const [loading, setLoading] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get consumed bottles in the cellar

  useEffect(() => {
    async function fetchConsumedBottles() {
      setLoading(true);
      const response = await getConsumedBottles();
      setLoading(false);
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
      {loading && (
        <div className="text-primary text-xl">Loading...{secondsElapsed}</div>
      )}
      {consumedBottles.length > 0 && (
        <Card>
          <CardTitle className="text-primary text-xl">
            Consumed bottles
          </CardTitle>
          <CardContent>
            <ScrollArea className="h-72">
              {consumedBottles.map((bottle) => (
                <div key={bottle.id}>
                  <p>
                    {bottle.vintage} {bottle.wine.producer}{" "}
                    {bottle.wine.wineName} {bottle.rack} {bottle.shelf}{" "}
                    {format(bottle.consume!, "dd/MM/yyyy")}
                  </p>
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ConsumeMobile;
