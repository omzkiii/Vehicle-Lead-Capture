import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { CACHE_TTL } from "./refreshCache.js";

export const vehicle = Router();

vehicle.get("/vehicles", async (req: Request, res: Response) => {
  const cached = await redis.get("voi");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const vehicles = await prisma.vehicleOfInterest.findMany();
    await redis.set("vehicles", JSON.stringify(vehicles), { EX: CACHE_TTL });
    res.send(vehicles);
  }
});

vehicle.get("/vehicles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const cached = await redis.get(`users:voi:${id}`);
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const vehicles = await prisma.vehicleOfInterest.findUnique({
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

    const formattedVehicles = vehicles
      ? {
          ...vehicles,
          users: vehicles.users.map((d) => ({
            ...d,
            source: d.source.name,
            status: d.status.name,
            vehicleOfInterest: d.vehicleOfInterest.name,
          })),
        }
      : null;
    await redis.set(`users:voi:${id}`, JSON.stringify(formattedVehicles), {
      EX: CACHE_TTL,
    });
    res.send(formattedVehicles);
  }
});
