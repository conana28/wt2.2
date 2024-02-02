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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type BottleFormValues = z.infer<typeof BottleFormSchema1>;

interface BottleFormProps {
  bottle: Bottle | null;
  updateBottleArray: (response: { success: boolean; data: Bottle }) => void;
  addBottleToBottlesArray: (response: {
    success: boolean;
    data: Bottle;
  }) => void;
  deleteBottleFromBottlesArray: (response: { success: boolean }) => void;
  setOpenDialog: (b: boolean) => void;
}

export function BottleMaintainForm({
  bottle,
  updateBottleArray,
  addBottleToBottlesArray,
  deleteBottleFromBottlesArray,
  setOpenDialog,
}: BottleFormProps) {
  const { showAction, setShowAction, wine } = useContext(WineContext);
  const defaultValues: Partial<BottleFormValues> = {
    vintage: bottle?.vintage,
    rack: bottle?.rack,
    shelf: bottle?.shelf === null ? undefined : bottle?.shelf,
    cost: bottle?.cost === null ? undefined : bottle?.cost,
    occasion: "",
    consume: undefined,
  };
  const form = useForm<BottleFormValues>({
    resolver: zodResolver(BottleFormSchema1),
    defaultValues,
  });
  const [isConsume, setIsConsume] = useState(false);

  async function onSubmit(data: BottleFormValues) {
    console.log("Form Submit ", data);

    if (bottle) {
      const result = await updateBottle(data, bottle.id); // Update the bottle table
      if (result) {
        if (isConsume) {
          deleteBottleFromBottlesArray(result);
        } else {
          updateBottleArray(result);
        }
      } else {
        alert("Something went wrong - Update Bottle");
      }
      if (!result) {
        alert("Something went wrong - Update Bottle");
        return;
      }
      console.log("Updated bottle", result);
    }
    setOpenDialog(false);
  }

  async function addBottleHandler(data: BottleFormValues) {
    const result = await addBottle(data, wine.id); // Add a bottle (pass wine id)
    if (result && result.success && result.data) {
      addBottleToBottlesArray(result);
    } else {
      alert("Something went wrong - Add Bottle");
    }
    setOpenDialog(false);
  }

  async function deleteBottleHandler(bid: number) {
    if (bid) {
      const result = await deleteBottle(bid); // Update the bottle table
      deleteBottleFromBottlesArray(result);
      if (!result.success) {
        alert("Something went wrong - Delete Bottle");
        return;
      }
      setOpenDialog(false);
    }
  }

  return (
    <Form {...form}>
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
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                              <span>Pick a date</span>
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setOpenDialog(false)}
                >
                  <X className="h-4 w-4" />
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

          {/* <Button
            size="xs"
            variant="secondary"
            type="button"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button> */}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => {
                    if (bottle && bottle.id) {
                      deleteBottleHandler(bottle.id as number);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <Button
            size="xs"
            variant="destructive"
            type="button"
            // onClick={() => setOpenDialog(false)}
            onClick={() => {
              if (btl && btl.id) {
                deleteBottleHandler(btl.id as number);
              }
            }}
          >
            Delete
          </Button> */}
          {/* <Button
            size="xs"
            variant="secondary"
            type="button"
            onClick={() => {
              addBottleHandler(form.getValues() as BottleFormValues);
            }}
          >
            Add
          </Button> */}
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
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Add</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Consume */}

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
                  <PocketKnifeIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Consume</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button size="xs" type="submit">
            {isConsume ? "Consume" : "Edit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
