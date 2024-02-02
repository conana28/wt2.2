"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NoteFormSchema } from "@/lib/schema";
// import { addNote, updateNote } from "@/actions/wine";
import { useContext } from "react";
import { Edit } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addNote } from "@/actions/note";

type NoteFormValues = z.infer<typeof NoteFormSchema>;

interface NoteFormProps {
  formType: string;
  note?: NoteFormValues;
  vintage: number;
  wid: number;
}

export function NoteForm({
  formType,
  note,
  vintage = 2020,
  wid,
}: NoteFormProps) {
  const defaultValues: Partial<NoteFormValues> = {
    author: note?.author ?? "",
    rating: note?.rating ?? "",
    noteText: note?.noteText ?? "",
    drinkFrom: note?.drinkFrom ?? "",
    drinkTo: note?.drinkTo ?? "",
    vintage: vintage,
  };
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues,
  });

  async function onSubmit(data: NoteFormValues) {
    console.log("Submit ", data);
    let result;
    if (formType === "A") {
      result = await addNote(data, wid);
    } else {
      // result = await updateNote(data, wid);
    }

    if (!result) {
      alert("Something went wrong - Add Wine");
      return;
    }

    // if (result.error) {
    //   // set local error state
    //   alert(result.error);
    //   return;
    // }

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-row gap-4">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Author..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input placeholder="Rating..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="noteText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note text..." {...field} />
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
              name="drinkFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drink from</FormLabel>
                  <FormControl>
                    <Input placeholder="From..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="drinkTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drink to</FormLabel>
                  <FormControl>
                    <Input placeholder="To..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          name="vintage"
          control={form.control}
          render={({ field }) => (
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          )}
        />
        <div className="flex items-center justify-end space-x-4">
          {/* <Button size="xs" variant="secondary" onClick={() => null}>
            Cancel
          </Button> */}
          <Button size="xs" type="submit">
            {formType === "A" ? "Add" : "Edit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
