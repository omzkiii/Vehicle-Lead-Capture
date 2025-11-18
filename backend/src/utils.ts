import type { User } from "./generated/prisma/client.js";
import { prisma } from "./index.js";
import { v4 as uuid } from "uuid";

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleOfInterest: string;
  status: string;
  dateReceived: string;
  source: string;
};

function toKebabCase(str: string) {
  return str
    .trim()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function insertUser(u: UserData) {
  const [source, vehicleOfInterest, status] = await Promise.all([
    prisma.source.upsert({
      where: { name: capitalizeWords(u.source) },
      create: { name: capitalizeWords(u.source) },
      update: {},
    }),
    prisma.vehicleOfInterest.upsert({
      where: { name: u.vehicleOfInterest },
      create: { name: u.vehicleOfInterest },
      update: {},
    }),
    prisma.status.upsert({
      where: { name: toKebabCase(u.status) },
      create: { name: toKebabCase(u.status) },
      update: {},
    }),
  ]);

  const user: User = {
    id: u.id === "" ? uuid() : u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    dateReceived:
      u.dateReceived === "" ? new Date(Date.now()) : new Date(u.dateReceived),
    sourceId: source.id,
    vehicleOfInterestId: vehicleOfInterest.id,
    statusId: status.id,
  };
  await prisma.user.upsert({
    where: { id: user.id },
    create: user,
    update: {},
  });
}
