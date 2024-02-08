"use client";

import { getConsumedBottles } from "@/actions/bottle";
import { getConsumedBottlesPage } from "@/actions/consume";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TCBottle } from "@/types/bottle";
import { format } from "date-fns";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function ConsumeMobile({ params }: { params: { page: string } }) {
  const pageNumber = parseInt(params.page, 10);
  const [consumedBottles, setConsumedBottles] = useState<TCBottle[]>([]);
  const [loading, setLoading] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  // Get consumed bottles in the cellar

  useEffect(() => {
    async function fetchConsumedBottlesPage(pageNumber: number) {
      setLoading(true);
      const response = await getConsumedBottlesPage(pageNumber);

      setLoading(false);
      setConsumedBottles(response.consumedBottles);
      setTotalPages(response.count);
    }

    fetchConsumedBottlesPage(pageNumber);
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
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="1">
                    <ChevronsLeft />
                  </PaginationLink>
                </PaginationItem>{" "}
                <PaginationItem>
                  <PaginationPrevious
                    href={`${(pageNumber - 1).toString()}`}
                    aria-disabled={pageNumber <= 1}
                    tabIndex={pageNumber <= 1 ? -1 : undefined}
                    className={
                      pageNumber <= 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                <span className="text-sm ">
                  {pageNumber} of {totalPages}
                </span>
                <PaginationItem>
                  <PaginationNext
                    href={`${(pageNumber + 1).toString()}`}
                    aria-disabled={pageNumber >= totalPages}
                    tabIndex={pageNumber >= totalPages ? -1 : undefined}
                    className={
                      pageNumber >= totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href={`${totalPages.toString()}`}>
                    <ChevronsRight />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ConsumeMobile;
