import type { User } from "./generated/prisma/client.js";
import { prisma } from "./index.js";

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

export async function insertUser(u: UserData) {
  const [source, vehicleOfInterest, status] = await Promise.all([
    prisma.source.upsert({
      where: { name: u.source },
      create: { name: u.source },
      update: {},
    }),
    prisma.vehicleOfInterest.upsert({
      where: { name: u.vehicleOfInterest },
      create: { name: u.vehicleOfInterest },
      update: {},
    }),
    prisma.status.upsert({
      where: { name: u.status },
      create: { name: u.status },
      update: {},
    }),
  ]);

  const user: User = {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    dateReceived: new Date(u.dateReceived),
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
