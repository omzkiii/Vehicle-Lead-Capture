import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";
import { insertUser } from "../utils.js";
import { invalidateCache, refreshUserCache } from "./refreshCache.js";

export const user = Router();

user.get("/users", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

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
      skip,
      take: limit,
      orderBy: { dateReceived: "desc" },
    });

    const users = data.map((d) => ({
      ...d,
      source: d.source.name,
      status: d.status.name,
      vehicleOfInterest: d.vehicleOfInterest.name,
    }));

    console.log(users.length);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

user.post("/users", async (req: Request, res: Response) => {
  try {
    let old;
    if (req.body.id !== "") {
      old = await prisma.user.findUnique({
        where: { id: req.body.id },
      });
    }
    const createdUser = await insertUser(req.body);
    invalidateCache(createdUser, old);
    res.status(201).json(createdUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

user.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Missing user id" });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    invalidateCache(deletedUser);
    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (err: any) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
