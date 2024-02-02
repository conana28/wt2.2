"use server";

import { NoteFormSchema } from "@/lib/schema";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type tNote = z.infer<typeof NoteFormSchema>;

export async function getNotes(wid: number, vintage: number) {
  const notes = await prisma.note.findMany({
    where: {
      wineId: wid,
      vintage: vintage,
    },
  });
  return notes;
}

export async function addNote(data: tNote, wid: number) {
  const result = NoteFormSchema.safeParse(data);
  //   console.log("Parse Note", result, "Id", wid);

  if (result.success) {
    // Add to DB
    const wine = await prisma.note.create({
      data: {
        vintage: result.data.vintage,
        author: result.data.author,
        noteText: result.data.noteText === "" ? null : result.data.noteText,
        rating: result.data.rating,
        drinkFrom:
          result.data.drinkFrom === null ? null : result.data.drinkFrom,
        drinkTo: result.data.drinkTo === null ? null : result.data.drinkTo,
        wineId: wid,
      },
    });
    // revalidatePath("/");
    return { success: true, data: wine };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}
