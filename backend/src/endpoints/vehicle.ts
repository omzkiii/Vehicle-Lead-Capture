import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";

export const vehicle = Router();

vehicle.get("/vehicles", async (req: Request, res: Response) => {
  const cached = await redis.get("vehicles");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const vehicles = await prisma.vehicleOfInterest.findMany();
    await redis.set("vehicles", JSON.stringify(vehicles), { EX: 60 });
    res.send(vehicles);
  }
});
