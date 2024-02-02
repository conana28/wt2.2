"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BottleSearchSchema, WineSearchSchema } from "@/lib/schema";
import { searchBottles1 } from "@/actions/bottle";
import { Card } from "@/components/ui/card";
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchWines, searchWines1 } from "@/actions/wine";
import { WineContext } from "@/app/contexts/WineContext";
import { on } from "events";

// pass a prop to the form to set the bottlesFound state in the parent component
// type Props = {
//   setWinesFound: React.Dispatch<React.SetStateAction<any[]>>;
//   searchTerm?: string;
// };

type Props = {
  // winesFound: any[];
  // onWinesFoundChange: (newWinesFound: any[]) => void;
  searchTerm?: string;
};

// export function WineSearchForm({ setWinesFound, searchTerm }: Props) {
export function WineSearchForm({
  // winesFound,
  // onWinesFoundChange,
  searchTerm,
}: Props) {
  // ... existing code ...
  const router = useRouter();
  const { setShowAction, winesFound, setWinesFound } = useContext(WineContext);
  const [loading, setLoading] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  let formDefaultValues = {
    search: searchTerm ? searchTerm : "",
    country: "",
    region: "",
    subRegion: "", // this is a string but the schema expects a number
  };

  useEffect(() => {
    if (searchTerm) {
      // formDefaultValues.search = searchTerm;
      onSubmit({ search: searchTerm });
    }
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

  // 1. Define form.
  const form = useForm<z.infer<typeof WineSearchSchema>>({
    resolver: zodResolver(WineSearchSchema),
    defaultValues: formDefaultValues,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof WineSearchSchema>) {
    // form.reset();
    console.log(values);
    setLoading(true);
    const result = await searchWines1(values);
    if (!result?.wines) {
      console.error("Search wines went wrong");
      return;
    }
    console.log(result);
    // setWinesFound(result?.wines);
    // When you want to update winesFound, call onWinesFoundChange instead of setWinesFound
    setWinesFound(result?.wines);
    setLoading(false);
  }

  function cancel() {
    // Reset the default values
    formDefaultValues = {
      search: "",
      country: "",
      region: "",
      subRegion: "",
    };
    // Reset the form with the new default values
    form.reset(formDefaultValues);
    setWinesFound([]);
    // onWinesFoundChange([]);
    setShowAction("");
    setLoading(false);
    setSecondsElapsed(0);
    // Clear the search query parameter from the URL
    router.push("/wine/*");
  }

  return (
    <div className="">
      <Card className="">
        <h1 className="text-base font-semibold ml-4 my-2">Search wines</h1>
        {loading && (
          <div className="text-center text-primary text-base">
            Loading...{secondsElapsed}
          </div>
        )}
        {/* <Separator className="bg-slate-600 mb-2" /> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 md:space-y-6 px-2"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Wine</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Wine name"
                      className="text-lg md:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Country</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Country"
                      className="text-lg md:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Vintage</FormLabel> */}
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Region"
                      className="text-lg md:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subRegion"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Rack</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Sub Region"
                      className="text-lg md:text-sm"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center pb-4">
              <Button type="button" variant="icon" size="icon" onClick={cancel}>
                <XCircle />
              </Button>{" "}
              <Button type="submit" variant="icon" size="icon">
                <Search />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
