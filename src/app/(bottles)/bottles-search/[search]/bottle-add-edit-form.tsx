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
import { BottleFormSchema1, BottleSearchSchema } from "@/lib/schema";
import { addBottle, updateBottle } from "@/actions/bottle";
import React from "react";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";
import { TBottle } from "@/types/bottle";

// type BottleFormValues = z.infer<typeof BottleFormSchema1>;
type BottleFormValues = {
  vintage: string;
  rack: string;
  shelf?: string | null;
  cost?: string | null;
};

interface BottleFormProps {
  // btl: any | null;
  dialogClose: () => void;
  bottleFormType: string;
}

export function BottleAddEditForm({
  // btl,
  dialogClose,
  bottleFormType,
}: BottleFormProps) {
  const { updateBottlesFoundArray, bottleToEdit } =
    React.useContext(BottlesSearchContext);
  console.log(bottleToEdit, bottleFormType);
  const defaultValues = {
    vintage: bottleFormType === "A" ? "2020" : bottleToEdit?.vintage.toString(),
    rack: bottleFormType === "A" ? "" : bottleToEdit?.rack,
    shelf: bottleFormType === "A" ? "" : bottleToEdit?.shelf || "",
    cost: bottleFormType === "A" ? "" : bottleToEdit?.cost?.toString(),
  };

  console.log(
    "BottleAddEditForm ",
    bottleToEdit,
    // "btl = ",
    // btl,
    bottleFormType,
    defaultValues
  );
  // Define form.
  const form = useForm<BottleFormValues>({
    resolver: zodResolver(BottleFormSchema1),
    defaultValues,
  });

  // submit handler.
  async function onSubmit(values: BottleFormValues) {
    console.log("On submit [", bottleFormType, "]", values);
    const formattedValues = {
      vintage: parseInt(values.vintage),
      rack: values.rack,
      shelf: values.shelf ? values.shelf : undefined,
      cost: values.cost ? parseInt(values.cost) : undefined,
    };

    if (bottleFormType === "E") {
      const a = await updateBottle(formattedValues, bottleToEdit!.id as number);
      if (a) {
        const dataWithNoteCount = {
          ...a.data,
          noteCount: bottleToEdit!.noteCount,
        };
        updateBottlesFoundArray!(dataWithNoteCount, "E");
      }
    }
    if (bottleFormType === "A") {
      const a = await addBottle(
        formattedValues,
        bottleToEdit!.wineId as number
      );
      if (a && a.data) {
        const dataWithNoteCount = { ...a.data, noteCount: 0 };
        updateBottlesFoundArray!(dataWithNoteCount, "A");
      }
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
                    <Input type="number" {...field} value={field.value || 0} />
                    {/* <Input type="number" {...field} /> */}
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
                    <Input {...field} value={field.value || ""} />
                    {/* <Input {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          {/* Edit Button*/}
          <Button variant="outline" size="icon" type="submit">
            {/* <Pencil className="h-4 w-4" /> */}
            {bottleFormType === "E" ? "Edit" : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
