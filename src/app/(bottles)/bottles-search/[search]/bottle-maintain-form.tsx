"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BottleFormSchema1 } from "@/lib/schema";
import { useContext, useState } from "react";
import { WineContext } from "@/app/contexts/WineContext";
import { addBottle, updateBottle, deleteBottle } from "@/actions/bottle";
import { Bottle } from "@prisma/client";
import { X, Trash2, Plus, PocketKnifeIcon, CalendarIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";
import { TBottle } from "@/types/bottle";
// import { setTimeout } from "timers/promises";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type BottleFormValues = z.infer<typeof BottleFormSchema1>;

export function BottleMaintainForm({
  setOpenDialog,
}: {
  setOpenDialog: (open: boolean) => void;
}) {
  const { bottleToEdit, updateBottlesFoundArray } =
    useContext(BottlesSearchContext);

  const defaultValues: Partial<BottleFormValues> = {
    vintage: bottleToEdit?.vintage,
    rack: bottleToEdit?.rack,
    shelf: bottleToEdit?.shelf === null ? undefined : bottleToEdit?.shelf,
    cost: bottleToEdit?.cost === null ? undefined : bottleToEdit?.cost,
    occasion: "",
    consume: undefined,
  };
  const form = useForm<BottleFormValues>({
    resolver: zodResolver(BottleFormSchema1),
    defaultValues,
  });
  const [isConsume, setIsConsume] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function onSubmit(data: BottleFormValues) {
    console.log("Form Submit ", data);

    if (bottleToEdit) {
      setIsUpdating(true);
      const result = await updateBottle(data, bottleToEdit.id); // Update the bottle table
      if (result) {
        const updatedBottle = { ...result.data, noteCount: 0 };
        if (isConsume) {
          updateBottlesFoundArray(updatedBottle, "D");
        } else {
          updateBottlesFoundArray(updatedBottle, "E");
        }
      } else {
        alert("Something went wrong - Update Bottle");
      }
      if (!result) {
        alert("Something went wrong - Update Bottle");
        return;
      }
      // Simulate a delay if we are on localhost
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        await delay(2000);
      }
      setIsUpdating(false);
      console.log("Updated bottle", result);
    }
    setOpenDialog(false);
  }

  async function addBottleHandler(data: BottleFormValues) {
    setIsUpdating(true);
    const result = await addBottle(data, bottleToEdit!.wineId); // Add a bottle (pass wine id)
    if (result && result.success && result.data) {
      const updatedBottle = { ...result.data, noteCount: 0 };
      updateBottlesFoundArray(updatedBottle, "A");
    } else {
      alert("Something went wrong - Add Bottle");
    }
    // Simulate a delay if we are on localhost
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      await delay(2000);
    }
    setIsUpdating(false);
    setOpenDialog(false);
  }

  async function deleteBottleHandler(bid: number) {
    if (bid) {
      setIsUpdating(true);
      const result = await deleteBottle(bid); // Update the bottle table
      let updatedBottle = { ...bottleToEdit!, noteCount: 0 };
      if (!result.success) {
        alert("Something went wrong - Delete Bottle");
        return;
      }
      updateBottlesFoundArray(updatedBottle, "D");
      setIsUpdating(false);
      setOpenDialog(false);
    }
  }

  return (
    <Form {...form}>
      {isUpdating && (
        // <div className="text-primary text-xl animate-none">Updating...</div>
        <div className="text-yellow-500 text-xl animate-pulse">Updating...</div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="vintage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vintage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="text-lg sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="text-lg sm:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="rack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rack</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-lg sm:text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="shelf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-lg sm:text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Consume & Occasion */}
        {isConsume && (
          <div className="flex flex-row gap-4">
            <div className="w-1/2 mt-2.5">
              <FormField
                control={form.control}
                name="consume"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Consume</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-lg sm:text-sm">
                                Pick a date
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-lg sm:text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-7">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setOpenDialog(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={0}
                align="end"
                alignOffset={0}
              >
                <p>Cancel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Delete Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => {
                    if (bottleToEdit && bottleToEdit.id) {
                      deleteBottleHandler(bottleToEdit.id as number);
                    }
                  }}
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Add Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => {
                    addBottleHandler(form.getValues() as BottleFormValues);
                  }}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Add</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Consume Button*/}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => {
                    setIsConsume(!isConsume);
                  }}
                >
                  <PocketKnifeIcon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Consume</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button size="sm" type="submit">
            <span className="text-lg sm:text-sm">
              {isConsume ? "Consume" : "Edit"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
