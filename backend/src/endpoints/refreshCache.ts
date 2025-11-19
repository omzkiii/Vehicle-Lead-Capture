import type { User } from "../generated/prisma/client.js";
import { prisma, redis } from "../index.js";

export const CACHE_TTL = 60;

export async function refreshUserCache() {
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
    orderBy: { dateReceived: "desc" },
  });
  const users = data.map((d) => ({
    ...d,
    source: d.source.name,
    status: d.status.name,
    vehicleOfInterest: d.vehicleOfInterest.name,
  }));
  await redis.set("users", JSON.stringify(users), { EX: CACHE_TTL });
  return users;
}

export async function invalidateCache(user: User, old?: User | null) {
  const pageKeys = await redis.keys("users:page:*");
  const keys = [
    ...pageKeys,
    `users:status:${old?.statusId}`,
    `users:source:${old?.sourceId}`,
    `users:voi:${old?.vehicleOfInterestId}`,
    `users:status:${user.statusId}`,
    `users:source:${user.sourceId}`,
    `users:voi:${user.vehicleOfInterestId}`,
  ];
  await Promise.all(keys.map((k) => redis.del(k)));
}
