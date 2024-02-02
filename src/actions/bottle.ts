"use server";

import { z } from "zod";
import {
  BottleFormSchema1,
  BottleSearchSchema,
  BottleConsumeFormSchema,
} from "@/lib/schema";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TBottle, TCBottle } from "@/types/bottle";
import { tr } from "date-fns/locale";

// Check if bottle exists with wineId.  Called during wine delete
export async function checkBottleExists(wineId: number) {
  const bottle = await prisma.bottle.findFirst({
    where: {
      wineId: wineId,
    },
  });
  if (!bottle) {
    return false;
  }
  return true;
}

// Fetch count of all bottles
export async function getBottleCount() {
  const bottleCount = await prisma.bottle.count({
    where: {
      consume: null,
    },
  });
  return bottleCount;
}
// Fetch all consumedbottles
export async function getConsumedBottles() {
  const consumedBottles = await prisma.bottle.findMany({
    where: {
      consume: {
        not: null,
      },
    },
    select: {
      id: true,
      vintage: true,
      rack: true,
      shelf: true,
      cost: true,
      consume: true,
      occasion: true,
      wineId: true,
      wine: {
        select: {
          producer: true,
          wineName: true,
          country: true,
        },
      },
    },
    orderBy: { consume: "desc" },
  });
  return consumedBottles;
}

// Fetch all bottles
export async function getBottlesInCellar() {
  const bottles = await prisma.bottle.findMany({
    where: {
      consume: null,
    },
    select: {
      id: true,
      vintage: true,
      rack: true,
      shelf: true,
      cost: true,
      consume: true,
      occasion: true,
      wineId: true,
      wine: {
        select: {
          producer: true,
          wineName: true,
          country: true,
        },
      },
    },
  });

  // Get number of notes for each bottle
  const wineIdsAndVintages = bottles.map(({ wineId, vintage }) => ({
    wineId,
    vintage,
  }));
  const notes = await prisma.note.findMany({
    where: {
      wineId: { in: wineIdsAndVintages.map((v) => v.wineId) },
      vintage: { in: wineIdsAndVintages.map((v) => v.vintage) },
    },
  });
  const notesByWineIdAndVintage = groupBy(
    notes,
    (note) => `${note.wineId}-${note.vintage}`
  );

  const bottlesWithNoteCount = bottles.map((bottle) => ({
    ...bottle,
    noteCount:
      notesByWineIdAndVintage.get(`${bottle.wineId}-${bottle.vintage}`)
        ?.length ?? 0,
  }));

  return { bottlesWithNoteCount };
}

// Fetch count of all consumedbottles
export async function getConsumeBottleCount() {
  const consumeBottleCount = await prisma.bottle.count({
    where: {
      consume: {
        not: null,
      },
    },
  });
  return consumeBottleCount;
}
// Fetch count of all bottles with a unique wineId and where consume is null
export async function getUniqueBottleCount() {
  const uniqueBottleCount = await prisma.bottle.groupBy({
    by: ["wineId"],
    _count: {
      wineId: true,
    },
    where: {
      consume: null,
    },
  });
  return uniqueBottleCount.length;
}
// Fetch count of bottles by country
export async function getBottlesByCountry() {
  const bottles = await prisma.bottle.findMany({
    where: {
      consume: null,
    },
    select: {
      id: true,
      wine: {
        select: {
          country: true,
        },
      },
    },
  });
  return bottles;
}
export async function getBottlesByVintage(country: string, vintage: number) {
  let whereClause: Prisma.BottleWhereInput = {
    consume: null,
  };
  // Add vintage to where clause if not 0
  if (vintage !== 0) {
    whereClause.vintage = +vintage;
  }
  if (country !== "All") {
    whereClause.wine = {
      country: country,
    };
  }
  const bottles = await prisma.bottle.findMany({
    where: whereClause,
    select: {
      id: true,
      vintage: true,
      rack: true,
      shelf: true,
      cost: true,
      wine: {
        select: {
          producer: true,
          wineName: true,
          country: true,
        },
      },
    },
  });
  // console.log(bottles);
  return bottles;
}

export async function getBottleCountByVintage(
  country: string,
  vintage: number
) {
  // const data =
  //   await prisma.$queryRaw`SELECT vintage, COUNT(*) FROM "Bottle" GROUP BY vintage ORDER BY vintage ASC;`;

  let whereClause: Prisma.BottleWhereInput = {
    consume: null,
  };

  if (country !== "All") {
    whereClause.wine = {
      country: country,
    };
  }

  if (country === "Other") {
    whereClause.wine = {
      country: {
        notIn: [
          "New Zealand",
          "France",
          "Italy",
          "Australia",
          "Spain",
          "Germany",
        ],
      },
    };
  }

  if (vintage !== 0) {
    whereClause.vintage = +vintage;
  }

  const bottleCountByVintage = await prisma.bottle.groupBy({
    // where: {
    //   consume: null,
    //   wine: {
    //     country: country,
    //   },
    // },
    where: whereClause,
    by: ["vintage"],
    _count: {
      vintage: true,
    },

    orderBy: {
      vintage: "asc",
    },
  });

  return { bottleCountByVintage };
}

type Inputs = z.infer<typeof BottleSearchSchema>;

export async function searchBottles(data: Inputs) {
  const result = BottleSearchSchema.safeParse(data);
  // console.log(result);
  if (result.success) {
    // console.log(result.data);
    try {
      const bottles = await prisma.bottle.findMany({
        where: {
          wine: {
            OR: [
              {
                producer: {
                  contains: result.data.search,
                  mode: "insensitive",
                },
              },
              {
                wineName: {
                  contains: result.data.search,
                  mode: "insensitive",
                },
              },
            ],
            AND: [
              {
                country: {
                  contains: result.data.country,
                  mode: "insensitive",
                },
              },
            ],
          },

          rack: {
            contains: result.data.rack,
            mode: "insensitive",
          },

          // vintage: {
          //   equals: parseInt(result.data.vintage),
          // },
          // You can use "equals" to filter by a specific rack, or "equals" or "in" for an array of racks.
          consume: {
            equals: null,
          },
        },

        select: {
          id: true,
          vintage: true,
          rack: true,
          shelf: true,
          cost: true,
          wine: {
            select: {
              id: true,
              producer: true,
              wineName: true,
              country: true,
            },
          },
        },
        orderBy: {
          vintage: "asc",
        },
      });

      if (!bottles) {
        console.log("Bottle - Something went wrong");
        return;
      }
      return { bottles };
    } catch (error) {
      return { error };
    }
    // return { success: true, data: result.data };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

type In = z.infer<typeof BottleFormSchema1>;

export async function addBottle(data: In, id: number) {
  const result = BottleFormSchema1.safeParse(data);
  // console.log("Parse Bottle", result, "Id", id);

  if (result.success) {
    // Add to DB
    const wine = await prisma.bottle.create({
      data: {
        vintage: result.data.vintage,
        rack: result.data.rack,
        shelf: result.data.shelf === "" ? null : result.data.shelf,
        cost: result.data.cost === 0 ? null : result.data.cost,
        consume: result.data.consume === null ? null : result.data.consume,
        occasion: result.data.occasion === "" ? null : result.data.occasion,
        wineId: id,
      },
      include: {
        wine: true, // Include the related wine data
      },
    });
    // revalidatePath("/");
    return { success: true, data: wine };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function updateBottle(data: In, id: number) {
  const result = BottleFormSchema1.safeParse(data);

  if (result.success) {
    // Add to DB
    const btl = await prisma.bottle.update({
      where: { id },
      data: {
        vintage: result.data.vintage,
        rack: result.data.rack,
        shelf: result.data.shelf === "" ? null : result.data.shelf,
        cost: result.data.cost === 0 ? null : result.data.cost,
        occasion: result.data.occasion === "" ? null : result.data.occasion,
        consume: result.data.consume === undefined ? null : result.data.consume,
      },
      include: {
        wine: true, // Include the related wine data
      },
    });
    revalidatePath("/");
    return { success: true, data: btl };
  }
}
export async function consumeBottle(
  data: z.infer<typeof BottleConsumeFormSchema>,
  id: number
) {
  const result = BottleConsumeFormSchema.safeParse(data);
  console.log("Parse", result);

  if (result.success) {
    // Add to DB
    const btl = await prisma.bottle.update({
      where: { id },
      data: {
        consume: result.data.consume,
        occasion: result.data.occasion,
      },
    });
    // Revalidate data
    revalidatePath("/");
    return { success: true, data: result.data };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

export async function deleteBottle(id: number) {
  console.log("Delete bottle", id);
  try {
    await prisma.bottle.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function deleteBottle1(id: number) {
  console.log("Delete bottle 1", id);
  try {
    const d = await prisma.bottle.delete({
      where: { id },
      select: {
        id: true,
        vintage: true,
        rack: true,
        shelf: true,
        cost: true,
        wineId: true,
        consume: true,
        occasion: true,
        wine: {
          select: {
            producer: true,
            wineName: true,
            country: true,
          },
        },
      },
    });
    revalidatePath("/");
    console.log(d);
    return { success: true, data: d };
  } catch (error) {
    return { success: false, error };
  }
}

export async function searchBottles1(data: Inputs) {
  // console.log(data);
  const result = BottleSearchSchema.safeParse(data);
  // create a simple groupBy function

  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  // const countryCondition =
  //   result.data.country !== ""
  //     ? {
  //         country: {
  //           equals: result.data.country,
  //           mode: "insensitive",
  //         } as Prisma.StringFilter<"Wine">, // Cast as StringFilter
  //       }
  //     : {};

  let whereClause: Prisma.BottleWhereInput = {
    wine: {
      OR: [
        {
          producer: {
            contains: result.data.search,
            mode: "insensitive",
          },
        },
        {
          wineName: {
            contains: result.data.search,
            mode: "insensitive",
          },
        },
        // countryCondition, // Use the countryCondition variable
      ],
      AND: [
        {
          country: {
            contains: result.data.country,
            mode: "insensitive",
          },
        },
      ],
    },
    rack: {
      contains: result.data.rack,
      mode: "insensitive",
    },
    consume: null,
  };
  if (data.vintage !== "" && data.vintage !== undefined) {
    whereClause.vintage = {
      equals: parseInt(data.vintage),
    };
  }
  try {
    // console.log(JSON.stringify(whereClause, null, 2));
    const bottles = await prisma.bottle.findMany({
      where: whereClause,

      select: {
        id: true,
        vintage: true,
        rack: true,
        shelf: true,
        cost: true,
        wineId: true,
        consume: true,
        occasion: true,
        wine: {
          select: {
            id: true,
            producer: true,
            wineName: true,
            country: true,
          },
        },
      },
      orderBy: [
        {
          wine: {
            producer: "asc",
          },
        },
        {
          wine: {
            wineName: "asc",
          },
        },
        {
          vintage: "asc",
        },
      ],
    });

    if (!bottles) {
      console.error("Bottle - Something went wrong");
      return;
    }

    // Get number of notes for each bottle
    const wineIdsAndVintages = bottles.map(({ wineId, vintage }) => ({
      wineId,
      vintage,
    }));
    const notes = await prisma.note.findMany({
      where: {
        wineId: { in: wineIdsAndVintages.map((v) => v.wineId) },
        vintage: { in: wineIdsAndVintages.map((v) => v.vintage) },
      },
    });
    const notesByWineIdAndVintage = groupBy(
      notes,
      (note) => `${note.wineId}-${note.vintage}`
    );

    const bottlesWithNoteCount = bottles.map((bottle) => ({
      ...bottle,
      noteCount:
        notesByWineIdAndVintage.get(`${bottle.wineId}-${bottle.vintage}`)
          ?.length ?? 0,
    }));

    return { bottlesWithNoteCount };
    // return { bottles };
  } catch (error) {
    console.error("Error1: ", error);
    return { error };
  }
}

function groupBy<T>(
  array: T[],
  keyGetter: (item: T) => string
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
