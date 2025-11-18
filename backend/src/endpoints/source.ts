import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";

export const source = Router();

source.get("/sources", async (req: Request, res: Response) => {
  const cached = await redis.get("sources");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const sources = await prisma.source.findMany();
    await redis.set("sources", JSON.stringify(sources), { EX: 60 });
    res.send(sources);
  }
});

source.get("/sources/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = await redis.get(`sources:${id}`);
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const sources = await prisma.source.findUnique({
      where: { id: id! },
      include: {
        users: {
          omit: {
            sourceId: true,
            statusId: true,
            vehicleOfInterestId: true,
          },
          include: {
            source: { select: { name: true } },
            status: { select: { name: true } },
            vehicleOfInterest: { select: { name: true } },
          },
          orderBy: { dateReceived: "desc" },
        },
      },
    });

    const formattedSources = sources
      ? {
          ...sources,
          users: sources.users.map((d) => ({
            ...d,
            source: d.source.name,
            status: d.status.name,
            vehicleOfInterest: d.vehicleOfInterest.name,
          })),
        }
      : null;
    await redis.set(`sources:${id}`, JSON.stringify(formattedSources), {
      EX: 60,
    });
    res.send(formattedSources);
  }
});
