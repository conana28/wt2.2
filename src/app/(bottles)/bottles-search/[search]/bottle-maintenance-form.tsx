"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CalendarIcon,
  Pencil,
  Plus,
  PocketKnifeIcon,
  Trash2,
  X,
} from "lucide-react";

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
import { BottleFormSchema1, BottleSearchSchema } from "@/lib/schema";
import {
  addBottle,
  searchBottles,
  searchBottles1,
  updateBottle,
} from "@/actions/bottle";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bottle } from "@prisma/client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type BottleFormValues = z.infer<typeof BottleFormSchema1>;
interface BottleFormProps {
  btl: any | null;
  dialogClose: () => void;
  // setOpenDialog: (b: boolean) => void;
  // setUpdatedBottle: (b: Bottle) => void;
  // setAddedBottle: (b: Bottle) => void;
  // setDeletedBottle: (b: number) => void;
  // setConsumedBottle: (b: number) => void;
}

export function BottleMaintenanceForm({ btl, dialogClose }: BottleFormProps) {
  const [isConsume, setIsConsume] = useState(false); // show/hide the consume fields
  const [formType, setFormType] = useState("E"); // Form action A = Add, E = Edit, D = Delete C = Consume
  const defaultValues = {
    vintage: btl?.vintage,
    rack: btl?.rack,
    shelf: btl?.shelf === null ? undefined : btl?.shelf,
    cost: btl?.cost === null ? undefined : btl?.cost,
    occasion: "",
    consume: undefined,
  };

  // Define form.
  const form = useForm<BottleFormValues>({
    resolver: zodResolver(BottleFormSchema1),
    defaultValues,
  });

  // submit handler.
  async function onSubmit(values: BottleFormValues) {
    console.log(formType, values);
    if (formType === "E") {
      const a = await updateBottle(values, btl.id as number);
    }
    if (formType === "A") {
      const a = await addBottle(values, btl.wineId as number);
    }
    form.reset();
    dialogClose();
  }

  function cancel() {
    console.log("Cancel");
    form.reset();
    dialogClose();
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
                  onClick={cancel}
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
          {/* Delete Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => {
                    if (btl && btl.id) {
                      //   deleteBottleHandler(btl.id as number);
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
          {/* Add Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="submit"
                  onClick={() => setFormType("A")}
                >
                  <Plus className="h-4 w-4" />
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
                  type="submit"
                  onClick={() => {
                    setIsConsume(!isConsume);
                    setFormType("C");
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
          {/* Edit Button*/}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  type="submit"
                  onClick={() => setFormType("E")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={0} align="end">
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <Button size="xs" type="submit">
            {isConsume ? "Consume" : "Edit"}
          </Button> */}
        </div>
      </form>
    </Form>
  );
}
