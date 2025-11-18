import { Router } from "express";
import type { Request, Response } from "express";
import { prisma, redis } from "../index.js";

export const source = Router();

source.get("/sources", async (req: Request, res: Response) => {
  const cached = await redis.get("sources");
  if (cached) {
    res.send(JSON.parse(cached));
  } else {
    const sources = await prisma.source.findMany({
      select: { name: true },
    });
    await redis.set("sources", JSON.stringify(sources), { EX: 60 });
    res.send(sources);
  }
});
