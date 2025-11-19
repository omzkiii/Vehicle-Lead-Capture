import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { CACHE_TTL } from "./refreshCache.js";
import { v4 as uuid } from "uuid";

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

status.post("/status", async (req: Request, res: Response) => {
  const status = req.body;
  try {
    const createdStatus = await prisma.status.upsert({
      where: { id: status.id ?? "" },
      create: { id: uuid(), name: status.name },
      update: { name: status.name },
    });
    if (status.id) {
      const keys = await redis.keys("users:*");
      keys.map((k) => redis.del(k));
    }
    redis.del(`users:status:${createdStatus.id}`);
    redis.del(`status`);
    res.status(201).json(createdStatus);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message || "Internal server error" });
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

status.delete("/status/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    const deletedStatus = await prisma.status.delete({
      where: { id: id },
    });

    const keys = await redis.keys("users:*");
    keys.map((k) => redis.del(k));
    redis.del(`users:status:${deletedStatus.id}`);
    redis.del(`status`);
    res.status(200).json({ message: "Status deleted", user: deletedStatus });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Status not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
