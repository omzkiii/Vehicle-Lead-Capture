import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { CACHE_TTL } from "./refreshCache.js";
import { v4 as uuid } from "uuid";

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

vehicle.post("/vehicles", async (req: Request, res: Response) => {
  const vehicle = req.body;

  try {
    const createdVehicle = await prisma.vehicleOfInterest.upsert({
      where: { name: vehicle.name },
      create: { id: uuid(), name: vehicle.name },
      update: { name: vehicle.name },
    });
    redis.del(`users:voi:${createdVehicle.id}`);
    redis.del(`vehicles`);
    res.status(201).json(createdVehicle);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message || "Internal server error" });
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

vehicle.delete("/vehicles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    const deletedVehicle = await prisma.vehicleOfInterest.delete({
      where: { id },
    });

    redis.del(`users:voi:${deletedVehicle.id}`);
    redis.del(`vehicles`);
    res.status(200).json({ message: "Vehicle deleted", user: deletedVehicle });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Vehicle not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
