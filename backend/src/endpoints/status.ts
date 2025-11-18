import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { CACHE_TTL } from "./refreshCache.js";

export const status = Router();

status.get("/status", async (req: Request, res: Response) => {
  const cached = await redis.get("status");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const status = await prisma.status.findMany();
    await redis.set("status", JSON.stringify(status), { EX: CACHE_TTL });
    res.send(status);
  }
});

status.get("/status/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = await redis.get(`users:status:${id}`);
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const status = await prisma.status.findUnique({
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

    const formattedStatus = status
      ? {
          ...status,
          users: status.users.map((d) => ({
            ...d,
            source: d.source.name,
            status: d.status.name,
            vehicleOfInterest: d.vehicleOfInterest.name,
          })),
        }
      : null;
    await redis.set(`users:status:${id}`, JSON.stringify(formattedStatus), {
      EX: CACHE_TTL,
    });
    res.send(formattedStatus);
  }
});
