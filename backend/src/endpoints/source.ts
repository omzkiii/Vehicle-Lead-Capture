import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { CACHE_TTL } from "./refreshCache.js";
import { v4 as uuid } from "uuid";

export const source = Router();

source.get("/sources", async (req: Request, res: Response) => {
  const cached = await redis.get("sources");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const sources = await prisma.source.findMany();
    await redis.set("sources", JSON.stringify(sources), { EX: CACHE_TTL });
    res.send(sources);
  }
});

source.post("/sources", async (req: Request, res: Response) => {
  const source = req.body;
  try {
    const createdSource = await prisma.source.upsert({
      where: { id: source.id ?? uuid() },
      create: { id: uuid(), name: source.name },
      update: { name: source.name },
    });
    redis.del(`users:source:${createdSource.id}`);
    redis.del(`sources`);
    res.status(201).json(createdSource);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

source.get("/sources/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = await redis.get(`users:source:${id}`);
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
    await redis.set(`users:source:${id}`, JSON.stringify(formattedSources), {
      EX: CACHE_TTL,
    });
    res.send(formattedSources);
  }
});

source.delete("/sources/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    const deletedSource = await prisma.source.delete({
      where: { id: id },
    });

    redis.del(`users:source:${deletedSource.id}`);
    redis.del(`sources`);
    res.status(200).json({ message: "Source deleted", user: deletedSource });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Source not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
