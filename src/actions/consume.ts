"use server";

import prisma from "@/lib/prisma";

// Fetch consumedbottles by page
export async function getConsumedBottlesPage(page: number) {
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
    skip: (page - 1) * 10,
    take: 10,
  });

  // get count of all consumed bottles
  const count = await prisma.bottle.count({
    where: {
      consume: {
        not: null,
      },
    },
  });
  //reteurn consumedBottles and totalPages
  return { consumedBottles: consumedBottles, count: Math.ceil(count / 10) };
  //   return consumedBottles;
}
