import { z } from "zod";

// export const WineSearchSchema = z.object({
//   //   search: z.string(),
//   search: z.string().nonempty("Search is required."),
//   //   message: z
//   //     .string()
//   //     .nonempty('Message is required.')
//   //     .min(6, { message: 'Message must be at least 6 characters.' })
// });

export const WineSearchSchema = z
  .object({
    search: z.string().optional(),
    country: z.string().optional(),
    region: z.string().optional(),
    subRegion: z.string().optional(),
  })
  .refine(
    (data) => {
      const values = Object.values(data);
      return values.some(
        (value) => value !== "" && value !== null && value !== undefined
      );
    },
    {
      message: "Must select at least one search criteria",
      path: ["search"],
    }
  );

export const WineFormDataSchema = z.object({
  producer: z.string().min(1, "Producer is required."),
  wineName: z.string().min(1, "Wine name is required."),
  country: z.string().min(1, "Country is required."),
  region: z.string().min(1, "Region is required."),
  subRegion: z.string().optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
});

export const BottleSearchSchema = z
  .object({
    search: z.string().optional(),
    // vintage: z.coerce.number().optional(),
    vintage: z.string().optional(),
    // .refine((value) => value === "" || !isNaN(Number(value)), {
    //   message: "Please enter a valid number or leave it blank",
    // }),
    country: z.string().optional(),
    rack: z.string().optional(),
  })
  .refine(
    (data) => {
      const values = Object.values(data);
      return values.some(
        (value) => value !== "" && value !== null && value !== undefined
      );
    },
    {
      message: "Must select at least one search criteria",
      path: ["search"],
    }
  );

export const BottleFormSchema = z.object({
  vintage: z.coerce.number().min(1970, "Vintage is required."),
  rack: z.string().min(1, "Rack name is required."),
  shelf: z.string().optional(),
  cost: z.coerce.number().optional(),
  qty: z.coerce.number().min(1, "Qty must be 1 or more"),
});

export const BottleFormSchema1 = z.object({
  vintage: z.coerce.number().min(1970, "Vintage is required."),
  rack: z.string().min(1, "Rack name is required."),
  shelf: z.string().optional(),
  cost: z.coerce.number().optional(),
  consume: z.date().optional(),
  occasion: z.string().optional(),
});

export const BottleConsumeFormSchema = z.object({
  consume: z.date(),
  occasion: z.string().optional(),
});

export const NoteFormSchema = z.object({
  vintage: z.coerce.number().min(1970, "Vintage is required."),
  author: z.string().min(1, "Author is required."),
  noteText: z.string().optional(),
  rating: z.string().min(1, "Rating is required."),
  drinkFrom: z.string().optional(),
  drinkTo: z.string().optional(),
});
