"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";

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
import { updateBottle } from "@/actions/bottle";
import { useContext } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { BottlesSearchContext } from "@/app/contexts/BottlesSearchContext";

// type TBottleConsume = {
//   id: number;
//   vintage: number;
//   rack: string;
//   consume?: Date;
//   occasion?: string;
// };

// make zod schema for form.
const BottleFormSchema = z.object({
  vintage: z.number(),
  rack: z.string(),
  consume: z
    .date()
    .optional()
    .refine((value) => value !== undefined, {
      message: "Consume date is required",
    }),
  occasion: z.string().optional(),
});

type BottleFormValues = z.infer<typeof BottleFormSchema>;

interface BottleFormProps {
  // btl: TBottleConsume;
  dialogClose: () => void;
}

export function BottleConsumeForm({ dialogClose }: BottleFormProps) {
  const { updateBottlesFoundArray, bottleToEdit } =
    useContext(BottlesSearchContext);

  const defaultValues = {
    vintage: bottleToEdit!.vintage,
    rack: bottleToEdit!.rack,
    consume: undefined,
    occasion: undefined,
  };

  // Define form.
  const form = useForm<BottleFormValues>({
    resolver: zodResolver(BottleFormSchema),
    defaultValues,
  });

  // submit handler.
  async function onSubmit(values: BottleFormValues) {
    console.log(values);
    if (values.consume !== undefined) {
      const a = await updateBottle(values, bottleToEdit!.id as number);
      if (a && a.data !== undefined) {
        const dataWithNoteCount = { ...a.data, noteCount: 0 };
        updateBottlesFoundArray!(dataWithNoteCount, "D");
      }
    } else {
      toast.error("Please select a date");
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
        {/* Consume & Occasion */}
        <div className="flex flex-row gap-4">
          <div className="w-1/2 mt-2.5">
            <FormField
              control={form.control}
              name="consume"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Consume date</FormLabel>
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
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
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
        <FormField
          control={form.control}
          name="vintage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rack"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-4">
          <Button variant="secondary" size="xs" type="button" onClick={cancel}>
            Cancel
          </Button>
          <Button variant="default" size="xs" type="submit">
            Consume
          </Button>
        </div>
      </form>
    </Form>
  );
}
