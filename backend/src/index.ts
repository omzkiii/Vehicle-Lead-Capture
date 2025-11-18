import express from "express";
import type { Response, Request } from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import cors from "cors";
import { createClient } from "redis";
import { user } from "./endpoints/user.js";
import { seed } from "./seed.js";
import { source } from "./endpoints/source.js";
import { vehicle } from "./endpoints/vehicle.js";

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

export const prisma = new PrismaClient();

export const redis = createClient({ url: process.env.REDIS_URL! });
redis.on("error", (err) => console.log(err));
redis.connect();

async function main() {
  // Endpoints
  app.get("/seed", async (req: Request, res: Response) => {
    await seed();
    res.send("OK");
  });

  app.use(user);
  app.use(source);
  app.use(vehicle);

  app.listen(PORT, () => {
    console.log(`Listening to ${PORT}...`);
  });
}

main().catch(console.error);

const cleanup = async () => {
  console.log("Disconnecting Prisma and Redis...");
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
