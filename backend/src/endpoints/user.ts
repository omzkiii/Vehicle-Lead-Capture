import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../index.js";

export const user = Router();

user.get("/users", async (req: Request, res: Response) => {
  const data = await prisma.user.findMany({
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
  });
  const users = data.map((d) => ({
    ...d,
    source: d.source.name,
    status: d.status.name,
    vehicleOfInterest: d.vehicleOfInterest.name,
  }));
  res.send(users);
});
